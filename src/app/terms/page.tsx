import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Términos y Condiciones | BuenTurno Resume",
  description: "Términos y condiciones del servicio BuenTurno Resume. Conoce cómo usamos tu información para conectarte con patronos en Puerto Rico.",
};

export default function TermsPage() {
  const fecha = "1 de abril de 2026";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            ← Volver al inicio
          </Link>
          <span className="text-gray-300">|</span>
          <span className="text-gray-600 text-sm">BuenTurno Resume</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Términos y Condiciones</h1>
        <p className="text-sm text-gray-500 mb-8">Última actualización: {fecha}</p>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-8">
          <p className="text-indigo-800 font-medium">
            ✨ BuenTurno Resume es completamente <strong>gratuito</strong> para candidatos. A cambio, compartimos tu perfil con patronos que están buscando activamente personas con tu talento — esta es la forma en que te conectamos con oportunidades de empleo sin que tengas que buscarlas tú solo.
          </p>
        </div>

        <div className="space-y-8 text-gray-700 leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Quiénes Somos</h2>
            <p>
              BuenTurno Resume (<strong>resume.buenturno.com</strong>) es un proyecto de{" "}
              <a href="https://cabuyacreativa.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">CabuyaCreativa.com</a>,
              agencia de soluciones digitales con base en Puerto Rico. BuenTurno.com y resume.buenturno.com son iniciativas propias de CabuyaCreativa.
            </p>
            <p className="mt-3">
              Para comunicarse con el operador de este servicio:{" "}
              <a href="mailto:cabuyacreativa@gmail.com" className="text-indigo-600 hover:underline">
                cabuyacreativa@gmail.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Aceptación de los Términos</h2>
            <p>
              Al crear una cuenta o usar los servicios de BuenTurno Resume ("el Servicio"), operado por CabuyaCreativa.com con sede en Puerto Rico, usted acepta estos Términos y Condiciones en su totalidad. Si no está de acuerdo, no use el Servicio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Descripción del Servicio</h2>
            <p>
              BuenTurno Resume es una plataforma gratuita que permite a candidatos (talentos) crear un resume profesional de una sola página al estilo BuenTurno — que incluye disponibilidad por día y hora — y conectarse con patronos (empleadores) que buscan candidatos con su perfil.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-1">
              <li>Creación y descarga de resume en formato PDF (gratis)</li>
              <li>Perfil público visible para patronos registrados</li>
              <li>Matcheo automático con patronos según habilidades, disponibilidad y ubicación</li>
              <li>Actualización ilimitada de tu resume</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Cómo Usamos Tu Información (y Por Qué es un Beneficio)</h2>
            <p>
              Al crear un perfil público en BuenTurno Resume, autorizas que tu información profesional (nombre, municipio, habilidades, disponibilidad, expectativa salarial y experiencia) sea visible para patronos registrados en la plataforma que están buscando candidatos con tu perfil.
            </p>
            <p className="mt-3">
              <strong>Esto es un beneficio para ti:</strong> en lugar de tener que aplicar a cada trabajo individualmente, los patronos te encuentran a ti. Muchos candidatos en BuenTurno han sido contactados por patronos sin haber enviado una sola aplicación.
            </p>
            <p className="mt-3">
              Tú controlas tu visibilidad en todo momento mediante el toggle de <strong>"Perfil público"</strong> en tu resume. Puedes desactivarlo si no deseas aparecer en búsquedas de patronos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Privacidad y Datos Personales</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Tu información <strong>no se vende</strong> a terceros fuera de la plataforma.</li>
              <li>Solo patronos registrados y verificados en BuenTurno pueden ver tu perfil.</li>
              <li>Tu dirección de correo electrónico <strong>nunca</strong> se comparte con patronos.</li>
              <li>Puedes solicitar la eliminación de tu cuenta y todos tus datos en cualquier momento escribiéndonos a <a href="mailto:privacidad@buenturno.com" className="text-indigo-600 hover:underline">privacidad@buenturno.com</a>.</li>
              <li>Cumplimos con la Ley de Privacidad de Puerto Rico y principios del GDPR donde aplique.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Modelo de Negocio y Anuncios</h2>
            <p>
              BuenTurno Resume es gratuito para candidatos. El servicio se financia mediante:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li><strong>Suscripciones de patronos:</strong> Los patronos pagan $45/mes para acceder al directorio de candidatos filtrado.</li>
              <li><strong>Publicidad de Google AdSense:</strong> El Servicio muestra anuncios publicitarios relevantes. Estos anuncios son proporcionados por Google y se rigen por la <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Política de Privacidad de Google</a>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Responsabilidades del Usuario</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Proporcionar información veraz y actualizada en tu resume.</li>
              <li>No usar el Servicio para fines fraudulentos o ilegales.</li>
              <li>Mantener la confidencialidad de tu contraseña y cuenta.</li>
              <li>No copiar, scrape, ni extraer datos de otros perfiles de candidatos.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Limitación de Responsabilidad</h2>
            <p>
              BuenTurno Resume actúa como intermediario entre candidatos y patronos. No garantizamos que el uso del Servicio resultará en empleo. Las interacciones entre candidatos y patronos son responsabilidad de las partes involucradas.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Modificaciones</h2>
            <p>
              Nos reservamos el derecho de modificar estos Términos. Te notificaremos por correo electrónico si realizamos cambios materiales. El uso continuado del Servicio después de dichos cambios constituye aceptación.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Ley Aplicable</h2>
            <p>
              Estos Términos se rigen por las leyes del Estado Libre Asociado de Puerto Rico y las leyes federales de los Estados Unidos aplicables.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contacto</h2>
            <p>
              BuenTurno Resume es un proyecto de{" "}
              <a href="https://cabuyacreativa.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">CabuyaCreativa.com</a>.
              Para preguntas sobre estos Términos o sobre el servicio, escríbenos a:{" "}
              <a href="mailto:cabuyacreativa@gmail.com" className="text-indigo-600 hover:underline">
                cabuyacreativa@gmail.com
              </a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-medium"
          >
            Crear mi resume gratis →
          </Link>
        </div>
      </main>
    </div>
  );
}
