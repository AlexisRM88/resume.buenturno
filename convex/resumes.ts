import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Obtener el resume del usuario autenticado
export const getMyResume = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

// Obtener resume por slug (perfil público)
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const resume = await ctx.db
      .query("resumes")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    if (!resume || !resume.isPublic) return null;
    return resume;
  },
});

// Crear o actualizar resume (upsert)
export const upsertResume = mutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    locality: v.string(),
    zona: v.optional(
      v.union(
        v.literal("metro"),
        v.literal("norte"),
        v.literal("sur"),
        v.literal("este"),
        v.literal("oeste")
      )
    ),
    skills: v.array(v.string()),
    availabilityType: v.union(
      v.literal("full_time"),
      v.literal("part_time"),
      v.literal("flexible"),
      v.literal("custom")
    ),
    customSchedule: v.optional(
      v.array(
        v.object({
          day: v.string(),
          start: v.string(),
          end: v.string(),
        })
      )
    ),
    salaryExpectation: v.optional(
      v.union(
        v.literal("minimum"),
        v.literal("negotiable"),
        v.literal("custom")
      )
    ),
    salaryExpectationCustom: v.optional(v.string()),
    template: v.union(
      v.literal("elegante"),
      v.literal("moderno"),
      v.literal("minimalista"),
      v.literal("federal")
    ),
    accentColor: v.string(),
    isFederal: v.boolean(),
    isPublic: v.boolean(),
    education: v.optional(
      v.array(
        v.object({
          institution: v.string(),
          degree: v.string(),
          gpa: v.optional(v.string()),
          startDate: v.string(),
          endDate: v.optional(v.string()),
          isCurrent: v.boolean(),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("No autenticado");

    const existing = await ctx.db
      .query("resumes")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, { ...args, updatedAt: now });
      await syncDenormalizedTables(ctx, existing._id, userId, args);
      return existing._id;
    } else {
      const slug = generateSlug(args.fullName);
      const resumeId = await ctx.db.insert("resumes", {
        ...args,
        userId,
        slug,
        createdAt: now,
        updatedAt: now,
      });
      await syncDenormalizedTables(ctx, resumeId, userId, args);
      return resumeId;
    }
  },
});

// Guardar experiencias
export const saveExperiences = mutation({
  args: {
    resumeId: v.id("resumes"),
    experiences: v.array(
      v.object({
        company: v.string(),
        position: v.string(),
        startDate: v.string(),
        endDate: v.optional(v.string()),
        isCurrent: v.boolean(),
        description: v.string(),
        hoursPerWeek: v.optional(v.number()),
        salary: v.optional(v.string()),
        supervisorName: v.optional(v.string()),
        supervisorPhone: v.optional(v.string()),
        canContact: v.optional(v.boolean()),
        employerAddress: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, { resumeId, experiences }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("No autenticado");

    // Borrar experiencias anteriores
    const existing = await ctx.db
      .query("experiences")
      .withIndex("by_resume", (q) => q.eq("resumeId", resumeId))
      .collect();
    for (const exp of existing) {
      await ctx.db.delete(exp._id);
    }

    // Insertar nuevas (máx 3)
    const toInsert = experiences.slice(0, 3);
    for (let i = 0; i < toInsert.length; i++) {
      await ctx.db.insert("experiences", {
        ...toInsert[i],
        resumeId,
        order: i,
      });
    }
  },
});

// Obtener experiencias de un resume
export const getExperiences = query({
  args: { resumeId: v.id("resumes") },
  handler: async (ctx, { resumeId }) => {
    return await ctx.db
      .query("experiences")
      .withIndex("by_resume", (q) => q.eq("resumeId", resumeId))
      .collect();
  },
});

// Búsqueda básica de candidatos (para patronos — versión simple)
export const searchCandidates = query({
  args: {
    skill: v.optional(v.string()),
    locality: v.optional(v.string()),
    availabilityType: v.optional(v.string()),
    zona: v.optional(v.string()),
    salaryExpectation: v.optional(v.string()),
  },
  handler: async (ctx, { skill, locality, availabilityType, zona, salaryExpectation }) => {
    let results;

    if (skill && locality) {
      results = await ctx.db
        .query("resume_skills")
        .withIndex("by_skill_locality", (q) =>
          q.eq("skill", skill).eq("locality", locality)
        )
        .filter((q) => q.eq(q.field("isPublic"), true))
        .collect();
    } else if (skill) {
      results = await ctx.db
        .query("resume_skills")
        .withIndex("by_skill", (q) => q.eq("skill", skill))
        .filter((q) => q.eq(q.field("isPublic"), true))
        .collect();
    } else if (locality) {
      results = await ctx.db
        .query("resume_skills")
        .withIndex("by_locality", (q) => q.eq("locality", locality))
        .filter((q) => q.eq(q.field("isPublic"), true))
        .collect();
    } else if (zona) {
      results = await ctx.db
        .query("resume_skills")
        .withIndex("by_zona", (q) => q.eq("zona", zona))
        .filter((q) => q.eq(q.field("isPublic"), true))
        .collect();
    } else {
      return [];
    }

    // Filtros adicionales en memoria
    if (availabilityType) {
      results = results.filter((r) => r.availabilityType === availabilityType);
    }
    if (salaryExpectation) {
      results = results.filter((r) => r.salaryExpectation === salaryExpectation);
    }

    // Dedup por resumeId
    const seen = new Set<string>();
    const unique = results.filter((r) => {
      if (seen.has(r.resumeId)) return false;
      seen.add(r.resumeId);
      return true;
    });

    // Cargar los resumes completos
    const resumes = await Promise.all(
      unique.map((r) => ctx.db.get(r.resumeId))
    );
    return resumes.filter(Boolean);
  },
});

// Helpers internos
async function syncDenormalizedTables(
  ctx: any,
  resumeId: any,
  userId: any,
  args: any
) {
  // Limpiar tablas desnormalizadas anteriores
  const oldSkills = await ctx.db
    .query("resume_skills")
    .withIndex("by_resume", (q: any) => q.eq("resumeId", resumeId))
    .collect();
  for (const s of oldSkills) await ctx.db.delete(s._id);

  // Insertar skills actualizados
  for (const skill of args.skills) {
    await ctx.db.insert("resume_skills", {
      resumeId,
      userId,
      skill: skill.toLowerCase(),
      locality: args.locality.toLowerCase(),
      zona: args.zona,
      availabilityType: args.availabilityType,
      salaryExpectation: args.salaryExpectation,
      isPublic: args.isPublic,
    });
  }

  // Actualizar tabla de disponibilidad
  const oldAvail = await ctx.db
    .query("resume_availability")
    .withIndex("by_availability", (q: any) =>
      q.eq("availabilityType", args.availabilityType)
    )
    .filter((q: any) => q.eq(q.field("resumeId"), resumeId))
    .collect();
  for (const a of oldAvail) await ctx.db.delete(a._id);

  await ctx.db.insert("resume_availability", {
    resumeId,
    userId,
    availabilityType: args.availabilityType,
    locality: args.locality.toLowerCase(),
    zona: args.zona,
    salaryExpectation: args.salaryExpectation,
    isPublic: args.isPublic,
  });
}

function generateSlug(fullName: string): string {
  const base = fullName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const random = Math.random().toString(36).substring(2, 7);
  return `${base}-${random}`;
}
