"use client";

import { ResumeData, PR_MUNICIPALITIES } from "@/lib/resume-types";

interface Props {
  data: ResumeData;
  onChange: (updates: Partial<ResumeData>) => void;
}

export function Step1Contact({ data, onChange }: Props) {
  function handleMunicipio(name: string) {
    const found = PR_MUNICIPALITIES.find((m) => m.name === name);
    onChange({ locality: name, zona: found?.zona });
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">¿Quién eres?</h2>
        <p className="text-gray-500 mt-1">Tu información de contacto básica.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre completo *
        </label>
        <input
          type="text"
          value={data.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          placeholder="María García López"
          className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
          placeholder="maria@email.com"
          className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono *
        </label>
        <input
          type="tel"
          value={data.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          placeholder="(787) 555-0000"
          className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Municipio *
        </label>
        <select
          value={data.locality}
          onChange={(e) => handleMunicipio(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
        >
          <option value="">Selecciona tu municipio</option>
          {PR_MUNICIPALITIES.map((m) => (
            <option key={m.name} value={m.name}>
              {m.name}
            </option>
          ))}
        </select>
        {data.zona && (
          <p className="text-xs text-indigo-600 mt-1.5">
            📍 Zona: {data.zona === "metro" ? "Área Metro" : data.zona === "norte" ? "Zona Norte" : data.zona === "sur" ? "Zona Sur" : data.zona === "este" ? "Zona Este" : "Zona Oeste"}
          </p>
        )}
      </div>
    </div>
  );
}
