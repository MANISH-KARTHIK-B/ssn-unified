import React, { useEffect, useMemo, useState } from "react";
import { Plus, Eye, X, CalendarClock } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import NewRequestModal from "../components/NewRequestModal";

const STATUS_STYLE = {
  Approved: "bg-green-100 text-green-700",
  Completed: "bg-purple-100 text-purple-700",
  Cancelled: "bg-gray-200 text-gray-600",
  Pending: "bg-amber-100 text-amber-700"
};

const APPROVAL_STYLE = {
  Approved: "bg-green-50 text-green-700",
  Pending: "bg-amber-50 text-amber-700",
  "Not Required": "bg-gray-100 text-gray-500"
};

function fmt(dt) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function PassRequests() {
  const { user } = useAuth();
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [viewing, setViewing] = useState(null);

  useEffect(() => {
    api.get("/api/gatepass").then((res) => {
      setPasses(res.data);
      setLoading(false);
    });
  }, []);

  const wdpThisMonth = useMemo(() => {
    const now = new Date();
    return passes.filter(
      (p) =>
        p.type === "Working Day Pass" &&
        new Date(p.departure).getMonth() === now.getMonth() &&
        new Date(p.departure).getFullYear() === now.getFullYear()
    ).length;
  }, [passes]);

  return (
    <div className="flex-1 px-8 py-8">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Pass Requests</h1>
          <p className="text-sm text-ink-500">{user?.name?.toUpperCase()} — {user?.regNo}</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600"
        >
          <Plus className="h-4 w-4" /> New Request
        </button>
      </div>

      <div className="mb-6 w-fit rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2 text-sm text-ink-500">
          <CalendarClock className="h-4 w-4" /> WDP This Month
        </div>
        <p className="mt-2 font-display text-4xl font-bold text-ink-900">{wdpThisMonth}</p>
        <p className="text-xs text-ink-500">Working Day Passes used this month</p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white">
        <div className="border-b border-gray-100 px-6 py-4">
          <p className="font-display font-semibold text-ink-900">Request History</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-ink-500">
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Departure</th>
                <th className="px-6 py-3">Return</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Approvals</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {passes.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-6 py-4">
                    <p className="font-medium text-ink-900">{p.type}</p>
                    {p.reason && <p className="text-xs text-ink-500">{p.reason}</p>}
                  </td>
                  <td className="px-6 py-4 text-ink-700">{fmt(p.departure)}</td>
                  <td className="px-6 py-4 text-ink-700">{fmt(p.return)}</td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1.5">
                      {[["M", p.approvals.mentor], ["S", p.approvals.security], ["W", p.approvals.warden]].map(([k, v]) => (
                        <span key={k} className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${APPROVAL_STYLE[v]}`}>{k}: {v}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => setViewing(p)} className="flex items-center gap-1.5 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs text-ink-700 hover:border-brand-500">
                      <Eye className="h-3.5 w-3.5" /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && passes.length === 0 && <p className="p-6 text-sm text-ink-500">No pass requests yet.</p>}
        </div>
      </div>

      {showNew && (
        <NewRequestModal onClose={() => setShowNew(false)} onCreated={(p) => setPasses((prev) => [p, ...prev])} />
      )}

      {viewing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-lg font-bold text-ink-900">{viewing.type}</p>
              <button onClick={() => setViewing(null)}><X className="h-5 w-5 text-ink-500" /></button>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-ink-500">Departure</dt><dd>{fmt(viewing.departure)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-500">Return</dt><dd>{fmt(viewing.return)}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-500">Status</dt><dd>{viewing.status}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-500">Reason</dt><dd>{viewing.reason || "—"}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-500">Mentor</dt><dd>{viewing.approvals.mentor}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-500">Security</dt><dd>{viewing.approvals.security}</dd></div>
              <div className="flex justify-between"><dt className="text-ink-500">Warden</dt><dd>{viewing.approvals.warden}</dd></div>
            </dl>

            {viewing.status === "Approved" && (
              <div className="mt-5 flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                    JSON.stringify({ passId: viewing.id, student: user?.regNo, type: viewing.type, departure: viewing.departure, return: viewing.return })
                  )}`}
                  alt="Gate pass QR code"
                  className="h-40 w-40"
                />
                <p className="text-xs text-ink-500">Show this QR code at the gate</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
