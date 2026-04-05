"use client";

import { ResumeData } from "@/lib/resume-types";

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  hoursPerWeek?: number;
  salary?: string;
  supervisorName?: string;
  supervisorPhone?: string;
  canContact?: boolean;
  employerAddress?: string;
}

interface Props {
  data: ResumeData;
  experiences: Experience[];
}

function formatDate(ym?: string) {
  if (!ym) return "";
  const [y, m] = ym.split("-");
  const months = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
  return `${months[parseInt(m) - 1]} ${y}`;
}

function fTime(value: string) {
  const [h24str, mStr] = value.split(":");
  const h24 = parseInt(h24str);
  const m = mStr ?? "00";
  const ampm = h24 < 12 ? "AM" : "PM";
  const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24;
  return `${h12}:${m} ${ampm}`;
}

const DAY_ORDER = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function formatAvailability(data: ResumeData) {
  const map: Record<string, string> = {
    full_time: "Tiempo Completo (40+ hrs/semana)",
    part_time: "Medio Tiempo (menos de 40 hrs/semana)",
    flexible: "Flexible — tiempo completo o medio tiempo",
  };
  if (data.availabilityType !== "custom") return map[data.availabilityType] ?? "";
  if (!data.customSchedule || data.customSchedule.length === 0) return "Horario personalizado";
  const sorted = DAY_ORDER.map((d) => data.customSchedule!.find((s) => s.day === d)).filter(Boolean) as { day: string; start: string; end: string }[];
  return sorted
    .map((s) => `${s.day}: ${fTime(s.start)} – ${fTime(s.end)}`)
    .join(" · ");
}

