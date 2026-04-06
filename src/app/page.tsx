import Link from "next/link";
import { CTALink } from "@/components/CTALink";
import { AdBanner } from "@/components/AdBanner";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">

      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-indigo-700 tracking-tight">BuenTurno</span>
            <span className="hidden sm:inline text-xs bg-indigo-100 text-indigo-600 font-semibold px-2 py-0.5 rounded-full">Resume</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/preview" className="text-sm text-gray-500 hover:text-gray-800 font-medium hidden sm:block">
              Ver demo
            </Link>
            <Link href="/employers" className="text-sm text-gray-600 hover:text-indigo-600 font-medium hidden sm:block">
              Soy patrono
            </Link>
            <Link
              href="/dashboard"
              className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition shadow-sm"
            >
              Crear mi resume →
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-6 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-black px-4 py-2 rounded-full mb-6 uppercase tracking-wide shadow-sm">
            COMPLETAMENTE GRATIS — Sin tarjeta · Sin registro complicado
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-[1.1] mb-6">
            Crea tu Resume Profesional y conecta con{" "}
            <span className="text-indigo-600">patronos que buscan tu talento</span>{" "}
            en Puerto Rico
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 mb-4 max-w-xl mx-auto leading-relaxed">
            El único resume en Puerto Rico que muestra tu{" "}
            <strong className="text-gray-800">disponibilidad por día y hora</strong>.
            Los patronos te encuentran a ti — no al revés.
          </p>

          <p className="text-sm text-gray-400 mb-10">
            Compatible con ATS · PDF profesional · 4 plantillas · Para trabajadores de Puerto Rico
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <CTALink
              href="/dashboard"
              label="hero_crear_resume"
              className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-black hover:bg-indigo-700 transition shadow-xl shadow-indigo-200"
            >
              Crear mi resume gratis →
            </CTALink>
            <CTALink
              href="/employers"
              label="hero_soy_patrono"
              className="inline-block bg-white text-indigo-700 border-2 border-indigo-200 px-8 py-4 rounded-2xl text-lg font-bold hover:border-indigo-400 transition"
            >
              Soy patrono
            </CTALink>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-14 text-center">
            {[
              { num: "5 min", label: "para crear tu resume" },
              { num: "4", label: "estilos de diseño" },
              { num: "100%", label: "legible por ATS" },
              { num: "Gratis", label: "siempre para candidatos" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-black text-indigo-700">{s.num}</p>
                <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUÉ TIENE EL RESUME BUENTURNO ── */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest text-center mb-3">El formato</p>
          <h2 className="text-3xl font-black text-gray-900 text-center mb-4">
            ¿Qué tiene el Resume BuenTurno?
          </h2>
          <p className="text-center text-gray-500 mb-10 max-w-xl mx-auto">
            Más que un resume bonito — un formato inteligente diseñado para conectar candidatos reales con patronos de Puerto Rico.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: "📅",
                title: "Disponibilidad por día y hora",
                desc: "Muestra exactamente cuándo puedes trabajar: Lun 8AM–5PM, Sáb 9AM–2PM. Los patronos saben al instante si encajas en su horario.",
              },
              {
                icon: "📄",
                title: "Una sola página, todo claro",
                desc: "Sin hojas extras. Toda tu información esencial en un formato limpio que los reclutadores pueden escanear en segundos.",
              },
              {
                icon: "💰",
                title: "Expectativa salarial visible",
                desc: "Incluye tu expectativa salarial para que los patronos contacten solo candidatos dentro de su presupuesto — más conversaciones relevantes para ti.",
              },
            ].map((f) => (
              <div key={f.title} className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CÓMO FUNCIONA ── */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest text-center mb-3">Proceso</p>
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">
            3 pasos, resume en mano
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Llena tu info",
                desc: "Nombre, pueblo, habilidades, experiencias y disponibilidad. Todo desde tu celular.",
                icon: "✏️",
              },
              {
                step: "02",
                title: "Elige tu estilo",
                desc: "4 diseños profesionales: Moderno, Elegante, Minimalista o Federal para USAJobs.",
                icon: "🎨",
              },
              {
                step: "03",
                title: "Descarga y conecta",
                desc: "PDF listo al instante. Tu perfil aparece en búsquedas de patronos automáticamente.",
                icon: "📥",
              },
            ].map((s) => (
              <div key={s.step} className="relative">
                <div className="text-5xl mb-4">{s.icon}</div>
                <span className="text-xs font-black text-indigo-300 tracking-widest">{s.step}</span>
                <h3 className="text-lg font-black text-gray-900 mt-1 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <CTALink
              href="/dashboard"
              label="como_funciona_empezar"
              className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition"
            >
              Empezar ahora — gratis →
            </CTALink>
          </div>
        </div>
      </section>

      {/* ── AD BANNER ── */}
      <div className="border-y border-gray-200 py-2 px-6">
        <div className="max-w-4xl mx-auto">
          <AdBanner slot="1234567890" format="horizontal" />
        </div>
      </div>

      {/* ── BENEFICIOS CANDIDATO ── */}
      <section className="bg-white px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest text-center mb-3">Para candidatos</p>
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">
            Tu resume trabaja por ti — gratis
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              {
                icon: "🔍",
                title: "Patronos te encuentran",
                desc: "Tu perfil aparece en búsquedas de patronos registrados en BuenTurno. Ellos te contactan a ti.",
              },
              {
                icon: "🤖",
                title: "Compatible con ATS",
                desc: "Los sistemas de reclutamiento leen tu resume sin errores. Más probabilidad de pasar el filtro automático.",
              },
              {
                icon: "📅",
                title: "Disponibilidad precisa",
                desc: "Muestra exactamente cuándo puedes trabajar, día por día. Los patronos saben al instante si encajas.",
              },
              {
                icon: "📱",
                title: "Hecho para móvil",
                desc: "Sin laptop necesaria. Completa tu resume desde tu iPhone o Android en menos de 5 minutos.",
              },
              {
                icon: "🇺🇸",
                title: "Modo Federal (USAJobs)",
                desc: "Activa el modo federal con un toggle para empleos de gobierno — horas, salario, supervisor y dirección.",
              },
              {
                icon: "🎨",
                title: "4 diseños profesionales",
                desc: "Moderno, Elegante, Minimalista o Federal. Personaliza el color. Previsualiza antes de descargar.",
              },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-indigo-200 transition">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARA PATRONOS ── */}
      <section id="patronos" className="px-6 py-16 bg-indigo-700 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-3">Para patronos</p>
              <h2 className="text-3xl font-black leading-tight mb-5">
                Encuentra candidatos calificados en Puerto Rico
              </h2>
              <p className="text-indigo-100 leading-relaxed mb-6">
                Busca candidatos por <strong className="text-white">pueblo, zona geográfica, disponibilidad y expectativa salarial</strong>. Accede a un banco de talentos activos con Resume BuenTurno.
              </p>
              <ul className="space-y-3 text-sm text-indigo-100">
                {[
                  "Filtra por los 78 municipios de Puerto Rico o por zona (Metro, Norte, Sur, Este, Oeste)",
                  "Disponibilidad exacta: día y hora de cada candidato",
                  "Expectativa salarial visible — contacta solo candidatos en tu presupuesto",
                  "Resumes ATS/OCR compatible — datos estructurados y listos",
                  "Nuevos candidatos cada semana",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-indigo-300 shrink-0 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-indigo-800 rounded-2xl p-7 border border-indigo-600">
              <div className="text-center mb-4">
                <span className="text-4xl font-black text-white">$45</span>
                <span className="text-indigo-300 text-sm">/mes</span>
              </div>
              <h3 className="font-black text-lg mb-4 text-center">Acceso al directorio de candidatos</h3>
              <ul className="space-y-2 text-sm text-indigo-200 mb-6">
                {[
                  "Búsqueda ilimitada de candidatos",
                  "Filtros por zona, pueblo y disponibilidad",
                  "Ver perfil completo de cada talento",
                  "Cancela cuando quieras",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-green-400">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/employers"
                className="block w-full text-center bg-white text-indigo-700 font-bold py-3.5 rounded-xl hover:bg-indigo-50 transition"
              >
                Acceder como patrono →
              </Link>
              <p className="text-center text-indigo-400 text-xs mt-3">
                Tu suscripción mantiene la plataforma gratis para los candidatos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="px-6 py-20 text-center bg-white">
        <div className="max-w-xl mx-auto">
          <p className="text-4xl mb-4">🚀</p>
          <h2 className="text-3xl font-black text-gray-900 mb-4">
            Empieza en segundos — siempre gratis
          </h2>
          <p className="text-gray-500 mb-8">
            Crea tu resume profesional y aparece en búsquedas de patronos que buscan tu talento en Puerto Rico.
          </p>
          <CTALink
            href="/dashboard"
            label="cta_final_crear_resume"
            className="inline-block bg-indigo-600 text-white px-10 py-4 rounded-2xl text-lg font-black hover:bg-indigo-700 transition shadow-xl shadow-indigo-200"
          >
            Crear mi resume gratis →
          </CTALink>
          <p className="text-xs text-gray-400 mt-4">Sin tarjeta de crédito · Sin contratos</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-100 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-black text-indigo-700 text-lg">BuenTurno</span>
            <span className="text-gray-400 text-sm ml-2">Resume</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <Link href="/terms" className="hover:text-gray-600">Términos</Link>
            <Link href="/employers" className="hover:text-gray-600">Patronos</Link>
            <Link href="/preview" className="hover:text-gray-600">Demo</Link>
            <a href="mailto:contacto@buenturno.com" className="hover:text-gray-600">Contacto</a>
          </div>
          <p className="text-sm text-gray-400">
            © 2026 resume.buenturno.com
          </p>
        </div>
      </footer>

    </div>
  );
}
