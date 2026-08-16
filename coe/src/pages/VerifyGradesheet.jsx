import React, { useEffect, useState } from "react";
import { FileCheck2, CheckCircle2, Clock } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { useFaculty } from "../lib/facultyContext";
import FacultyBar from "../components/FacultyBar";

export default function VerifyGradesheet() {
  const { user } = useAuth();
  const isFaculty = user?.role === "faculty";
  const { selectedStudentId } = useFaculty();
  const [status, setStatus] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isFaculty) {
      if (!selectedStudentId) {
        setStatus(null);
        return;
      }
      api.get(`/api/faculty/coe/gradesheet-status/${selectedStudentId}`).then((res) => setStatus(res.data));
    } else {
      api.get("/api/coe/gradesheet-status").then((res) => setStatus(res.data));
    }
  }, [isFaculty, selectedStudentId]);

  async function toggle() {
    setBusy(true);
    try {
      const res = await api.post(`/api/faculty/coe/gradesheet-status/${selectedStudentId}/toggle`);
      setStatus(res.data);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="px-8 py-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-slate-900">Verify Gradesheet</h1>
      {isFaculty && <FacultyBar label="verifying gradesheet" />}

      {isFaculty && !selectedStudentId ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-500">
          Select a student above to view or verify their gradesheet.
        </div>
      ) : (
        status && (
          <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className={`grid h-12 w-12 place-items-center rounded-xl ${status.verified ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"}`}>
                {status.verified ? <CheckCircle2 className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
              </div>
              <div>
                <p className="font-medium text-slate-900">{status.verified ? "Gradesheet Verified" : "Verification Pending"}</p>
                <p className="text-xs text-slate-500">{status.verified ? `Verified on ${status.verifiedOn}` : "Awaiting COE verification"}</p>
              </div>
            </div>
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
              <FileCheck2 className="h-4 w-4 shrink-0" />
              Once verified, this gradesheet is considered official for placement and higher-education documentation.
            </div>
            {isFaculty && (
              <button
                onClick={toggle}
                disabled={busy}
                className={`w-full rounded-lg py-2.5 text-sm font-semibold text-white disabled:opacity-60 ${status.verified ? "bg-amber-600 hover:bg-amber-700" : "bg-green-600 hover:bg-green-700"}`}
              >
                {busy ? "Updating…" : status.verified ? "Mark as unverified" : "Verify gradesheet"}
              </button>
            )}
          </div>
        )
      )}
    </div>
  );
}
