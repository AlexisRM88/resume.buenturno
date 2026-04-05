import { v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Búsqueda avanzada de candidatos para patronos
export const searchCandidatesFull = query({
  args: {
    locality: v.optional(v.string()),
    zona: v.optional(v.string()),
    skill: v.optional(v.string()),
    availabilityType: v.optional(v.string()),
    salaryExpectation: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Verificar que el caller es employer o admin con suscripción activa
    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const isAdmin = profile?.role === "admin";
    const isActiveEmployer =
      profile?.role === "employer" &&
      profile?.subscriptionStatus === "active" &&
      (!profile?.subscriptionExpiresAt || profile.subscriptionExpiresAt > Date.now());

    if (!isAdmin && !isActiveEmployer) return [];

    // Construir query base
    let results;

    if (args.skill && args.locality) {
      results = await ctx.db
        .query("resume_skills")
        .withIndex("by_skill_locality", (q) =>
          q.eq("skill", args.skill!.toLowerCase()).eq("locality", args.locality!.toLowerCase())
        )
        .filter((q) => q.eq(q.field("isPublic"), true))
        .collect();
    } else if (args.skill) {
      results = await ctx.db
        .query("resume_skills")
        .withIndex("by_skill", (q) => q.eq("skill", args.skill!.toLowerCase()))
        .filter((q) => q.eq(q.field("isPublic"), true))
        .collect();
    } else if (args.locality) {
      results = await ctx.db
        .query("resume_skills")
        .withIndex("by_locality", (q) => q.eq("locality", args.locality!.toLowerCase()))
        .filter((q) => q.eq(q.field("isPublic"), true))
        .collect();
    } else if (args.zona) {
      results = await ctx.db
        .query("resume_skills")
        .withIndex("by_zona", (q) => q.eq("zona", args.zona!))
        .filter((q) => q.eq(q.field("isPublic"), true))
        .collect();
    } else {
      // Sin filtros: retornar todos los públicos (max 100)
      results = await ctx.db
        .query("resume_skills")
        .filter((q) => q.eq(q.field("isPublic"), true))
        .take(100);
    }

    // Filtrar por zona si se especificó y no se usó como índice principal
    if (args.zona && args.skill) {
      results = results.filter((r) => r.zona === args.zona);
    }

    // Filtrar por disponibilidad
    if (args.availabilityType) {
      results = results.filter((r) => r.availabilityType === args.availabilityType);
    }

    // Filtrar por expectativa salarial
    if (args.salaryExpectation) {
      results = results.filter((r) => r.salaryExpectation === args.salaryExpectation);
    }

    // Dedup por resumeId
    const seen = new Set<string>();
    const unique = results.filter((r) => {
      if (seen.has(r.resumeId)) return false;
      seen.add(r.resumeId);
      return true;
    });

    // Cargar resumes completos (máx 50)
    const resumes = await Promise.all(
      unique.slice(0, 50).map((r) => ctx.db.get(r.resumeId))
    );

    return resumes.filter(Boolean);
  },
});

// Obtener perfil público de un candidato (para vista de patrono)
export const getCandidateProfile = query({
  args: { resumeId: v.id("resumes") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const isAdmin = profile?.role === "admin";
    const isActiveEmployer =
      profile?.role === "employer" &&
      profile?.subscriptionStatus === "active" &&
      (!profile?.subscriptionExpiresAt || profile.subscriptionExpiresAt > Date.now());

    if (!isAdmin && !isActiveEmployer) return null;

    const resume = await ctx.db.get(args.resumeId);
    if (!resume || !resume.isPublic) return null;

    // Cargar experiencias también
    const experiences = await ctx.db
      .query("experiences")
      .withIndex("by_resume", (q) => q.eq("resumeId", args.resumeId))
      .collect();

    return { ...resume, experiences };
  },
});