// ─── MODERNO ────────────────────────────────────────────────────────────────
function Moderno({ data, experiences, accent }: Props & { accent: string }) {
  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-[30%] min-h-full flex-shrink-0 p-5" style={{ backgroundColor: accent }}>
        <h1 className="text-white font-black text-[15px] leading-tight mb-1">{data.fullName || "Tu Nombre"}</h1>
        <div className="border-t border-white/30 mt-3 mb-4" />

        <div className="space-y-1 mb-5">
          {data.email && <p className="text-white/80 text-[8px] break-all">{data.email}</p>}
          {data.phone && <p className="text-white/80 text-[8px]">{data.phone}</p>}
          {data.locality && <p className="text-white/80 text-[8px]">{data.locality}</p>}
        </div>

        {data.skills.length > 0 && (
          <div className="mb-5">
            <p className="text-white font-bold text-[8px] uppercase tracking-widest mb-2">Habilidades</p>
            <div className="flex flex-wrap gap-1">
              {data.skills.map((s) => (
                <span key={s} className="bg-white/20 text-white text-[7px] px-1.5 py-0.5 rounded">{s}</span>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-white font-bold text-[8px] uppercase tracking-widest mb-2">Disponibilidad</p>
          <p className="text-white/80 text-[7.5px] leading-relaxed">{formatAvailability(data)}</p>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 p-6 pt-7 flex flex-col gap-5">
        {experiences.length > 0 && (
          <div>
            <p className="font-black text-[9px] uppercase tracking-widest mb-2" style={{ color: accent }}>
              Experiencia Laboral
            </p>
            <div className="space-y-4">
              {experiences.map((exp, i) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline">
                    <p className="font-bold text-[10px] text-gray-900">{exp.position}</p>
                    <p className="text-[7.5px] text-gray-400">{formatDate(exp.startDate)} – {exp.isCurrent ? "Presente" : formatDate(exp.endDate)}</p>
                  </div>
                  <p className="text-[8.5px] font-semibold mb-1" style={{ color: accent }}>{exp.company}</p>
                  {exp.description && <p className="text-[8px] text-gray-600 leading-relaxed">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.education && data.education.length > 0 && (
          <div>
            <p className="font-black text-[9px] uppercase tracking-widest mb-2" style={{ color: accent }}>Educación</p>
            {data.education.map((edu, i) => (
              <div key={i}>
                <p className="font-bold text-[9px] text-gray-900">{edu.institution}</p>
                <p className="text-[8px] text-gray-500">{edu.degree}{edu.gpa ? ` · GPA ${edu.gpa}` : ""}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ELEGANTE ───────────────────────────────────────────────────────────────
function Elegante({ data, experiences, accent }: Props & { accent: string }) {
  return (
    <div className="p-8">
      {/* Header centrado */}
      <div className="text-center mb-5 pb-4" style={{ borderBottom: `2px solid ${accent}` }}>
        <h1 className="text-[20px] font-black tracking-tight text-gray-900">{data.fullName || "Tu Nombre"}</h1>
        <div className="flex justify-center flex-wrap gap-3 mt-2">
          {data.email && <span className="text-[8px] text-gray-500">{data.email}</span>}
          {data.phone && <span className="text-[8px] text-gray-500">·  {data.phone}</span>}
          {data.locality && <span className="text-[8px] text-gray-500">·  {data.locality}</span>}
        </div>
      </div>

      {/* Habilidades en fila */}
      {data.skills.length > 0 && (
        <div className="mb-5">
          <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-center mb-2" style={{ color: accent }}>Habilidades</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {data.skills.map((s) => (
              <span key={s} className="border text-[7.5px] px-2 py-0.5 rounded-full" style={{ borderColor: accent, color: accent }}>{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Experiencia */}
      {experiences.length > 0 && (
        <div className="mb-5">
          <p className="text-[8px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: accent }}>Experiencia Laboral</p>
          <div className="space-y-3">
            {experiences.map((exp, i) => (
              <div key={i} className="pl-3" style={{ borderLeft: `2px solid ${accent}20` }}>
                <div className="flex justify-between">
                  <p className="font-bold text-[9.5px] text-gray-900">{exp.position}</p>
                  <p className="text-[7.5px] text-gray-400 italic">{formatDate(exp.startDate)} – {exp.isCurrent ? "Presente" : formatDate(exp.endDate)}</p>
                </div>
                <p className="text-[8.5px] font-semibold text-gray-500 mb-1">{exp.company}</p>
                {exp.description && <p className="text-[8px] text-gray-600 leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disponibilidad */}
      <div>
        <p className="text-[8px] font-bold uppercase tracking-[0.15em] mb-1" style={{ color: accent }}>Disponibilidad</p>
        <p className="text-[8px] text-gray-600">{formatAvailability(data)}</p>
      </div>
    </div>
  );
}

// ─── MINIMALISTA ─────────────────────────────────────────────────────────────
function Minimalista({ data, experiences, accent }: Props & { accent: string }) {
  return (
    <div className="p-9">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-[22px] font-black text-gray-900 tracking-tight">{data.fullName || "Tu Nombre"}</h1>
        <div className="flex flex-wrap gap-4 mt-1.5">
          {data.email && <span className="text-[8px] text-gray-400">{data.email}</span>}
          {data.phone && <span className="text-[8px] text-gray-400">{data.phone}</span>}
          {data.locality && <span className="text-[8px] text-gray-400">{data.locality}</span>}
        </div>
      </div>

      {data.skills.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {data.skills.map((s) => (
              <span key={s} className="text-[8px] text-gray-700">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* Línea divisora mínima */}
      <div className="mb-6" style={{ height: 1, backgroundColor: accent }} />

      {experiences.length > 0 && (
        <div className="mb-6">
          {experiences.map((exp, i) => (
            <div key={i} className={`${i > 0 ? "mt-5" : ""}`}>
              <div className="flex justify-between items-baseline">
                <p className="text-[10px] font-bold text-gray-900">{exp.position}</p>
                <p className="text-[7.5px] text-gray-400">{formatDate(exp.startDate)} – {exp.isCurrent ? "Presente" : formatDate(exp.endDate)}</p>
              </div>
              <p className="text-[8.5px] text-gray-500 mb-1">{exp.company}</p>
              {exp.description && <p className="text-[8px] text-gray-500 leading-relaxed">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="mt-auto">
        <p className="text-[7.5px] text-gray-400">{formatAvailability(data)}</p>
      </div>
    </div>
  );
}

// ─── FEDERAL ─────────────────────────────────────────────────────────────────
function Federal({ data, experiences }: Props) {
  return (
    <div className="p-7 font-mono">
      <div className="text-center mb-4 border-b-2 border-black pb-3">
        <h1 className="text-[14px] font-bold text-black uppercase tracking-wide">{data.fullName || "TU NOMBRE"}</h1>
        <div className="flex justify-center flex-wrap gap-3 mt-1">
          {data.email && <span className="text-[8px] text-black">{data.email}</span>}
          {data.phone && <span className="text-[8px] text-black">{data.phone}</span>}
          {data.locality && <span className="text-[8px] text-black">{data.locality}</span>}
        </div>
      </div>

      {data.skills.length > 0 && (
        <div className="mb-4">
          <p className="text-[9px] font-bold text-black uppercase border-b border-black pb-0.5 mb-2">SPECIALIZED SKILLS / HABILIDADES</p>
          <p className="text-[8px] text-black leading-relaxed">{data.skills.join(" · ")}</p>
        </div>
      )}

      {experiences.length > 0 && (
        <div className="mb-4">
          <p className="text-[9px] font-bold text-black uppercase border-b border-black pb-0.5 mb-2">WORK EXPERIENCE / EXPERIENCIA LABORAL</p>
          <div className="space-y-3">
            {experiences.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between">
                  <p className="text-[9px] font-bold text-black uppercase">{exp.position}</p>
                  <p className="text-[8px] text-black">{formatDate(exp.startDate)} – {exp.isCurrent ? "Presente" : formatDate(exp.endDate)}</p>
                </div>
                <p className="text-[8.5px] font-bold text-black">{exp.company}</p>
                {exp.employerAddress && <p className="text-[8px] text-black">{exp.employerAddress}</p>}
                <div className="flex flex-wrap gap-4 mt-0.5">
                  {exp.hoursPerWeek && <p className="text-[8px] text-black">Hrs/semana: {exp.hoursPerWeek}</p>}
                  {exp.salary && <p className="text-[8px] text-black">Salario: {exp.salary}</p>}
                </div>
                {exp.supervisorName && (
                  <p className="text-[8px] text-black">Supervisor: {exp.supervisorName}{exp.supervisorPhone ? ` · ${exp.supervisorPhone}` : ""}{exp.canContact !== undefined ? (exp.canContact ? " · PUEDE CONTACTAR" : " · NO CONTACTAR") : ""}</p>
                )}
                {exp.description && <p className="text-[8px] text-black mt-0.5 leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.education && data.education.length > 0 && (
        <div className="mb-4">
          <p className="text-[9px] font-bold text-black uppercase border-b border-black pb-0.5 mb-2">EDUCATION / EDUCACIÓN</p>
          {data.education.map((edu, i) => (
            <div key={i}>
              <p className="text-[9px] font-bold text-black">{edu.institution}</p>
              <p className="text-[8px] text-black">{edu.degree}{edu.gpa ? ` · GPA: ${edu.gpa}` : ""}</p>
            </div>
          ))}
        </div>
      )}

      <div>
        <p className="text-[9px] font-bold text-black uppercase border-b border-black pb-0.5 mb-1">AVAILABILITY / DISPONIBILIDAD</p>
        <p className="text-[8px] text-black">{formatAvailability(data)}</p>
      </div>
    </div>
  );
}

// ─── COMPONENTE PRINCIPAL ────────────────────────────────────────────────────
export function ResumePreview({ data, experiences }: Props) {
  const accent = data.template === "federal" ? "#000000" : data.accentColor;

  // Papel carta: 8.5 × 11 in → ratio 0.773
  // Lo mostramos a 560px de ancho → 726px de alto
  const PAPER_W = 560;
  const PAPER_H = Math.round(PAPER_W * (11 / 8.5));

  return (
    <div className="w-full overflow-x-auto">
      <div
        className="relative bg-white shadow-xl mx-auto overflow-hidden"
        style={{
          width: PAPER_W,
          height: PAPER_H,
          boxShadow: "0 4px 32px rgba(0,0,0,0.18)",
        }}
      >
        {data.template === "moderno" && <Moderno data={data} experiences={experiences} accent={accent} />}
        {data.template === "elegante" && <Elegante data={data} experiences={experiences} accent={accent} />}
        {data.template === "minimalista" && <Minimalista data={data} experiences={experiences} accent={accent} />}
        {data.template === "federal" && <Federal data={data} experiences={experiences} />}

        {/* Footer watermark */}
        <div className="absolute bottom-2 right-3">
          <span className="text-[7px] text-gray-400">resume.buenturno.com</span>
        </div>
      </div>
    </div>
  );
}
