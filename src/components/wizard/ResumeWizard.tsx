"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { ResumeData, EMPTY_RESUME } from "@/lib/resume-types";
import { Step1Contact } from "./Step1Contact";
import { Step2Skills } from "./Step2Skills";
import { Step3Experience } from "./Step3Experience";
import { Step4Availability } from "./Step4Availability";
import { Step5Style } from "./Step5Style";

const STEPS = [
  { label: "Contacto", short: "1" },
  { label: "Habilidades", short: "2" },
  { label: "Experiencia", short: "3" },
  { label: "Disponibilidad", short: "4" },
  { label: "Estilo", short: "5" },
];

export function ResumeWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<ResumeData>(EMPTY_RESUME);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const hasLoadedRef = useRef(false);

  const upsertResume = useMutation(api.resumes.upsertResume);
  const saveExperiences = useMutation(api.resumes.saveExperiences);
  const existingResume = useQuery(api.resumes.getMyResume);
  const existingExperiences = useQuery(
    api.resumes.getExperiences,
    existingResume?._id ? { resumeId: existingResume._id } : "skip"
  );

  // Load existing resume data into wizard state (only once)
  useEffect(() => {
    if (hasLoadedRef.current) return;
    if (!existingResume) return;

    hasLoadedRef.current = true;
    setData((prev) => ({
      ...prev,
      fullName: existingResume.fullName ?? prev.fullName,
      email: existingResume.email ?? prev.email,
      phone: existingResume.phone ?? prev.phone,
      locality: existingResume.locality ?? prev.locality,
      zona: existingResume.zona ?? prev.zona,
      skills: existingResume.skills ?? prev.skills,
      isFederal: existingResume.isFederal ?? prev.isFederal,
      education: existingResume.education ?? prev.education,
      availabilityType: existingResume.availabilityType ?? prev.availabilityType,
      customSchedule: existingResume.customSchedule ?? prev.customSchedule,
      salaryExpectation: existingResume.salaryExpectation ?? prev.salaryExpectation,
      salaryExpectationCustom: existingResume.salaryExpectationCustom ?? prev.salaryExpectationCustom,
      template: existingResume.template ?? prev.template,
      accentColor: existingResume.accentColor ?? prev.accentColor,
      isPublic: existingResume.isPublic ?? prev.isPublic,
    }));
  }, [existingResume]);

  // Load existing experiences
  useEffect(() => {
    if (!existingExperiences || existingExperiences.length === 0) return;
    if (data.experiences.length > 0) return; // don't overwrite if already set

    const sorted = [...existingExperiences].sort((a, b) => a.order - b.order);
    setData((prev) => ({
      ...prev,
      experiences: sorted.map((e) => ({
        company: e.company,
        position: e.position,
        startDate: e.startDate,
        endDate: e.endDate,
        isCurrent: e.isCurrent,
        description: e.description,
        hoursPerWeek: e.hoursPerWeek,
        salary: e.salary,
        supervisorName: e.supervisorName,
        supervisorPhone: e.supervisorPhone,
        canContact: e.canContact,
        employerAddress: e.employerAddress,
      })),
    }));
  }, [existingExperiences, data.experiences.length]);

  function handleChange(updates: Partial<ResumeData>) {
    setData((prev) => ({ ...prev, ...updates }));
    setSaved(false);
  }

  function isStepValid(): boolean {
    switch (currentStep) {
      case 0:
        return !!(data.fullName && data.email && data.phone && data.locality);
      case 1:
        return data.skills.length > 0;
      case 2:
        return true; // Experiencia es opcional
      case 3:
        return !!data.availabilityType;
      case 4:
        return true;
      default:
        return true;
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const resumeId = await upsertResume({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        locality: data.locality,
        zona: data.zona,
        skills: data.skills,
        availabilityType: data.availabilityType,
        customSchedule: data.customSchedule,
        salaryExpectation: data.salaryExpectation,
        salaryExpectationCustom: data.salaryExpectationCustom,
        template: data.template,
        accentColor: data.accentColor,
        isFederal: data.isFederal,
        isPublic: data.isPublic,
        education: data.education.length > 0 ? data.education : undefined,
      });

      if (data.experiences.length > 0) {
        await saveExperiences({
          resumeId,
          experiences: data.experiences,
        });
      }

      setSaved(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function handleNext() {
    if (currentStep === STEPS.length - 1) {
      await handleSave();
    } else {
      setCurrentStep((s) => s + 1);
    }
  }

  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header con progreso */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-bold text-indigo-700 text-lg">BuenTurno Resume</h1>
            <span className="text-sm text-gray-500">
              Paso {currentStep + 1} de {STEPS.length}
            </span>
          </div>
          {/* Barra de progreso */}
          <div className="flex gap-1">
            {STEPS.map((step, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= currentStep ? "bg-indigo-600" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          {/* Labels */}
          <div className="flex mt-1.5">
            {STEPS.map((step, i) => (
              <div key={i} className="flex-1 text-center">
                <span
                  className={`text-xs ${
                    i === currentStep
                      ? "text-indigo-600 font-semibold"
                      : i < currentStep
                      ? "text-gray-400"
                      : "text-gray-300"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Contenido del paso */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {currentStep === 0 && <Step1Contact data={data} onChange={handleChange} />}
        {currentStep === 1 && <Step2Skills data={data} onChange={handleChange} />}
        {currentStep === 2 && <Step3Experience data={data} onChange={handleChange} />}
        {currentStep === 3 && <Step4Availability data={data} onChange={handleChange} />}
        {currentStep === 4 && <Step5Style data={data} onChange={handleChange} />}
      </main>

      {/* Footer con botones de navegación */}
      <footer className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-lg mx-auto px-4 py-4 flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              className="flex-1 border border-gray-300 rounded-xl py-3.5 font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              ← Atrás
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!isStepValid() || saving}
            className={`flex-1 rounded-xl py-3.5 font-semibold text-white transition disabled:opacity-50 ${
              isLastStep
                ? "bg-green-600 hover:bg-green-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {saving
              ? "Guardando..."
              : saved
              ? "¡Guardado! ✓"
              : isLastStep
              ? "Generar Resume ✓"
              : "Siguiente →"}
          </button>
        </div>
      </footer>
    </div>
  );
}
