import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { useFaculty } from "../lib/facultyContext";
import FacultyBar from "../components/FacultyBar";

export default function InternalMarks() {
  const { user } = useAuth();
  const isFaculty = user?.role === "faculty";
  const { selectedStudentId } = useFaculty();
  const [data, setData] = useState(null);
  const [savingSubject, setSavingSubject] = useState(null);
  const [drafts, setDrafts] = useState({});

  useEffect(() => {
    if (isFaculty) {
      if (!selectedStudentId) {
        setData(null);
        return;
      }
      api.get(`/api/faculty/coe/internal-marks/${selectedStudentId}`).then((res) => setData(res.data));
    } else {
      api.get("/api/coe/internal-marks").then((res) => setData(res.data));
    }
  }, [isFaculty, selectedStudentId]);

  async function save(subject) {
    setSavingSubject(subject);
    try {
      const res = await api.put(`/api/faculty/coe/internal-marks/${selectedStudentId}`, {
        subject,
        internal: drafts[subject]
      });
      setData(res.data);
    } finally {
      setSavingSubject(null);
    }
  }

  return (
    <div className="px-8 py-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-slate-900">Final Internal Marks</h1>
      {isFaculty && <FacultyBar label="editing final internal marks" />}

      {isFaculty && !selectedStudentId ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-500">
          Select a student above to view or edit their internal marks.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3">Subject</th>
                <th className="px-6 py-3">Internal Marks</th>
                <th className="px-6 py-3">Max</th>
                {isFaculty && <th className="px-6 py-3"></th>}
              </tr>
            </thead>
            <tbody>
              {data?.subjects.map((s) => (
                <tr key={s.subject} className="border-b border-slate-50 last:border-0">
                  <td className="px-6 py-4 font-medium text-slate-800">{s.subject}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {isFaculty ? (
                      <input
                        type="number"
                        defaultValue={s.internal}
                        onChange={(e) => setDrafts((prev) => ({ ...prev, [s.subject]: e.target.value }))}
                        className="w-16 rounded-md border border-slate-200 px-2 py-1 text-sm"
                      />
                    ) : (
                      s.internal
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{s.max}</td>
                  {isFaculty && (
                    <td className="px-6 py-4">
                      <button
                        onClick={() => save(s.subject)}
                        disabled={savingSubject === s.subject}
                        className="flex items-center gap-1.5 rounded-md bg-cobalt-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-cobalt-600 disabled:opacity-60"
                      >
                        <Save className="h-3 w-3" /> {savingSubject === s.subject ? "Saving…" : "Save"}
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {!data && <p className="p-6 text-sm text-slate-500">Loading…</p>}
        </div>
      )}
    </div>
  );
}
