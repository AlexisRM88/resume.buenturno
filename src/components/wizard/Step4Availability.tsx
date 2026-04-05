"use client";

import { useState } from "react";
import { ResumeData, AvailabilityType, SalaryExpectation } from "@/lib/resume-types";

interface Props {
  data: ResumeData;
  onChange: (updates: Partial<ResumeData>) => void;
}

const OPTIONS: { value: AvailabilityType; label: string; desc: string; icon: string }[] = [
  { value: "full_time",  label: "Tiempo Completo",  desc: "40 horas/semana o más",          icon: "🏢" },
  { value: "part_time",  label: "Medio Tiempo",      desc: "Menos de 40 horas/semana",        icon: "⏰" },
  { value: "flexible",   label: "Flexible",           desc: "Disponible para ambas opciones",  icon: "🔄" },
  { value: "custom",     label: "Personalizado",      desc: "Elige días y horarios específicos", icon: "📅" },
];

// Orden canónico de días — SIEMPRE en este orden
const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

// Slots cada 30 min, formato "8:00 AM"
const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const totalMin = i * 30;
  const h24 = Math.floor(totalMin / 60);
  const m   = totalMin % 60;
  const ampm = h24 < 12 ? "AM" : "PM";
  const h12  = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
  const label = `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
  const value = `${h24.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  return { label, value };
});

function fTime(value: string) {
  return TIME_SLOTS.find((t) => t.value === value)?.label ?? value;
}

