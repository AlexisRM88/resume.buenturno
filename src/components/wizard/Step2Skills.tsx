"use client";

import { useState } from "react";
import { ResumeData, SKILL_SUGGESTIONS } from "@/lib/resume-types";

interface Props {
  data: ResumeData;
  onChange: (updates: Partial<ResumeData>) => void;
}

export function Step2Skills({ data, onChange }: Props) {
  const [customSkill, setCustomSkill] = useState("");

  function toggleSkill(skill: string) {
    const lower = skill.toLowerCase();
    const current = data.skills.map((s) => s.toLowerCase());
    if (current.includes(lower)) {
      onChange({ skills: data.skills.filter((s) => s.toLowerCase() !== lower) });
    } else {
      onChange({ skills: [...data.skills, skill] });
    }
  }

  function addCustomSkill() {
    const trimmed = customSkill.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();
    if (!data.skills.map((s) => s.toLowerCase()).includes(lower)) {
      onChange({ skills: [...data.skills, trimmed] });
    }
    setCustomSkill("");
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">¿Qué sabes hacer?</h2>
        <p className="text-gray-500 mt-1">
          Selecciona tus habilidades. Esto ayuda a los patronos a encontrarte.
        </p>
      </div>

      {/* Tags seleccionados */}
      {data.skills.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
            Seleccionadas ({data.skills.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill) => (
              <button
                key={skill}
                onClick={() => toggleSkill(skill)}
                className="flex items-center gap-1 bg-indigo-600 text-white rounded-full px-3 py-1.5 text-sm font-medium"
              >
                {skill}
                <span className="text-indigo-200 ml-1">×</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sugerencias */}
      <div>
        <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
          Sugerencias
        </p>
        <div className="flex flex-wrap gap-2">
          {SKILL_SUGGESTIONS.filter(
            (s) => !data.skills.map((x) => x.toLowerCase()).includes(s.toLowerCase())
          ).map((skill) => (
            <button
              key={skill}
              onClick={() => toggleSkill(skill)}
              className="border border-gray-300 text-gray-700 rounded-full px-3 py-1.5 text-sm hover:border-indigo-400 hover:text-indigo-600 transition"
            >
              + {skill}
            </button>
          ))}
        </div>
      </div>

      {/* Agregar habilidad personalizada */}
      <div>
        <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
          Agregar habilidad personalizada
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomSkill())}
            placeholder="Ej. AutoCAD, OSHA 10..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
          />
          <button
            onClick={addCustomSkill}
            disabled={!customSkill.trim()}
            className="bg-indigo-600 text-white rounded-xl px-4 py-3 font-medium disabled:opacity-40 hover:bg-indigo-700 transition"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
