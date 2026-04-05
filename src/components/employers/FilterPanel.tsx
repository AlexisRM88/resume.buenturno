"use client";

import { PR_MUNICIPALITIES, ZONA_LABELS, Zona } from "@/lib/resume-types";

export interface Filters {
  locality: string;
  zona: string;
  availabilityType: string;
  salaryExpectation: string;
  skill: string;
}

interface Props {
  filters: Filters;
  onChange: (f: Partial<Filters>) => void;
  onReset: () => void;
}

const AVAILABILITY_OPTIONS = [
  { value: "", label: "Cualquier disponibilidad" },
  { value: "full_time", label: "Tiempo Completo" },
  { value: "part_time", label: "Medio Tiempo" },
  { value: "flexible", label: "Flexible" },
  { value: "custom", label: "Horario Personalizado" },
];

const SALARY_OPTIONS = [
  { value: "", label: "Cualquier expectativa" },
  { value: "minimum", label: "Desde el mínimo" },
  { value: "negotiable", label: "A negociar" },
  { value: "custom", label: "Cantidad específica" },
];

const ZONAS: { value: Zona | ""; label: string }[] = [
  { value: "", label: "Todas las zonas" },
  { value: "metro", label: "Área Metro" },
  { value: "norte", label: "Zona Norte" },
  { value: "sur", label: "Zona Sur" },
  { value: "este", label: "Zona Este" },
  { value: "oeste", label: "Zona Oeste" },
];

export function FilterPanel({ filters, onChange, onReset }: Props) {
  const hasFilters = Object.values(filters).some((v) => v !== "");

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Filtros</h3>
        {hasFilters && (
          <button
            onClick={onReset}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Zona */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
          Zona geográfica
        </label>
        <div className="flex flex-wrap gap-2">
          {ZONAS.map((z) => (
            <button
              key={z.value}
              onClick={() => onChange({ zona: z.value, locality: "" })}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                filters.zona === z.value
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-indigo-300"
              }`}
            >
              {z.label}
            </button>
          ))}
        </div>
      </div>

      {/* Municipio */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
          Municipio
        </label>
        <select
          value={filters.locality}
          onChange={(e) => onChange({ locality: e.target.value, zona: "" })}
          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        >
          <option value="">Todos los municipios</option>
          {PR_MUNICIPALITIES.map((m) => (
            <option key={m.name} value={m.name.toLowerCase()}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {/* Disponibilidad */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
          Disponibilidad
        </label>
        <select
          value={filters.availabilityType}
          onChange={(e) => onChange({ availabilityType: e.target.value })}
          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        >
          {AVAILABILITY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Salario */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
          Expectativa salarial
        </label>
        <select
          value={filters.salaryExpectation}
          onChange={(e) => onChange({ salaryExpectation: e.target.value })}
          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        >
          {SALARY_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Habilidad */}
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
          Habilidad
        </label>
        <input
          type="text"
          value={filters.skill}
          onChange={(e) => onChange({ skill: e.target.value })}
          placeholder="Ej: Excel, Ventas, Enfermería..."
          className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        />
      </div>
    </div>
  );
}
