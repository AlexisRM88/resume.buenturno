"use client";

import { useState } from "react";
import Link from "next/link";

interface TermsModalProps {
  onAccept: () => void;
  isLoading: boolean;
}

export function TermsModal({ onAccept, isLoading }: TermsModalProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">🎉</span>
            <h2 className="text-xl font-bold text-gray-900">¡Bienvenido a BuenTurno Resume!</h2>
          </div>
          <p className="text-sm text-gray-500">Antes de continuar, necesitamos que aceptes nuestros términos.</p>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1 space-y-4 text-sm text-gray-700">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="font-semibold text-green-800 mb-1">✅ El servicio es completamente GRATIS para ti</p>
            <p className="text-green-700 text-xs">Sin tarjeta de crédito. Sin cargos ocultos. Siempre.</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">¿Cómo funciona?</h3>
            <div className="flex gap-3">
              <span className="text-indigo-500 text-lg mt-0.5">📋</span>
              <p>Creas tu resume profesional estilo BuenTurno — con tu disponibilidad por día y hora.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-indigo-500 text-lg mt-0.5">🔍</span>
              <p>
                <strong>Compartimos tu perfil con patronos</strong> que están buscando candidatos como tú en Puerto Rico. Esto es lo que hace BuenTurno especial — los patronos te encuentran a ti.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-indigo-500 text-lg mt-0.5">🎛️</span>
              <p>Tú controlas tu visibilidad en todo momento con el toggle de <strong>"Perfil público"</strong>.</p>
            </div>
            <div className="flex gap-3">
              <span className="text-indigo-500 text-lg mt-0.5">📧</span>
              <p>Tu email <strong>nunca</strong> se comparte con patronos.</p>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            Al continuar, aceptas nuestros{" "}
            <Link href="/terms" target="_blank" className="text-indigo-600 hover:underline">
              Términos y Condiciones
            </Link>{" "}
            incluyendo que tu información profesional (nombre, municipio, habilidades, disponibilidad) sea visible para patronos registrados en la plataforma con el fin de conectarte con oportunidades de empleo. El servicio se financia con publicidad y suscripciones de patronos.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 space-y-3">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">
              He leído y acepto los{" "}
              <Link href="/terms" target="_blank" className="text-indigo-600 hover:underline">
                Términos y Condiciones
              </Link>
            </span>
          </label>

          <button
            onClick={onAccept}
            disabled={!accepted || isLoading}
            className="w-full py-3 rounded-xl font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"
          >
            {isLoading ? "Guardando..." : "Continuar y crear mi resume →"}
          </button>
        </div>
      </div>
    </div>
  );
}
