import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  // Perfiles de usuario (roles, términos, suscripción)
  user_profiles: defineTable({
    userId: v.id("users"),
    role: v.union(
      v.literal("admin"),
      v.literal("talent"),
      v.literal("employer")
    ),
    termsAcceptedAt: v.optional(v.number()),
    companyName: v.optional(v.string()),
    companyWebsite: v.optional(v.string()),
    // Suscripción de patronos ($45/mes)
    subscriptionStatus: v.optional(
      v.union(
        v.literal("active"),
        v.literal("expired"),
        v.literal("cancelled"),
        v.literal("pending")
      )
    ),
    subscriptionExpiresAt: v.optional(v.number()),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
  }).index("by_user", ["userId"]),

  // Tabla principal de resumes
  resumes: defineTable({
    userId: v.id("users"),
    slug: v.string(), // URL única: /u/slug
    // Paso 1: Info personal
    fullName: v.string(),
    email: v.string(),
    phone: v.string(),
    locality: v.string(), // Municipio de PR
    zona: v.optional(
      v.union(
        v.literal("metro"),
        v.literal("norte"),
        v.literal("sur"),
        v.literal("este"),
        v.literal("oeste")
      )
    ),
    // Paso 2: Habilidades (tags)
    skills: v.array(v.string()),
    // Paso 4: Disponibilidad
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
    // Expectativa salarial
    salaryExpectation: v.optional(
      v.union(
        v.literal("minimum"),
        v.literal("negotiable"),
        v.literal("custom")
      )
    ),
    salaryExpectationCustom: v.optional(v.string()),
    // Paso 5: Estilo
    template: v.union(
      v.literal("elegante"),
      v.literal("moderno"),
      v.literal("minimalista"),
      v.literal("federal")
    ),
    accentColor: v.string(), // hex color
    // Modo federal
    isFederal: v.boolean(),
    // Educación (requerida en modo federal)
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
    // Metadata
    isPublic: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_slug", ["slug"]),

  // Experiencia laboral (separada para fácil edición)
  experiences: defineTable({
    resumeId: v.id("resumes"),
    company: v.string(),
    position: v.string(),
    startDate: v.string(), // "YYYY-MM"
    endDate: v.optional(v.string()),
    isCurrent: v.boolean(),
    description: v.string(),
    // Campos federales opcionales
    hoursPerWeek: v.optional(v.number()),
    salary: v.optional(v.string()),
    supervisorName: v.optional(v.string()),
    supervisorPhone: v.optional(v.string()),
    canContact: v.optional(v.boolean()),
    employerAddress: v.optional(v.string()),
    order: v.number(), // para ordenar (máx 3)
  }).index("by_resume", ["resumeId"]),

  // Tabla desnormalizada para búsqueda de patronos por skill
  resume_skills: defineTable({
    resumeId: v.id("resumes"),
    userId: v.id("users"),
    skill: v.string(),
    locality: v.string(),
    zona: v.optional(v.string()),
    availabilityType: v.string(),
    salaryExpectation: v.optional(v.string()),
    isPublic: v.boolean(),
  })
    .index("by_skill", ["skill"])
    .index("by_locality", ["locality"])
    .index("by_skill_locality", ["skill", "locality"])
    .index("by_resume", ["resumeId"])
    .index("by_zona", ["zona"]),

  // Tabla desnormalizada para búsqueda por disponibilidad
  resume_availability: defineTable({
    resumeId: v.id("resumes"),
    userId: v.id("users"),
    availabilityType: v.string(),
    locality: v.string(),
    zona: v.optional(v.string()),
    salaryExpectation: v.optional(v.string()),
    isPublic: v.boolean(),
  })
    .index("by_availability", ["availabilityType"])
    .index("by_availability_locality", ["availabilityType", "locality"]),
});
