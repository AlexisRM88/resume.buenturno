"use client";

import { useState } from "react";
import { ResumeData, EMPTY_RESUME } from "@/lib/resume-types";
import { Step1Contact } from "@/components/wizard/Step1Contact";
import { Step2Skills } from "@/components/wizard/Step2Skills";
import { Step3Experience } from "@/components/wizard/Step3Experience";
import { Step4Availability } from "@/components/wizard/Step4Availability";
import { Step5Style } from "@/components/wizard/Step5Style";
import { DownloadResumeButton } from "@/components/pdf/DownloadResumeButton";
import { ResumePreview } from "@/components/pdf/ResumePreview";

const STEPS = [
  { label: "Contacto" },
  { label: "Habilidades" },
  { label: "Experiencia" },
  { label: "Disponibilidad" },
  { label: "Estilo" },
];

const SAMPLE_DATA: ResumeData = {
  fullName: "Carlos Rivera Ortiz",
  email: "carlos.rivera@gmail.com",
  phone: "(787) 412-8830",
  locality: "Bayamón, PR",
  skills: [
    "Servicio al Cliente", "Microsoft Excel", "Ventas",
    "Manejo de Caja", "Inventario", "Trabajo en Equipo",
    "Bilingüe (Español/Inglés)", "QuickBooks",
  ],
  experiences: [
    {
      company: "Walmart Puerto Rico",
      position: "Asociado de Ventas",
      startDate: "2022-03",
      endDate: "2024-08",
      isCurrent: false,
      description:
        "Atendí clientes en piso de ventas, procesé transacciones en caja, mantuve inventario organizado y colaboré con el equipo para alcanzar metas semanales de ventas.",
    },
    {
      company: "Walgreens Puerto Rico",
      position: "Representante de Farmacia",
      startDate: "2020-06",
      endDate: "2022-02",
      isCurrent: false,
      description:
        "Asistí en el proceso de dispensación de medicamentos, brindé orientación a clientes sobre productos OTC, y coordiné con el farmacéutico para garantizar cumplimiento regulatorio.",
    },
    {
      company: "McDonald's Bayamón",
      position: "Crew Member / Cajero",
      startDate: "2018-09",
      endDate: "2020-05",
      isCurrent: false,
      description:
        "Operé caja registradora de alto volumen, preparé órdenes con precisión, mantuve estándares de limpieza e higiene, y entrené a nuevos empleados en procedimientos operativos.",
    },
  ],
  isFederal: false,
  education: [{ institution: "Universidad de Puerto Rico, Recinto de Bayamón", degree: "Bachillerato", endDate: "2018", startDate: "", isCurrent: false }],
  availabilityType: "full_time",
  template: "moderno",
  accentColor: "#4F46E5",
  isPublic: true,
};

export default function PreviewPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<ResumeData>(EMPTY_RESUME);

  function handleChange(updates: Partial<ResumeData>) {
    setData((prev) => ({ ...prev, ...updates }));
  }

  function loadSample() {
    setData(SAMPLE_DATA);
    setCurrentStep(4); // ir directo al paso 5
  }

  function isStepValid(): boolean {
    switch (currentStep) {
      case 0: return !!(data.fullName && data.email && data.phone && data.locality);
      case 1: return data.skills.length > 0;
      default: return true;
    }
  }

  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-bold text-indigo-700 text-lg">BuenTurno Resume</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={loadSample}
                className="text-xs bg-amber-100 text-amber-700 border border-amber-300 rounded-lg px-3 py-1.5 font-semibold hover:bg-amber-200 transition"
              >
                ✨ Perfil de muestra
              </button>
              <span className="text-sm text-gray-500">
                {currentStep + 1}/{STEPS.length}
              </span>
            </div>
          </div>
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  i <= currentStep ? "bg-indigo-600" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <div className="flex mt-1.5">
            {STEPS.map((step, i) => (
              <div key={i} className="flex-1 text-center">
                <span className={`text-xs ${i === currentStep ? "text-indigo-600 font-semibold" : i < currentStep ? "text-gray-400" : "text-gray-300"}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6">
        {currentStep === 0 && <Step1Contact data={data} onChange={handleChange} />}
        {currentStep === 1 && <Step2Skills data={data} onChange={handleChange} />}
        {currentStep === 2 && <Step3Experience data={data} onChange={handleChange} />}
        {currentStep === 3 && <Step4Availability data={data} onChange={handleChange} />}
        {currentStep === 4 && (
          <div className="space-y-6">
            <Step5Style data={data} onChange={handleChange} />

            {/* Preview en vivo del resume */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">
                Vista previa — así se verá en papel
              </p>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <ResumePreview data={data} experiences={data.experiences} />
              </div>
            </div>

            {/* Indicador de descarga */}
            <p className="text-center text-xs text-gray-400 pb-2">
              ⬇ Usa el botón verde de abajo para descargar el PDF
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-2xl mx-auto px-4 py-4 flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              className="flex-1 border border-gray-300 rounded-xl py-3.5 font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              ← Atrás
            </button>
          )}
          {isLastStep ? (
            <DownloadResumeButton
              data={data}
              experiences={data.experiences}
              className="flex-1"
            />
          ) : (
            <button
              onClick={() => setCurrentStep((s) => s + 1)}
              disabled={!isStepValid()}
              className="flex-1 rounded-xl py-3.5 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50"
            >
              Siguiente →
            </button>
          )}
        </div>
      </footer>
    </div>
  );
}
