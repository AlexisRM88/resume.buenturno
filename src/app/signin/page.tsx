"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackRoleSelected, trackEmailSubmit, trackLoginSuccess } from "@/lib/analytics";

type Role = "talent" | "employer";
type AuthMode = "login" | "register";
type Screen = "role" | "auth" | "forgot" | "reset-code";

export default function SignInPage() {
  const { signIn } = useAuthActions();
  const router = useRouter();

  const [role, setRole] = useState<Role | null>(null);
  const [screen, setScreen] = useState<Screen>("role");
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  function handleRoleSelect(selected: Role) {
    setRole(selected);
    setScreen("auth");
    trackRoleSelected(selected);
  }

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (authMode === "register" && password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const flow = authMode === "register" ? "signUp" : "signIn";
      await signIn("password", { email, password, flow });
      trackEmailSubmit(role!);
      trackLoginSuccess(role!);
      router.push(role === "employer" ? "/employers" : "/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("InvalidAccountId") || msg.includes("not found") || msg.includes("invalid")) {
        setError(
          authMode === "login"
            ? "Email o contraseña incorrectos."
            : "No se pudo crear la cuenta. Intenta de nuevo."
        );
      } else if (msg.includes("already exists") || msg.includes("AccountAlreadyExists")) {
        setError("Ya existe una cuenta con ese email. Inicia sesión.");
        setAuthMode("login");
      } else {
        setError("Ocurrió un error. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn("password", { email, flow: "reset" });
      setInfo("Te enviamos un código a tu email.");
      setScreen("reset-code");
    } catch {
      setError("No encontramos una cuenta con ese email.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResetCodeSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmNewPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await signIn("password", {
        email,
        code: resetCode,
        newPassword,
        flow: "reset-verification",
      });
      setInfo("Contraseña actualizada. Inicia sesión.");
      setScreen("auth");
      setAuthMode("login");
      setPassword("");
      setResetCode("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch {
      setError("Código incorrecto o expirado. Intenta de nuevo.");
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

          {/* Error / Info banners */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
              {error}
            </div>
          )}
          {info && !error && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 text-sm">
              {info}
            </div>
          )}

          {/* ── STEP 1: Role ── */}
          {screen === "role" && (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-2 text-center">¿Quién eres?</h2>
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

          {/* ── STEP 2: Email + Password ── */}
          {screen === "auth" && (
            <>
              {/* Back + tabs */}
              <div className="flex items-center gap-2 mb-5">
                <button onClick={() => { setScreen("role"); setError(""); setInfo(""); }} className="text-gray-400 hover:text-gray-600 text-lg">
                  ←
                </button>
                <div className="flex flex-1 bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => { setAuthMode("login"); setError(""); setInfo(""); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                      authMode === "login" ? "bg-white shadow text-indigo-700" : "text-gray-500"
                    }`}
                  >
                    Iniciar sesión
                  </button>
                  <button
                    onClick={() => { setAuthMode("register"); setError(""); setInfo(""); }}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                      authMode === "register" ? "bg-white shadow text-indigo-700" : "text-gray-500"
                    }`}
                  >
                    Registrarme
                  </button>
                </div>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1 font-medium">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-1 font-medium">Contraseña</label>
                  <input
                    type="password"
                    required
                    placeholder={authMode === "register" ? "Mínimo 8 caracteres" : "Tu contraseña"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
                  />
                </div>

                {authMode === "register" && (
                  <div>
                    <label className="block text-sm text-gray-600 mb-1 font-medium">Confirmar contraseña</label>
                    <input
                      type="password"
                      required
                      placeholder="Repite tu contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {loading
                    ? "Procesando..."
                    : authMode === "register"
                    ? "Crear cuenta →"
                    : "Entrar →"}
                </button>
              </form>

              {authMode === "login" && (
                <button
                  onClick={() => { setScreen("forgot"); setError(""); setInfo(""); }}
                  className="w-full text-center text-sm text-indigo-500 hover:text-indigo-700 mt-4"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}
            </>
          )}

          {/* ── STEP 3a: Forgot password ── */}
          {screen === "forgot" && (
            <>
              <div className="flex items-center gap-2 mb-5">
                <button onClick={() => { setScreen("auth"); setError(""); setInfo(""); }} className="text-gray-400 hover:text-gray-600 text-lg">
                  ←
                </button>
                <h2 className="text-lg font-semibold text-gray-800">Recuperar contraseña</h2>
              </div>
              <p className="text-sm text-gray-500 mb-5">
                Ingresa tu email y te enviaremos un código para restablecer tu contraseña.
              </p>
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1 font-medium">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {loading ? "Enviando..." : "Enviar código"}
                </button>
              </form>
            </>
          )}

          {/* ── STEP 3b: Reset code + new password ── */}
          {screen === "reset-code" && (
            <>
              <div className="flex items-center gap-2 mb-5">
                <button onClick={() => { setScreen("forgot"); setError(""); setInfo(""); }} className="text-gray-400 hover:text-gray-600 text-lg">
                  ←
                </button>
                <h2 className="text-lg font-semibold text-gray-800">Nueva contraseña</h2>
              </div>
              <p className="text-sm text-gray-500 mb-5">
                Revisa tu email <strong>{email}</strong> e ingresa el código junto con tu nueva contraseña.
              </p>
              <form onSubmit={handleResetCodeSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1 font-medium">Código de verificación</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="000000"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-center text-2xl tracking-widest text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    maxLength={8}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1 font-medium">Nueva contraseña</label>
                  <input
                    type="password"
                    required
                    placeholder="Mínimo 8 caracteres"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1 font-medium">Confirmar contraseña</label>
                  <input
                    type="password"
                    required
                    placeholder="Repite tu contraseña"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  {loading ? "Guardando..." : "Cambiar contraseña"}
                </button>
              </form>
            </>
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
