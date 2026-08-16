import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { useFaculty } from "../lib/facultyContext";
import FacultyBar from "../components/FacultyBar";

const STEPS = ["Requested", "Under Review", "Completed"];

export default function PhotocopyRevaluation({ type }) {
  const { user } = useAuth();
  const isFaculty = user?.role === "faculty";
  const { selectedStudentId } = useFaculty();
  const [requests, setRequests] = useState([]);
  const [subject, setSubject] = useState("Electronic Circuits");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isFaculty) {
      const params = selectedStudentId ? `?studentId=${selectedStudentId}` : "";
      api.get(`/api/faculty/coe/photocopy-requests${params}`).then((res) => setRequests(res.data.filter((r) => r.type === type)));
    } else {
      api.get("/api/coe/photocopy-requests").then((res) => setRequests(res.data.filter((r) => r.type === type)));
    }
  }, [isFaculty, selectedStudentId, type]);

  async function submitRequest() {
    setBusy(true);
    try {
      const res = await api.post("/api/coe/photocopy-requests", { type, subject });
      setRequests((prev) => [res.data, ...prev]);
    } finally {
      setBusy(false);
    }
  }

  async function advance(id, currentStatus) {
    const idx = STEPS.indexOf(currentStatus);
    const nextStatus = STEPS[Math.min(idx + 1, STEPS.length - 1)];
    const res = await api.post(`/api/faculty/coe/photocopy-requests/${id}/status`, { status: nextStatus });
    setRequests((prev) => prev.map((r) => (r.id === id ? res.data : r)));
  }

  return (
    <div className="px-8 py-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-slate-900">{type} Request</h1>
      {isFaculty && <FacultyBar label={`viewing ${type.toLowerCase()} requests`} includeAllOption />}

      {!isFaculty && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4">
          <select value={subject} onChange={(e) => setSubject(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option>Electronic Circuits</option>
            <option>OOPS and Data Structures</option>
            <option>Signals and Systems</option>
          </select>
          <button onClick={submitRequest} disabled={busy} className="flex items-center gap-2 rounded-lg bg-cobalt-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cobalt-600 disabled:opacity-60">
            <Plus className="h-4 w-4" /> {busy ? "Submitting…" : `Request ${type.toLowerCase()}`}
          </button>
        </div>
      )}

      <div className="space-y-4">
        {requests.map((r) => {
          const stepIndex = STEPS.indexOf(r.status) === -1 ? 0 : STEPS.indexOf(r.status);
          return (
            <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="font-medium text-slate-900">{r.subject}</p>
                <span className="text-xs text-slate-500">Requested {r.requestedOn}</span>
              </div>
              <div className="flex items-center">
                {STEPS.map((s, i) => (
                  <React.Fragment key={s}>
                    <div className="flex flex-col items-center">
                      <div className={`grid h-6 w-6 place-items-center rounded-full text-[10px] font-bold ${i <= stepIndex ? "bg-cobalt-500 text-white" : "bg-slate-200 text-slate-500"}`}>{i + 1}</div>
                      <p className="mt-1 w-20 text-center text-[10px] text-slate-500">{s}</p>
                    </div>
                    {i < STEPS.length - 1 && <div className={`h-0.5 flex-1 ${i < stepIndex ? "bg-cobalt-500" : "bg-slate-200"}`} />}
                  </React.Fragment>
                ))}
              </div>
              {isFaculty && r.status !== "Completed" && (
                <button onClick={() => advance(r.id, r.status)} className="mt-4 rounded-lg border border-cobalt-500 px-3 py-1.5 text-xs font-medium text-cobalt-500 hover:bg-cobalt-50">
                  Advance to next stage
                </button>
              )}
            </div>
          );
        })}
        {requests.length === 0 && <p className="text-sm text-slate-500">No {type.toLowerCase()} requests yet.</p>}
      </div>
    </div>
  );
}
