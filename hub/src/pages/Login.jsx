import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("student1");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(username, password);
      navigate("/", { replace: true });
    } catch {
      setError("Invalid username or password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-navy-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-navy-800 bg-navy-900 p-8 shadow-2xl">
        <div className="mb-6 flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-amber-500 font-display text-xl font-bold text-navy-950">
            S
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-white">SSN Unified</p>
            <p className="text-xs text-navy-400">Sign in to your student portal</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-navy-300">Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-navy-700 bg-navy-950 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-navy-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-navy-700 bg-navy-950 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500"
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            disabled={busy}
            className="w-full rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-amber-400 disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="mt-6 rounded-lg border border-navy-800 bg-navy-950/60 p-3 text-[11px] leading-relaxed text-navy-400">
          <p className="mb-1 font-semibold text-navy-300">Demo accounts</p>
          Student: student1–student8 / demo1234 &nbsp;·&nbsp; Mentor: faculty1 / demo1234 &nbsp;·&nbsp; Admin: admin1 / demo1234
        </div>
      </div>
    </div>
  );
}
