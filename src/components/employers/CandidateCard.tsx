"use client";

import Link from "next/link";
import { ZONA_LABELS } from "@/lib/resume-types";

const AVAIL_LABELS: Record<string, string> = {
  full_time: "Tiempo Completo",
  part_time: "Medio Tiempo",
  flexible: "Flexible",
  custom: "Horario Personalizado",
};

const SALARY_LABELS: Record<string, string> = {
  minimum: "Desde el mínimo",
  negotiable: "A negociar",
  custom: "",
};

interface Resume {
  _id: string;
  fullName: string;
  locality: string;
  zona?: string;
  skills: string[];
  availabilityType: string;
  salaryExpectation?: string;
  salaryExpectationCustom?: string;
  slug: string;
}

interface Props {
  resume: Resume;
}

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getPartialName(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[1][0]}.`;
}

function getSalaryText(resume: Resume) {
  if (!resume.salaryExpectation) return null;
  if (resume.salaryExpectation === "custom") return resume.salaryExpectationCustom || null;
  return SALARY_LABELS[resume.salaryExpectation] || null;
}

export function CandidateCard({ resume }: Props) {
  const initials = getInitials(resume.fullName);
  const displayName = getPartialName(resume.fullName);
  const salaryText = getSalaryText(resume);
  const zonaLabel = resume.zona ? ZONA_LABELS[resume.zona as keyof typeof ZONA_LABELS] : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-indigo-200 transition-all">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg shrink-0">
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900">{displayName}</h3>
              <p className="text-sm text-gray-500">
                📍 {resume.locality}
                {zonaLabel && <span className="ml-1 text-xs text-indigo-500">· {zonaLabel}</span>}
              </p>
            </div>
            <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full shrink-0">
              {AVAIL_LABELS[resume.availabilityType] ?? resume.availabilityType}
            </span>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {resume.skills.slice(0, 5).map((skill) => (
              <span
                key={skill}
                className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
            {resume.skills.length > 5 && (
              <span className="text-xs text-gray-400">+{resume.skills.length - 5} más</span>
            )}
          </div>

          {/* Salary + CTA */}
          <div className="flex items-center justify-between mt-4">
            {salaryText ? (
              <span className="text-xs text-gray-500">
                💰 {salaryText}
              </span>
            ) : (
              <span />
            )}
            <Link
              href={`/u/${resume.slug}`}
              target="_blank"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Ver perfil →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
