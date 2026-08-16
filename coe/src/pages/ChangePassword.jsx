import React, { useState } from "react";
import { KeyRound } from "lucide-react";
import { api } from "../lib/api";

export default function ChangePassword() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (next !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      await api.post("/api/auth/change-password", { currentPassword: current, newPassword: next });
      setSuccess(true);
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      setError(err.response?.data?.error || "Could not change password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="px-8 py-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-slate-900">Change Password</h1>
      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-2 text-slate-500">
          <KeyRound className="h-4 w-4" />
          <p className="text-xs">Your new password takes effect immediately across every SSN Unified app.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Current password</label>
            <input type="password" required value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">New password</label>
            <input type="password" required minLength={4} value={next} onChange={(e) => setNext(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Confirm new password</label>
            <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          {success && <p className="text-xs text-green-600">Password updated successfully.</p>}
          <button disabled={busy} className="w-full rounded-lg bg-cobalt-500 py-2.5 text-sm font-semibold text-white hover:bg-cobalt-600 disabled:opacity-60">
            {busy ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
