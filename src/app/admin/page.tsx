"use client";

import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { api } from "../../../convex/_generated/api";

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  talent: "Talento",
  employer: "Patrono",
};

const STATUS_LABELS: Record<string, string> = {
  active: "Activa",
  expired: "Expirada",
  cancelled: "Cancelada",
  pending: "Pendiente",
};

export default function AdminPage() {
  const myProfile = useQuery(api.users.getMyProfile);
  const allUsers = useQuery(api.users.listAllUsers);
  const setRole = useMutation(api.users.setRole);
  const activateSubscription = useMutation(api.payments.activateSubscription);
  const deactivateSubscription = useMutation(api.payments.deactivateSubscription);
  const router = useRouter();

  useEffect(() => {
    if (myProfile !== undefined && myProfile?.role !== "admin") {
      router.replace("/");
    }
  }, [myProfile, router]);

  if (myProfile === undefined || allUsers === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-indigo-600 font-semibold">Cargando...</div>
      </div>
    );
  }

  if (myProfile?.role !== "admin") return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const users_list = (allUsers ?? []) as any[];
  const employers_list = users_list.filter((u) => u.role === "employer");
  const pendingEmployers = employers_list.filter((u) => u.subscriptionStatus === "pending");
  const activeEmployers = employers_list.filter((u) => u.subscriptionStatus === "active");

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-indigo-700 font-bold text-lg">BuenTurno</Link>
            <span className="text-gray-300">|</span>
            <span className="text-gray-600 text-sm">Panel Admin</span>
          </div>
          <Link href="/dashboard" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            Mi resume
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total usuarios", value: allUsers?.length ?? 0, color: "indigo" },
            { label: "Talentos", value: users_list.filter((u) => u.role === "talent").length, color: "blue" },
            { label: "Patronos activos", value: activeEmployers.length, color: "green" },
            { label: "Suscripciones pendientes", value: pendingEmployers.length, color: "amber" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Suscripciones pendientes */}
        {pendingEmployers.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              ⏳ Suscripciones pendientes ({pendingEmployers.length})
            </h2>
            <div className="bg-white rounded-2xl border border-amber-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-amber-50 border-b border-amber-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Usuario ID</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Empresa</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Estado</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pendingEmployers.map((user: any) => (
                    <tr key={user._id}>
                      <td className="px-4 py-3 text-gray-500 font-mono text-xs">{user.userId.slice(-8)}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{user.companyName ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                          {STATUS_LABELS[user.subscriptionStatus ?? ""] ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => activateSubscription({ targetUserId: user.userId, durationDays: 30 })}
                          className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition"
                        >
                          Activar 30 días
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Todos los usuarios */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Todos los usuarios</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">ID</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Empresa</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Rol</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Suscripción</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">T&C</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users_list.map((user: any) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{user.userId.slice(-8)}</td>
                    <td className="px-4 py-3 text-gray-600">{user.companyName ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "admin" ? "bg-purple-100 text-purple-700" :
                        user.role === "employer" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {ROLE_LABELS[user.role] ?? user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.subscriptionStatus ? (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          user.subscriptionStatus === "active" ? "bg-green-100 text-green-700" :
                          user.subscriptionStatus === "pending" ? "bg-amber-100 text-amber-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {STATUS_LABELS[user.subscriptionStatus] ?? user.subscriptionStatus}
                        </span>
                      ) : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {user.termsAcceptedAt
                        ? new Date(user.termsAcceptedAt).toLocaleDateString("es-PR")
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.role === "employer" && user.subscriptionStatus !== "active" && (
                          <button
                            onClick={() => activateSubscription({ targetUserId: user.userId, durationDays: 30 })}
                            className="text-xs bg-green-600 text-white px-2.5 py-1 rounded-lg hover:bg-green-700 transition"
                          >
                            Activar
                          </button>
                        )}
                        {user.role === "employer" && user.subscriptionStatus === "active" && (
                          <button
                            onClick={() => deactivateSubscription({ targetUserId: user.userId })}
                            className="text-xs bg-red-100 text-red-600 px-2.5 py-1 rounded-lg hover:bg-red-200 transition"
                          >
                            Cancelar
                          </button>
                        )}
                        {user.role !== "admin" && (
                          <select
                            defaultValue={user.role}
                            onChange={(e) => setRole({ targetUserId: user.userId, role: e.target.value as any })}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none"
                          >
                            <option value="talent">Talento</option>
                            <option value="employer">Patrono</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
