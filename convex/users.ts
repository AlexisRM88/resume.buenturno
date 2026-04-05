import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Obtener el perfil del usuario autenticado
export const getMyProfile = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db
      .query("user_profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

// Obtener solo el rol del usuario (para guards de página)
export const getMyRole = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    return profile?.role ?? "talent";
  },
});

// Crear perfil si no existe (idempotente — llamar en primer login)
export const ensureProfile = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("No autenticado");

    const existing = await ctx.db
      .query("user_profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) return existing._id;

    // Verificar si el email del usuario es el admin
    const user = await ctx.db.get(userId);
    const adminEmail = process.env.ADMIN_EMAIL ?? "";
    const isAdmin =
      adminEmail &&
      user &&
      "email" in user &&
      typeof user.email === "string" &&
      user.email.toLowerCase() === adminEmail.toLowerCase();

    return await ctx.db.insert("user_profiles", {
      userId,
      role: isAdmin ? "admin" : "talent",
    });
  },
});

// Aceptar términos y condiciones
export const acceptTerms = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("No autenticado");

    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) throw new Error("Perfil no encontrado. Llama ensureProfile primero.");

    await ctx.db.patch(profile._id, { termsAcceptedAt: Date.now() });
  },
});

// Registrarse como patrono (self-service)
export const registerAsEmployer = mutation({
  args: {
    companyName: v.string(),
    companyWebsite: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("No autenticado");

    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) throw new Error("Perfil no encontrado.");

    await ctx.db.patch(profile._id, {
      role: "employer",
      companyName: args.companyName,
      companyWebsite: args.companyWebsite,
      subscriptionStatus: "pending",
    });
  },
});

// Cambiar rol de un usuario (solo admin)
export const setRole = mutation({
  args: {
    targetUserId: v.id("users"),
    role: v.union(
      v.literal("admin"),
      v.literal("talent"),
      v.literal("employer")
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("No autenticado");

    const myProfile = await ctx.db
      .query("user_profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (myProfile?.role !== "admin") throw new Error("No autorizado");

    const targetProfile = await ctx.db
      .query("user_profiles")
      .withIndex("by_user", (q) => q.eq("userId", args.targetUserId))
      .first();

    if (!targetProfile) throw new Error("Usuario no encontrado");

    await ctx.db.patch(targetProfile._id, { role: args.role });
  },
});

// Listar todos los usuarios (solo admin)
export const listAllUsers = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const myProfile = await ctx.db
      .query("user_profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (myProfile?.role !== "admin") return null;

    return await ctx.db.query("user_profiles").collect();
  },
});
