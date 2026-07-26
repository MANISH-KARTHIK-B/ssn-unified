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
    <div className="grid min-h-screen place-items-center bg-slate-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <p className="font-display text-2xl font-bold text-white">SSN - COE</p>
        <p className="mb-6 mt-1 text-xs text-slate-400">
          Opened without a portal session — sign in directly, or open this app from the SSN Unified hub.
        </p>
        <form onSubmit={onSubmit} className="space-y-3">
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-cobalt-500" placeholder="Username" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none focus:border-cobalt-500" placeholder="Password" />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button className="w-full rounded-lg bg-cobalt-500 py-2.5 text-sm font-semibold text-white hover:bg-cobalt-600">Sign in</button>
        </form>
        <a href={HUB_URL} className="mt-4 block text-center text-xs text-cobalt-400 hover:underline">← Back to SSN Unified hub</a>
      </div>
    </div>
  );
}
