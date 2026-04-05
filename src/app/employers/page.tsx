"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../../convex/_generated/api";
import { FilterPanel, Filters } from "@/components/employers/FilterPanel";
import { CandidateCard } from "@/components/employers/CandidateCard";

const EMPTY_FILTERS: Filters = {
  locality: "",
  zona: "",
  availabilityType: "",
  salaryExpectation: "",
  skill: "",
};

function EmployerRegistration() {
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const registerAsEmployer = useMutation(api.users.registerAsEmployer);
  const router = useRouter();

  async function handleRegister() {
    if (!companyName.trim()) return;
    setSubmitting(true);
    try {
      await registerAsEmployer({ companyName: companyName.trim(), companyWebsite: website.trim() || undefined });
      setDone(true);
      router.push("/employers/subscribe");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Acceso para Patronos</h1>
          <p className="text-gray-500 mt-1">
            Accede a candidatos filtrados por municipio, zona, disponibilidad y expectativa salarial.
          </p>
        </div>

        <div className="bg-indigo-50 rounded-xl p-4 space-y-2 text-sm text-indigo-800">
          <p className="font-semibold">¿Qué incluye la suscripción? ($45/mes)</p>
          <ul className="space-y-1 text-indigo-700">
            <li>✅ Búsqueda ilimitada de candidatos</li>
            <li>✅ Filtros por pueblo, zona y disponibilidad</li>
            <li>✅ Ver perfil completo de cada candidato</li>
            <li>✅ Filtrar por expectativa salarial</li>
            <li>✅ Acceso a candidatos nuevos cada semana</li>
          </ul>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la empresa *</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Ej: Restaurant El Bohío"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sitio web (opcional)</label>
            <input
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://tuempresa.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        <button
          onClick={handleRegister}
          disabled={!companyName.trim() || submitting}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {submitting ? "Registrando..." : "Continuar al pago →"}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Al registrarte aceptas nuestros{" "}
          <Link href="/terms" className="text-indigo-600 hover:underline">Términos y Condiciones</Link>
        </p>
      </div>
    </div>
  );
}

function SubscriptionRequired() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center space-y-5">
        <div className="text-5xl">🔒</div>
        <h2 className="text-xl font-bold text-gray-900">Suscripción requerida</h2>
        <p className="text-gray-500">
          Para acceder al directorio de candidatos necesitas una suscripción activa de patrono ($45/mes).
        </p>
        <Link
          href="/employers/subscribe"
          className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Activar suscripción →
        </Link>
      </div>
    </div>
  );
}

export default function EmployersPage() {
  const myProfile = useQuery(api.users.getMyProfile);
  const subscriptionStatus = useQuery(api.payments.checkSubscriptionStatus);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [searchKey, setSearchKey] = useState(0);

  const candidates = useQuery(
    api.employers.searchCandidatesFull,
    {
      locality: filters.locality || undefined,
      zona: filters.zona || undefined,
      skill: filters.skill || undefined,
      availabilityType: filters.availabilityType || undefined,
      salaryExpectation: filters.salaryExpectation || undefined,
    }
  );

  if (myProfile === undefined || subscriptionStatus === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-indigo-600 font-semibold">Cargando...</div>
      </div>
    );
  }

  // Not an employer or admin: show registration
  if (!myProfile || (myProfile.role !== "employer" && myProfile.role !== "admin")) {
    return <EmployerRegistration />;
  }

  // Employer without active subscription
  if (!subscriptionStatus.active && myProfile.role !== "admin") {
    return <SubscriptionRequired />;
  }

  // Active employer dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-indigo-700 font-bold text-lg">BuenTurno</Link>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600 text-sm">Portal de Patronos</span>
          </div>
          <div className="flex items-center gap-3">
            {subscriptionStatus.expiresAt && (
              <span className="text-xs text-gray-400">
                Suscripción activa hasta {new Date(subscriptionStatus.expiresAt).toLocaleDateString("es-PR")}
              </span>
            )}
            <Link href="/dashboard" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              Mi resume
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Directorio de Candidatos</h1>
          <p className="text-gray-500 mt-1">
            Candidatos verificados de Puerto Rico. Filtrados por disponibilidad, zona y expectativa salarial.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar de filtros */}
          <aside className="lg:w-72 shrink-0">
            <FilterPanel
              filters={filters}
              onChange={(f) => setFilters((prev) => ({ ...prev, ...f }))}
              onReset={() => setFilters(EMPTY_FILTERS)}
            />
          </aside>

          {/* Lista de candidatos */}
          <main className="flex-1">
            {candidates === undefined ? (
              <div className="text-center py-12 text-gray-400">Buscando candidatos...</div>
            ) : candidates.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                <p className="text-gray-500 font-medium">No se encontraron candidatos con esos filtros.</p>
                <p className="text-sm text-gray-400 mt-1">Prueba ajustando los filtros.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  {candidates.length} candidato{candidates.length !== 1 ? "s" : ""} encontrado{candidates.length !== 1 ? "s" : ""}
                </p>
                <div className="space-y-4">
                  {candidates.map((resume: any, idx: number) => (
                    <div key={resume._id}>
                      {/* AdSense placeholder cada 5 cards */}
                      {idx > 0 && idx % 5 === 0 && (
                        <div className="bg-gray-100 rounded-xl h-20 flex items-center justify-center text-xs text-gray-400 mb-4 border border-dashed border-gray-300">
                          Espacio publicitario
                        </div>
                      )}
                      <CandidateCard resume={resume} />
                    </div>
                  ))}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
