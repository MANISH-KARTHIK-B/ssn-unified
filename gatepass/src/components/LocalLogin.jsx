import React, { useState } from "react";
import { useAuth } from "../lib/auth";
import { HUB_URL } from "../lib/api";

export default function LocalLogin() {
  const { login } = useAuth();
  const [username, setUsername] = useState("student1");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
    } catch {
      setError("Invalid username or password.");
    }
  }

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 px-4">
      <div className="pointer-events-none absolute inset-0 bg-gate-grid bg-[length:22px_22px] opacity-40" />

      <div className="relative w-full max-w-sm">
        <div className="mb-5 flex items-center justify-center gap-2.5">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-white font-display text-lg font-extrabold italic text-brand-700 shadow-lg">
            S
          </div>
          <div className="text-left">
            <p className="font-display text-sm font-bold leading-tight tracking-wide text-white">SSN COLLEGE OF ENGINEERING</p>
            <p className="text-xs leading-tight text-brand-100">Gatepass Portal</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="h-1 w-full bg-gold-500" />
          <div className="p-8">
            <p className="font-display text-xl font-bold text-ink-900">Sign in</p>
            <p className="mb-6 mt-1 text-xs text-ink-500">
              Opened without a portal session — sign in directly, or open this app from the SSN Unified hub.
            </p>
            <form onSubmit={onSubmit} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-500">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  placeholder="student1 / faculty1 / warden1"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-ink-500">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  placeholder="Password"
                />
              </div>
              {error && <p className="text-xs font-medium text-red-500">{error}</p>}
              <button className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700">
                Sign in
              </button>
            </form>
          </div>
        </div>

        <a href={HUB_URL} className="mt-5 block text-center text-xs font-medium text-brand-100 hover:text-white hover:underline">
          ← Back to SSN Unified hub
        </a>
      </div>
    </div>
  );
}
