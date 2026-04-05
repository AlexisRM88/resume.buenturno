"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogleSignIn() {
    setLoading(true);
    try {
      await signIn("google", { redirectTo: "/dashboard" });
    } catch {
      setError("Error al iniciar sesión con Google.");
      setLoading(false);
    }
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
      router.push("/dashboard");
    } catch {
      setError("Código incorrecto. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700">BuenTurno</h1>
          <p className="text-gray-600 mt-2">Crea tu resume profesional gratis</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            {step === "email" ? "Inicia sesión o regístrate" : "Revisa tu email"}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          {step === "email" ? (
            <>
              {/* Google */}
              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-xl py-3 px-4 text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50 mb-4"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar con Google
              </button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-400">o con tu email</span>
                </div>
              </div>

              {/* Email */}
              <form onSubmit={handleEmailSubmit}>
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
                  {loading ? "Enviando..." : "Enviar código"}
                </button>
              </form>
            </>
          ) : (
            <form onSubmit={handleCodeSubmit}>
              <p className="text-gray-600 text-sm mb-4 text-center">
                Enviamos un código a <strong>{email}</strong>. Revisa tu bandeja de entrada.
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
                {loading ? "Verificando..." : "Verificar código"}
              </button>
              <button
                type="button"
                onClick={() => setStep("email")}
                className="w-full mt-3 text-gray-500 text-sm hover:text-gray-700"
              >
                Cambiar email
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Al continuar, aceptas nuestros términos de uso.
        </p>
      </div>
    </div>
  );
}
