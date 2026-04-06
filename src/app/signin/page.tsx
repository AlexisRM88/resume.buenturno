"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Role = "talent" | "employer";

export default function SignInPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"role" | "email" | "code">("role");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleRoleSelect(selected: Role) {
    setRole(selected);
    setStep("email");
  }

  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signIn("resend", { email });
      setStep("code");
    } catch {
      setError("Error al enviar el código. Verifica el email.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const code = (form.elements.namedItem("code") as HTMLInputElement).value;
    setLoading(true);
    setError("");
    try {
      await signIn("resend", { email, code });
      router.push(role === "employer" ? "/employers" : "/dashboard");
    } catch {
      setError("Código incorrecto. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700">BuenTurno Resume</h1>
          <p className="text-gray-600 mt-2">Plataforma de empleo para Puerto Rico</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Role selection */}
          {step === "role" && (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                ¿Quién eres?
              </h2>
              <p className="text-sm text-gray-400 text-center mb-6">Selecciona para continuar</p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleRoleSelect("talent")}
                  className="flex flex-col items-center gap-3 border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 rounded-2xl p-6 transition group"
                >
                  <span className="text-4xl">🙋</span>
                  <div className="text-center">
                    <p className="font-bold text-gray-900 group-hover:text-indigo-700">Soy candidato</p>
                    <p className="text-xs text-gray-400 mt-1">Busco empleo</p>
                  </div>
                </button>
                <button
                  onClick={() => handleRoleSelect("employer")}
                  className="flex flex-col items-center gap-3 border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 rounded-2xl p-6 transition group"
                >
                  <span className="text-4xl">🏢</span>
                  <div className="text-center">
                    <p className="font-bold text-gray-900 group-hover:text-indigo-700">Soy patrono</p>
                    <p className="text-xs text-gray-400 mt-1">Busco talento</p>
                  </div>
                </button>
              </div>
            </>
          )}

          {/* Step 2: Email */}
          {step === "email" && (
            <>
              <div className="flex items-center gap-2 mb-6">
                <button onClick={() => setStep("role")} className="text-gray-400 hover:text-gray-600">
                  ←
                </button>
                <h2 className="text-xl font-semibold text-gray-800">
                  {role === "employer" ? "Acceso para patronos" : "Inicia sesión o regístrate"}
                </h2>
              </div>
              <form onSubmit={handleEmailSubmit}>
                <label className="block text-sm text-gray-600 mb-1.5 font-medium">Tu email</label>
                <input
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4 text-base"
                />
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {loading ? "Enviando..." : "Enviar código de acceso"}
                </button>
              </form>
              <p className="text-xs text-gray-400 text-center mt-4">
                Te enviamos un código de 6 dígitos — sin contraseña
              </p>
            </>
          )}

          {/* Step 3: Code */}
          {step === "code" && (
            <form onSubmit={handleCodeSubmit}>
              <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">Revisa tu email</h2>
              <p className="text-gray-500 text-sm mb-6 text-center">
                Enviamos un código a <strong>{email}</strong>
              </p>
              <input
                name="code"
                type="text"
                inputMode="numeric"
                required
                placeholder="000000"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 mb-4 text-center text-2xl tracking-widest"
                maxLength={8}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
              >
                {loading ? "Verificando..." : "Entrar"}
              </button>
              <button
                type="button"
                onClick={() => setStep("email")}
                className="w-full mt-3 text-gray-400 text-sm hover:text-gray-600"
              >
                Cambiar email
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Al continuar, aceptas nuestros{" "}
          <a href="/terms" className="underline hover:text-gray-600">términos de uso</a>.
        </p>
      </div>
    </div>
  );
}
