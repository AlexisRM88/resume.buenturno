export type AvailabilityType = "full_time" | "part_time" | "flexible" | "custom";
export type TemplateType = "elegante" | "moderno" | "minimalista" | "federal";
export type SalaryExpectation = "minimum" | "negotiable" | "custom";
export type Zona = "metro" | "norte" | "sur" | "este" | "oeste";

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  // Campos federales
  hoursPerWeek?: number;
  salary?: string;
  supervisorName?: string;
  supervisorPhone?: string;
  canContact?: boolean;
  employerAddress?: string;
}

export interface Education {
  institution: string;
  degree: string;
  gpa?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

export interface ResumeData {
  // Paso 1
  fullName: string;
  email: string;
  phone: string;
  locality: string;
  zona?: Zona;
  // Paso 2
  skills: string[];
  // Paso 3
  experiences: Experience[];
  isFederal: boolean;
  education: Education[];
  // Paso 4
  availabilityType: AvailabilityType;
  customSchedule?: { day: string; start: string; end: string }[];
  salaryExpectation?: SalaryExpectation;
  salaryExpectationCustom?: string;
  // Paso 5
  template: TemplateType;
  accentColor: string;
  isPublic: boolean;
}

export const EMPTY_RESUME: ResumeData = {
  fullName: "",
  email: "",
  phone: "",
  locality: "",
  skills: [],
  experiences: [],
  isFederal: false,
  education: [],
  availabilityType: "full_time",
  template: "moderno",
  accentColor: "#4F46E5",
  isPublic: true,
};

export const ACCENT_COLORS = [
  { name: "Índigo", value: "#4F46E5" },
  { name: "Verde", value: "#059669" },
  { name: "Rojo", value: "#DC2626" },
  { name: "Naranja", value: "#EA580C" },
  { name: "Azul", value: "#2563EB" },
  { name: "Gris", value: "#374151" },
];

export const SKILL_SUGGESTIONS = [
  "Servicio al Cliente", "Microsoft Excel", "Microsoft Word", "Google Workspace",
  "Ventas", "Comunicación", "Trabajo en Equipo", "Liderazgo",
  "Contabilidad", "QuickBooks", "Redes Sociales", "Marketing Digital",
  "Manejo de Caja", "Inventario", "Logística", "Almacén",
  "Enfermería", "Primeros Auxilios", "Construcción", "Electricidad",
  "Plomería", "Pintura", "Mecánica", "Conducción (CDL)",
  "Inglés", "Bilingüe (Español/Inglés)", "Programación", "SQL",
];

export const ZONA_LABELS: Record<Zona, string> = {
  metro: "Área Metro",
  norte: "Zona Norte",
  sur: "Zona Sur",
  este: "Zona Este",
  oeste: "Zona Oeste",
};

// 78 municipios de Puerto Rico con su zona geográfica
export const PR_MUNICIPALITIES: { name: string; zona: Zona }[] = [
  // Área Metropolitana
  { name: "San Juan", zona: "metro" },
  { name: "Bayamón", zona: "metro" },
  { name: "Guaynabo", zona: "metro" },
  { name: "Carolina", zona: "metro" },
  { name: "Cataño", zona: "metro" },
  { name: "Toa Baja", zona: "metro" },
  { name: "Toa Alta", zona: "metro" },
  { name: "Trujillo Alto", zona: "metro" },
  { name: "Dorado", zona: "metro" },
  // Zona Norte
  { name: "Arecibo", zona: "norte" },
  { name: "Barceloneta", zona: "norte" },
  { name: "Camuy", zona: "norte" },
  { name: "Ciales", zona: "norte" },
  { name: "Florida", zona: "norte" },
  { name: "Hatillo", zona: "norte" },
  { name: "Manatí", zona: "norte" },
  { name: "Morovis", zona: "norte" },
  { name: "Quebradillas", zona: "norte" },
  { name: "Utuado", zona: "norte" },
  { name: "Vega Alta", zona: "norte" },
  { name: "Vega Baja", zona: "norte" },
  // Zona Este
  { name: "Caguas", zona: "este" },
  { name: "Humacao", zona: "este" },
  { name: "Aguas Buenas", zona: "este" },
  { name: "Arroyo", zona: "este" },
  { name: "Ceiba", zona: "este" },
  { name: "Cidra", zona: "este" },
  { name: "Culebra", zona: "este" },
  { name: "Fajardo", zona: "este" },
  { name: "Gurabo", zona: "este" },
  { name: "Juncos", zona: "este" },
  { name: "Las Piedras", zona: "este" },
  { name: "Loíza", zona: "este" },
  { name: "Luquillo", zona: "este" },
  { name: "Maunabo", zona: "este" },
  { name: "Naguabo", zona: "este" },
  { name: "Patillas", zona: "este" },
  { name: "Río Grande", zona: "este" },
  { name: "San Lorenzo", zona: "este" },
  { name: "Vieques", zona: "este" },
  { name: "Yabucoa", zona: "este" },
  // Zona Sur
  { name: "Ponce", zona: "sur" },
  { name: "Aibonito", zona: "sur" },
  { name: "Barranquitas", zona: "sur" },
  { name: "Cayey", zona: "sur" },
  { name: "Coamo", zona: "sur" },
  { name: "Guayama", zona: "sur" },
  { name: "Juana Díaz", zona: "sur" },
  { name: "Peñuelas", zona: "sur" },
  { name: "Salinas", zona: "sur" },
  { name: "Santa Isabel", zona: "sur" },
  { name: "Villalba", zona: "sur" },
  { name: "Yauco", zona: "sur" },
  { name: "Guánica", zona: "sur" },
  // Zona Oeste
  { name: "Mayagüez", zona: "oeste" },
  { name: "Aguada", zona: "oeste" },
  { name: "Aguadilla", zona: "oeste" },
  { name: "Añasco", zona: "oeste" },
  { name: "Cabo Rojo", zona: "oeste" },
  { name: "Hormigueros", zona: "oeste" },
  { name: "Isabela", zona: "oeste" },
  { name: "Lajas", zona: "oeste" },
  { name: "Las Marías", zona: "oeste" },
  { name: "Lares", zona: "oeste" },
  { name: "Maricao", zona: "oeste" },
  { name: "Moca", zona: "oeste" },
  { name: "Rincón", zona: "oeste" },
  { name: "Sabana Grande", zona: "oeste" },
  { name: "San Germán", zona: "oeste" },
  { name: "San Sebastián", zona: "oeste" },
  // Interior / montaña
  { name: "Adjuntas", zona: "oeste" },
  { name: "Jayuya", zona: "norte" },
  { name: "Naranjito", zona: "norte" },
  { name: "Orocovis", zona: "norte" },
  { name: "Comerio", zona: "norte" },
  { name: "Corozal", zona: "norte" },
];

export const SALARY_LABELS: Record<SalaryExpectation, string> = {
  minimum: "Desde el mínimo de la industria",
  negotiable: "A negociar",
  custom: "Cantidad específica",
};
