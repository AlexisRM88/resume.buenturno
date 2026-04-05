"use client";

import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../../../convex/_generated/api";

export default function SubscribePage() {
  const myProfile = useQuery(api.users.getMyProfile);
  const subscriptionStatus = useQuery(api.payments.checkSubscriptionStatus);
  const requestSubscription = useMutation(api.payments.requestSubscription);
  const router = useRouter();

  async function handleRequest() {
    try {
      await requestSubscription();
    } catch (err) {
      console.error(err);
    }
  }

  if (subscriptionStatus?.active) {
    router.replace("/employers");
    return null;
  }

  const isPending = myProfile?.subscriptionStatus === "pending";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-6">
        {/* Precio */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
            ✅ Acceso ilimitado
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">$45</h1>
            <p className="text-gray-500 text-sm">/mes · Cancela cuando quieras</p>
          </div>

          <div className="text-left space-y-2 py-4 border-t border-gray-100">
            {[
              "Búsqueda ilimitada de candidatos en PR",
              "Filtros por municipio, zona y disponibilidad",
              "Filtrar por expectativa salarial",
              "Ver perfil completo de cada candidato",
              "Nuevos candidatos cada semana",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">✓</span>
                {item}
              </div>
            ))}
          </div>

          {isPending ? (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left space-y-2">
              <p className="font-semibold text-amber-800">✅ Solicitud recibida</p>
              <p className="text-sm text-amber-700">
                Hemos recibido tu solicitud de suscripción. Nos pondremos en contacto en las próximas horas para coordinar el pago y activar tu acceso.
              </p>
              <a
                href="mailto:patronos@buenturno.com?subject=Solicitud%20de%20suscripci%C3%B3n%20-%20Patrono&body=Hola%2C%20me%20interesa%20la%20suscripci%C3%B3n%20de%20patronos%20por%20%2445%2Fmes."
                className="inline-block text-sm text-indigo-600 hover:underline font-medium"
              >
                También puedes escribirnos directamente →
              </a>
            </div>
          ) : (
            <button
              onClick={handleRequest}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:bg-indigo-700 transition text-lg"
            >
              Suscribirme ahora
            </button>
          )}

          <p className="text-xs text-gray-400">
            Al suscribirte aceptas nuestros{" "}
            <Link href="/terms" className="text-indigo-600 hover:underline">Términos y Condiciones</Link>
          </p>
        </div>

        {/* Nota sobre proceso de pago */}
        {!isPending && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
            <p className="font-semibold mb-1">ℹ️ Proceso de activación</p>
            <p>Al hacer clic en "Suscribirme" te contactaremos para coordinar el pago ($45/mes). Actualmente aceptamos pago por ATH Móvil, transferencia bancaria o tarjeta de crédito. Activamos tu cuenta en menos de 24 horas.</p>
          </div>
        )}

        <div className="text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
