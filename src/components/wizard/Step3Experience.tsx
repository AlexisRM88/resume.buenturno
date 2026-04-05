"use client";

import { ResumeData, Experience } from "@/lib/resume-types";

interface Props {
  data: ResumeData;
  onChange: (updates: Partial<ResumeData>) => void;
}

const EMPTY_EXP: Experience = {
  company: "",
  position: "",
  startDate: "",
  isCurrent: false,
  description: "",
};

export function Step3Experience({ data, onChange }: Props) {
  function updateExp(index: number, updates: Partial<Experience>) {
    const updated = data.experiences.map((exp, i) =>
      i === index ? { ...exp, ...updates } : exp
    );
    onChange({ experiences: updated });
  }

  function addExp() {
    if (data.experiences.length >= 3) return;
    onChange({ experiences: [...data.experiences, { ...EMPTY_EXP }] });
  }

  function removeExp(index: number) {
    onChange({ experiences: data.experiences.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Tu trayectoria</h2>
        <p className="text-gray-500 mt-1">Hasta 3 empleos más recientes.</p>
      </div>

      {/* Toggle Modo Federal */}
      <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div>
          <p className="font-medium text-gray-800 text-sm">Modo Federal (USAJobs)</p>
          <p className="text-xs text-gray-500 mt-0.5">Agrega campos requeridos para empleos federales</p>
        </div>
        <button
          onClick={() => onChange({ isFederal: !data.isFederal })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            data.isFederal ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              data.isFederal ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Experiencias */}
      {data.experiences.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p className="text-4xl mb-2">💼</p>
          <p>Agrega tu primer empleo</p>
        </div>
      )}

      {data.experiences.map((exp, i) => (
        <div key={i} className="border border-gray-200 rounded-2xl p-4 space-y-3 bg-white">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-indigo-600">Empleo {i + 1}</span>
            <button
              onClick={() => removeExp(i)}
              className="text-red-400 hover:text-red-600 text-sm"
            >
              Eliminar
            </button>
          </div>

          <input
            type="text"
            placeholder="Empresa *"
            value={exp.company}
            onChange={(e) => updateExp(i, { company: e.target.value })}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            placeholder="Puesto / Título *"
            value={exp.position}
            onChange={(e) => updateExp(i, { position: e.target.value })}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Inicio *</label>
              <input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExp(i, { startDate: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Fin {exp.isCurrent && "(Actual)"}
              </label>
              <input
                type="month"
                value={exp.endDate ?? ""}
                disabled={exp.isCurrent}
                onChange={(e) => updateExp(i, { endDate: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-gray-100"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={exp.isCurrent}
              onChange={(e) => updateExp(i, { isCurrent: e.target.checked, endDate: undefined })}
              className="w-4 h-4 accent-indigo-600"
            />
            Trabajo actualmente aquí
          </label>

          <textarea
            placeholder="Describe tus responsabilidades... (ej. Atendí clientes, procesé pagos, manejé inventario)"
            value={exp.description}
            onChange={(e) => updateExp(i, { description: e.target.value })}
            rows={3}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
          />

          {/* Campos federales */}
          {data.isFederal && (
            <div className="space-y-3 border-t border-blue-100 pt-3">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Campos Federales</p>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Horas por semana"
                  value={exp.hoursPerWeek ?? ""}
                  onChange={(e) => updateExp(i, { hoursPerWeek: Number(e.target.value) })}
                  className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <input
                  type="text"
                  placeholder="Salario (ej. $15/hr)"
                  value={exp.salary ?? ""}
                  onChange={(e) => updateExp(i, { salary: e.target.value })}
                  className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <input
                type="text"
                placeholder="Dirección del empleador"
                value={exp.employerAddress ?? ""}
                onChange={(e) => updateExp(i, { employerAddress: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                placeholder="Nombre del supervisor"
                value={exp.supervisorName ?? ""}
                onChange={(e) => updateExp(i, { supervisorName: e.target.value })}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="tel"
                  placeholder="Tel. supervisor"
                  value={exp.supervisorPhone ?? ""}
                  onChange={(e) => updateExp(i, { supervisorPhone: e.target.value })}
                  className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={exp.canContact ?? false}
                    onChange={(e) => updateExp(i, { canContact: e.target.checked })}
                    className="w-4 h-4 accent-blue-600"
                  />
                  ¿Contactar?
                </label>
              </div>
            </div>
          )}
        </div>
      ))}

      {data.experiences.length < 3 && (
        <button
          onClick={addExp}
          className="w-full border-2 border-dashed border-gray-300 rounded-2xl py-4 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 transition text-sm font-medium"
        >
          + Agregar empleo
        </button>
      )}

      {/* Educación — siempre visible */}
      <div className="border border-gray-200 rounded-2xl p-4 space-y-3 bg-white">
        <div>
          <h3 className="font-semibold text-gray-800">Último grado académico</h3>
          <p className="text-xs text-gray-500 mt-0.5">Opcional — pero recomendado</p>
        </div>

        {/* Dropdown de nivel académico */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nivel educativo</label>
          <select
            value={data.education[0]?.degree ?? ""}
            onChange={(e) => {
              const edu = data.education[0] ?? { institution: "", degree: "", startDate: "", isCurrent: false };
              onChange({ education: [{ ...edu, degree: e.target.value }] });
            }}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white text-gray-800"
          >
            <option value="">Selecciona tu grado...</option>
            <option value="Escuela Superior / GED">Escuela Superior / GED</option>
            <option value="Certificado Técnico / Vocacional">Certificado Técnico / Vocacional</option>
            <option value="Grado Asociado">Grado Asociado</option>
            <option value="Bachillerato">Bachillerato</option>
            <option value="Maestría">Maestría</option>
            <option value="Doctorado / PhD">Doctorado / PhD</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        {/* Institución — solo si eligió algo */}
        {data.education[0]?.degree && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Institución</label>
            <input
              type="text"
              placeholder="Ej. Universidad de Puerto Rico, Recinto de Río Piedras"
              value={data.education[0]?.institution ?? ""}
              onChange={(e) => {
                const edu = data.education[0] ?? { institution: "", degree: "", startDate: "", isCurrent: false };
                onChange({ education: [{ ...edu, institution: e.target.value }] });
              }}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        )}

        {/* Año de graduación */}
        {data.education[0]?.degree && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Año de graduación</label>
            <input
              type="number"
              placeholder="Ej. 2019"
              min={1970}
              max={2030}
              value={data.education[0]?.endDate ?? ""}
              onChange={(e) => {
                const edu = data.education[0] ?? { institution: "", degree: "", startDate: "", isCurrent: false };
                onChange({ education: [{ ...edu, endDate: e.target.value }] });
              }}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        )}

        {/* GPA — solo en modo federal */}
        {data.isFederal && data.education[0]?.degree && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GPA (requerido federal)</label>
            <input
              type="text"
              placeholder="Ej. 3.5"
              value={data.education[0]?.gpa ?? ""}
              onChange={(e) => {
                const edu = data.education[0];
                if (!edu) return;
                onChange({ education: [{ ...edu, gpa: e.target.value }] });
              }}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        )}
      </div>
    </div>
  );
}
