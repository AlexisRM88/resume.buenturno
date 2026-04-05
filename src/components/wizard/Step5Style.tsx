"use client";

import { ResumeData, ACCENT_COLORS, TemplateType } from "@/lib/resume-types";

interface Props {
  data: ResumeData;
  onChange: (updates: Partial<ResumeData>) => void;
}

const TEMPLATES: { value: TemplateType; label: string; desc: string }[] = [
  { value: "moderno", label: "Moderno", desc: "Limpio con barra lateral de color" },
  { value: "elegante", label: "Elegante", desc: "Clásico con líneas refinadas" },
  { value: "minimalista", label: "Minimalista", desc: "Simple, mucho espacio en blanco" },
  { value: "federal", label: "Federal (USAJobs)", desc: "Sin colores, formato oficial" },
];

export function Step5Style({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Personaliza tu resume</h2>
        <p className="text-gray-500 mt-1">Elige el estilo que mejor te represente.</p>
      </div>

      {/* Templates */}
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-3">Plantilla</p>
        <div className="grid grid-cols-2 gap-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.value}
              onClick={() => onChange({ template: t.value, isFederal: t.value === "federal" })}
              className={`p-3 rounded-xl border-2 text-left transition ${
                data.template === t.value
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <p
                className={`font-semibold text-sm ${
                  data.template === t.value ? "text-indigo-700" : "text-gray-800"
                }`}
              >
                {t.label}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Color de acento (solo si no es federal) */}
      {data.template !== "federal" && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">Color de acento</p>
          <div className="flex gap-3 flex-wrap">
            {ACCENT_COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => onChange({ accentColor: color.value })}
                title={color.name}
                className={`w-10 h-10 rounded-full border-4 transition ${
                  data.accentColor === color.value
                    ? "border-gray-800 scale-110"
                    : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: color.value }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Visibilidad */}
      <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div>
          <p className="font-medium text-gray-800 text-sm">Perfil público</p>
          <p className="text-xs text-gray-500 mt-0.5">
            Los patronos pueden encontrarte en búsquedas
          </p>
        </div>
        <button
          onClick={() => onChange({ isPublic: !data.isPublic })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            data.isPublic ? "bg-indigo-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              data.isPublic ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>
    </div>
  );
}
