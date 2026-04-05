import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Verificar si el employer tiene suscripción activa
export const checkSubscriptionStatus = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { active: false, status: null, expiresAt: null };

    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) return { active: false, status: null, expiresAt: null };

    // Admin siempre tiene acceso
    if (profile.role === "admin") {
      return { active: true, status: "active", expiresAt: null };
    }

    const now = Date.now();
    const isActive =
      profile.subscriptionStatus === "active" &&
      (!profile.subscriptionExpiresAt || profile.subscriptionExpiresAt > now);

    return {
      active: isActive,
      status: profile.subscriptionStatus ?? null,
      expiresAt: profile.subscriptionExpiresAt ?? null,
    };
  },
});

// Activar suscripción manualmente (solo admin)
export const activateSubscription = mutation({
  args: {
    targetUserId: v.id("users"),
    durationDays: v.optional(v.number()), // default 30
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

    const days = args.durationDays ?? 30;
    const now = Date.now();
    const expiresAt = now + days * 24 * 60 * 60 * 1000;

    await ctx.db.patch(targetProfile._id, {
      subscriptionStatus: "active",
      subscriptionExpiresAt: expiresAt,
    });
  },
});

// Cancelar/desactivar suscripción (solo admin)
export const deactivateSubscription = mutation({
  args: { targetUserId: v.id("users") },
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

    await ctx.db.patch(targetProfile._id, {
      subscriptionStatus: "cancelled",
    });
  },
});

// Solicitar suscripción (talent/employer — crea solicitud pendiente)
export const requestSubscription = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("No autenticado");

    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!profile) throw new Error("Perfil no encontrado");
    if (profile.role !== "employer") throw new Error("Solo patronos pueden suscribirse");

    await ctx.db.patch(profile._id, {
      subscriptionStatus: "pending",
    });
  },
});
