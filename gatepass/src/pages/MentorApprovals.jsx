import React, { useEffect, useState } from "react";
import { Check, X, GraduationCap } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";

function fmt(dt) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function MentorApprovals() {
  const { user } = useAuth();
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);

  function refresh() {
    api.get("/api/faculty/gatepass").then((res) => {
      setPasses(res.data);
      setLoading(false);
    });
  }

  useEffect(refresh, []);

  async function decide(id, decision) {
    await api.post(`/api/faculty/gatepass/${id}/decision`, { decision });
    refresh();
  }

  const pending = passes.filter((p) => p.approvals.mentor === "Pending");
  const decided = passes.filter((p) => p.approvals.mentor !== "Pending");

  return (
    <div className="flex-1 px-8 py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-brand-900">Mentor Approvals</h1>
        <p className="text-sm text-ink-500">{user?.name} — Gatepass requests waiting on you</p>
      </div>

      <div className="rounded-2xl border border-brand-100 bg-white">
        <div className="border-b border-brand-50 px-6 py-4">
          <p className="font-display font-semibold text-ink-900">Awaiting your decision ({pending.length})</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-ink-500">
                <th className="px-6 py-3">Student</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Departure</th>
                <th className="px-6 py-3">Return</th>
                <th className="px-6 py-3">Reason</th>
                <th className="px-6 py-3">Decision</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-6 py-4 font-medium text-ink-900">{p.studentId}</td>
                  <td className="px-6 py-4">{p.type}</td>
                  <td className="px-6 py-4 text-ink-700">{fmt(p.departure)}</td>
                  <td className="px-6 py-4 text-ink-700">{fmt(p.return)}</td>
                  <td className="px-6 py-4 text-ink-700">{p.reason || "—"}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => decide(p.id, "approve")}
                        className="flex items-center gap-1 rounded-md bg-green-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-green-600"
                      >
                        <Check className="h-3.5 w-3.5" /> Approve
                      </button>
                      <button
                        onClick={() => decide(p.id, "reject")}
                        className="flex items-center gap-1 rounded-md bg-red-500 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-red-600"
                      >
                        <X className="h-3.5 w-3.5" /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && pending.length === 0 && <p className="p-6 text-sm text-ink-500">No passes waiting on you right now.</p>}
        </div>
      </div>

      <div className="mt-8 rounded-2xl border border-brand-100 bg-white">
        <div className="border-b border-brand-50 px-6 py-4">
          <p className="font-display font-semibold text-ink-900">Recently decided</p>
        </div>
        <div className="divide-y divide-gray-50">
          {decided.slice(0, 10).map((p) => (
            <div key={p.id} className="flex items-center justify-between px-6 py-3 text-sm">
              <span className="text-ink-700">{p.studentId} — {p.type}</span>
              <span className={`flex items-center gap-1 text-xs font-semibold ${p.approvals.mentor === "Approved" ? "text-green-700" : "text-red-600"}`}>
                <GraduationCap className="h-3.5 w-3.5" /> {p.approvals.mentor}
              </span>
            </div>
          ))}
          {decided.length === 0 && <p className="p-6 text-sm text-ink-500">Nothing decided yet.</p>}
        </div>
      </div>
    </div>
  );
}