export function Step4Availability({ data, onChange }: Props) {
  const [copyOpenFor, setCopyOpenFor] = useState<string | null>(null);

  // Schedule SIEMPRE ordenado según DAYS — nunca por orden de click
  const schedule: { day: string; start: string; end: string }[] = DAYS
    .map((d) => (data.customSchedule ?? []).find((s) => s.day === d))
    .filter(Boolean) as { day: string; start: string; end: string }[];

  function isDaySelected(day: string) {
    return schedule.some((s) => s.day === day);
  }

  function toggleDay(day: string) {
    const current = data.customSchedule ?? [];
    if (isDaySelected(day)) {
      onChange({ customSchedule: current.filter((s) => s.day !== day) });
    } else {
      // Insertar manteniendo orden cronológico
      const withNew = [...current, { day, start: "08:00", end: "17:00" }];
      const sorted  = DAYS.map((d) => withNew.find((s) => s.day === d)).filter(Boolean) as typeof withNew;
      onChange({ customSchedule: sorted });
    }
    setCopyOpenFor(null);
  }

  function updateDayTime(day: string, field: "start" | "end", value: string) {
    onChange({
      customSchedule: (data.customSchedule ?? []).map((s) =>
        s.day === day ? { ...s, [field]: value } : s
      ),
    });
  }

  // Copiar horario de `fromDay` a los días que el usuario seleccione
  function copyTo(fromDay: string, toDay: string) {
    const src = schedule.find((s) => s.day === fromDay);
    if (!src) return;
    onChange({
      customSchedule: (data.customSchedule ?? []).map((s) =>
        s.day === toDay ? { ...s, start: src.start, end: src.end } : s
      ),
    });
  }

  // Copiar a TODOS los otros días seleccionados
  function copyToAll(fromDay: string) {
    const src = schedule.find((s) => s.day === fromDay);
    if (!src) return;
    onChange({
      customSchedule: (data.customSchedule ?? []).map((s) =>
        s.day !== fromDay ? { ...s, start: src.start, end: src.end } : s
      ),
    });
    setCopyOpenFor(null);
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">¿Cuándo puedes trabajar?</h2>
        <p className="text-gray-500 mt-1">Esto ayuda a los patronos a filtrar candidatos.</p>
      </div>

      {/* Opciones principales */}
      <div className="space-y-3">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange({ availabilityType: opt.value })}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition text-left ${
              data.availabilityType === opt.value
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <span className="text-3xl">{opt.icon}</span>
            <div className="flex-1">
              <p className={`font-semibold ${data.availabilityType === opt.value ? "text-indigo-700" : "text-gray-800"}`}>
                {opt.label}
              </p>
              <p className="text-sm text-gray-500">{opt.desc}</p>
            </div>
            {data.availabilityType === opt.value && <span className="text-indigo-600 text-xl">✓</span>}
          </button>
        ))}
      </div>

      {/* Panel personalizado */}
      {data.availabilityType === "custom" && (
        <div className="space-y-4">
          {/* Grilla de días */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Selecciona los días disponibles</p>
            <div className="grid grid-cols-4 gap-2">
              {DAYS.map((day) => {
                const active = isDaySelected(day);
                return (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`py-2.5 rounded-xl text-sm font-semibold transition border-2 ${
                      active
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            {schedule.length === 0 && (
              <p className="text-xs text-gray-400 mt-2">Selecciona al menos un día</p>
            )}
          </div>

          {/* Horarios — en orden Lun→Dom */}
          {schedule.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-700">Horario por día</p>
              {schedule.map(({ day, start, end }) => {
                const hasError   = start >= end;
                const otherDays  = schedule.filter((s) => s.day !== day);
                const copyOpen   = copyOpenFor === day;

                return (
                  <div
                    key={day}
                    className={`rounded-2xl border-2 p-3 ${hasError ? "border-red-200 bg-red-50" : "border-indigo-100 bg-indigo-50"}`}
                  >
                    {/* Fila principal */}
                    <div className="flex items-center gap-3">
                      <span className="w-9 text-center font-bold text-indigo-700 text-sm shrink-0">{day}</span>

                      {/* Desde */}
                      <div className="flex-1">
                        <label className="block text-xs text-indigo-500 mb-1">Desde</label>
                        <select
                          value={start}
                          onChange={(e) => updateDayTime(day, "start", e.target.value)}
                          className="w-full bg-white border border-indigo-200 rounded-xl px-2 py-2 text-sm font-medium text-gray-800 focus:outline-none focus:border-indigo-500"
                        >
                          {TIME_SLOTS.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      </div>

                      <span className="text-gray-400 text-sm mt-4">–</span>

                      {/* Hasta */}
                      <div className="flex-1">
                        <label className="block text-xs text-indigo-500 mb-1">Hasta</label>
                        <select
                          value={end}
                          onChange={(e) => updateDayTime(day, "end", e.target.value)}
                          className="w-full bg-white border border-indigo-200 rounded-xl px-2 py-2 text-sm font-medium text-gray-800 focus:outline-none focus:border-indigo-500"
                        >
                          {TIME_SLOTS.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Quitar */}
                      <button
                        onClick={() => toggleDay(day)}
                        className="mt-4 text-gray-300 hover:text-red-400 transition text-lg leading-none shrink-0"
                      >
                        ×
                      </button>
                    </div>

                    {/* Resumen + botón copiar */}
                    <div className="flex items-center justify-between mt-1.5 pl-12">
                      {hasError
                        ? <p className="text-xs text-red-500">La hora de fin debe ser después del inicio.</p>
                        : <p className="text-xs text-indigo-400">{fTime(start)} – {fTime(end)}</p>
                      }

                      {/* Botón copiar — solo si hay otros días */}
                      {otherDays.length > 0 && (
                        <button
                          onClick={() => setCopyOpenFor(copyOpen ? null : day)}
                          className="text-xs text-indigo-500 hover:text-indigo-700 font-medium flex items-center gap-1"
                        >
                          Copiar {copyOpen ? "▲" : "▼"}
                        </button>
                      )}
                    </div>

                    {/* Panel de copia expandible */}
                    {copyOpen && otherDays.length > 0 && (
                      <div className="mt-2 pl-12 flex flex-wrap gap-2 items-center">
                        <span className="text-xs text-gray-500">Aplicar a:</span>
                        {otherDays.map((od) => (
                          <button
                            key={od.day}
                            onClick={() => { copyTo(day, od.day); setCopyOpenFor(null); }}
                            className="text-xs bg-white border border-indigo-300 text-indigo-700 rounded-lg px-2.5 py-1 font-semibold hover:bg-indigo-100 transition"
                          >
                            {od.day}
                          </button>
                        ))}
                        {otherDays.length > 1 && (
                          <button
                            onClick={() => copyToAll(day)}
                            className="text-xs bg-indigo-600 text-white rounded-lg px-2.5 py-1 font-semibold hover:bg-indigo-700 transition"
                          >
                            Todos
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Expectativa Salarial */}
      <div className="space-y-3 pt-2 border-t border-gray-100">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">¿Cuál es tu expectativa salarial?</h3>
          <p className="text-sm text-gray-500 mt-0.5">Esto ayuda a los patronos a filtrar candidatos compatibles.</p>
        </div>

        {(
          [
            {
              value: "minimum" as SalaryExpectation,
              label: "Desde el mínimo de la industria",
              desc: "Acepto ofertas desde el salario mínimo aplicable",
              icon: "💚",
              badge: "Máxima visibilidad",
            },
            {
              value: "negotiable" as SalaryExpectation,
              label: "A negociar",
              desc: "Prefiero discutir el salario en la entrevista",
              icon: "🤝",
              badge: null,
            },
            {
              value: "custom" as SalaryExpectation,
              label: "Cantidad específica",
              desc: "Tengo una cantidad mínima en mente",
              icon: "💰",
              badge: null,
            },
          ] as const
        ).map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange({ salaryExpectation: opt.value })}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition text-left ${
              data.salaryExpectation === opt.value
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <span className="text-3xl">{opt.icon}</span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className={`font-semibold ${data.salaryExpectation === opt.value ? "text-indigo-700" : "text-gray-800"}`}>
                  {opt.label}
                </p>
                {opt.badge && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    {opt.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500">{opt.desc}</p>
            </div>
            {data.salaryExpectation === opt.value && <span className="text-indigo-600 text-xl">✓</span>}
          </button>
        ))}

        {/* Input para cantidad específica */}
        {data.salaryExpectation === "custom" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Especifica tu expectativa
            </label>
            <input
              type="text"
              value={data.salaryExpectationCustom ?? ""}
              onChange={(e) => onChange({ salaryExpectationCustom: e.target.value })}
              placeholder="Ej: $15/hora, $600/semana, $30,000/año"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            />
          </div>
        )}

        {/* Nota informativa */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
          <p className="font-semibold mb-0.5">ℹ️ Nota sobre salarios en Puerto Rico</p>
          <p>Algunos roles tienen salarios mínimos federales diferenciados. Por ejemplo, empleados de servicio que reciben propinas (meseros, bartenders) tienen un mínimo federal distinto. Seleccionar "desde el mínimo" maximiza tu visibilidad con todos los patronos.</p>
        </div>
      </div>
    </div>
  );
}
