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
    <div className="grid min-h-screen place-items-center bg-wine-900 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <p className="font-display text-2xl font-bold text-wine-700">SSN ERP</p>
        <p className="mb-6 mt-1 text-xs text-stone-500">
          Opened without a portal session — sign in directly, or open this app from the SSN Unified hub.
        </p>
        <form onSubmit={onSubmit} className="space-y-3">
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-wine-500" placeholder="Username" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-wine-500" placeholder="Password" />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button className="w-full rounded-lg bg-wine-600 py-2.5 text-sm font-semibold text-white hover:bg-wine-700">Sign in</button>
        </form>
        <a href={HUB_URL} className="mt-4 block text-center text-xs text-wine-600 hover:underline">← Back to SSN Unified hub</a>
      </div>
    </div>
  );
}
