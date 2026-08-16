import React, { useEffect, useMemo, useState } from "react";
import { Plus, Eye, X, CalendarClock, ArrowUpRight } from "lucide-react";
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
  Rejected: "bg-red-50 text-red-600",
  "Not Required": "bg-gray-100 text-gray-500"
};

function fmt(dt) {
  if (!dt) return "—";
  return new Date(dt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function fmtShort(dt) {
  if (!dt) return "—";
  return new Date(dt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
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
          <h1 className="font-display text-2xl font-bold text-brand-900">Pass Requests</h1>
          <p className="text-sm text-ink-500">{user?.name?.toUpperCase()} — {user?.regNo}</p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
        >
          <Plus className="h-4 w-4" /> New Request
        </button>
      </div>

      <div className="mb-6 flex w-fit items-center gap-4 rounded-2xl border border-brand-100 bg-white p-5">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
          <CalendarClock className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-ink-500">WDP this month</p>
          <p className="font-display text-3xl font-bold text-brand-900">{wdpThisMonth}</p>
        </div>
      </div>

      <p className="mb-3 font-display text-sm font-semibold text-ink-700">Request history</p>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {passes.map((p) => (
          <div key={p.id} className="relative flex overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm transition hover:shadow-md">
            {/* stub */}
            <div className="flex w-16 shrink-0 flex-col items-center justify-center gap-1 bg-brand-700 py-4 text-white">
              <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">{fmtShort(p.departure)}</span>
              <div className="h-6 w-px bg-white/25" />
              <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">{fmtShort(p.return)}</span>
            </div>
            {/* perforation */}
            <div className="relative w-0 border-l-2 border-dashed border-brand-100">
              <span className="absolute -top-2 -left-2 h-4 w-4 rounded-full bg-[#F4F7FC]" />
              <span className="absolute -bottom-2 -left-2 h-4 w-4 rounded-full bg-[#F4F7FC]" />
            </div>
            {/* body */}
            <div className="flex-1 p-4">
              <div className="mb-2 flex items-start justify-between gap-2">
                <p className="font-display text-sm font-bold text-ink-900">{p.type}</p>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[p.status]}`}>{p.status}</span>
              </div>
              {p.reason && <p className="mb-3 text-xs text-ink-500">{p.reason}</p>}
              <div className="mb-3 flex gap-1.5">
                {[["M", p.approvals.mentor], ["S", p.approvals.security], ["W", p.approvals.warden]].map(([k, v]) => (
                  <span key={k} className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${APPROVAL_STYLE[v]}`}>{k}: {v}</span>
                ))}
              </div>
              <button onClick={() => setViewing(p)} className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700">
                View pass <ArrowUpRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {!loading && passes.length === 0 && (
        <div className="rounded-2xl border border-dashed border-brand-100 bg-white p-10 text-center">
          <p className="text-sm text-ink-500">No pass requests yet. Tap "New Request" to apply for one.</p>
        </div>
      )}

      {showNew && (
        <NewRequestModal onClose={() => setShowNew(false)} onCreated={(p) => setPasses((prev) => [p, ...prev])} />
      )}

      {viewing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-brand-700 px-6 py-4">
              <p className="font-display text-lg font-bold text-white">{viewing.type}</p>
              <button onClick={() => setViewing(null)}><X className="h-5 w-5 text-white/80" /></button>
            </div>
            <div className="p-6">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-ink-500">Departure</dt><dd className="font-medium text-ink-900">{fmt(viewing.departure)}</dd></div>
                <div className="flex justify-between"><dt className="text-ink-500">Return</dt><dd className="font-medium text-ink-900">{fmt(viewing.return)}</dd></div>
                <div className="flex justify-between"><dt className="text-ink-500">Status</dt><dd className="font-medium text-ink-900">{viewing.status}</dd></div>
                <div className="flex justify-between"><dt className="text-ink-500">Reason</dt><dd className="font-medium text-ink-900">{viewing.reason || "—"}</dd></div>
                <div className="flex justify-between"><dt className="text-ink-500">Mentor</dt><dd className="font-medium text-ink-900">{viewing.approvals.mentor}</dd></div>
                <div className="flex justify-between"><dt className="text-ink-500">Security</dt><dd className="font-medium text-ink-900">{viewing.approvals.security}</dd></div>
                <div className="flex justify-between"><dt className="text-ink-500">Warden</dt><dd className="font-medium text-ink-900">{viewing.approvals.warden}</dd></div>
              </dl>
            </div>

            {viewing.status === "Approved" && (
              <>
                <div className="relative border-t-2 border-dashed border-brand-100">
                  <span className="absolute -top-2 -left-2 h-4 w-4 rounded-full bg-black/40" />
                  <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-black/40" />
                </div>
                <div className="flex flex-col items-center gap-2 bg-brand-50 p-6">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                      JSON.stringify({ passId: viewing.id, student: user?.regNo, type: viewing.type, departure: viewing.departure, return: viewing.return })
                    )}`}
                    alt="Gate pass QR code"
                    className="h-40 w-40 rounded-lg bg-white p-2 shadow-sm"
                  />
                  <p className="text-xs font-medium text-brand-700">Show this QR code at the gate</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
