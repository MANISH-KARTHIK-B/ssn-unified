import React, { useState } from "react";
import { useAuth } from "../lib/auth";

export default function LoginPanel({ onNavigateAccount }) {
  const { user, login, logout } = useAuth();
  const [username, setUsername] = useState("student1");
  const [password, setPassword] = useState("demo1234");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  if (user) {
    return (
      <div className="rounded-xl border border-ocean-100 bg-white p-5">
        <p className="text-sm text-ocean-900">Signed in as</p>
        <p className="font-display text-lg font-bold text-ocean-700">{user.name}</p>
        <p className="mb-4 text-xs text-ocean-600">{user.regNo}</p>
        <button onClick={onNavigateAccount} className="mb-2 w-full rounded-lg bg-ocean-600 py-2 text-sm font-semibold text-white hover:bg-ocean-700">
          My Account
        </button>
        <button onClick={logout} className="w-full rounded-lg border border-ocean-200 py-2 text-sm text-ocean-700 hover:bg-ocean-50">
          Log out
        </button>
      </div>
    );
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(username, password);
    } catch {
      setError("Invalid card number/username or password.");
    }
  }

  return (
    <div className="rounded-xl border border-ocean-100 bg-white p-5">
      <p className="mb-3 text-sm font-semibold text-ocean-900">Log in to your account:</p>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-ocean-700">Card number or username:</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-ocean-700">Password:</label>
          <input type={showPw ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
        </div>
        <label className="flex items-center gap-1.5 text-xs text-ocean-700">
          <input type="checkbox" checked={showPw} onChange={(e) => setShowPw(e.target.checked)} /> Show password
        </label>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button className="w-full rounded-lg bg-ocean-600 py-2 text-sm font-semibold text-white hover:bg-ocean-700">Log in</button>
      </form>
      <button className="mt-3 text-xs text-ocean-600 hover:underline">Forgot your password?</button>
    </div>
  );
}
