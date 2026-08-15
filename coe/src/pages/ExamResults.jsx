import React, { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { useFaculty } from "../lib/facultyContext";
import FacultyBar from "../components/FacultyBar";

const GRADES = ["O", "A+", "A", "B+", "B", "C", "U"];

export default function ExamResults() {
  const { user } = useAuth();
  const isFaculty = user?.role === "faculty";
  const { selectedStudentId } = useFaculty();
  const [data, setData] = useState(null);
  const [semIndex, setSemIndex] = useState(0);
  const [drafts, setDrafts] = useState({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isFaculty) {
      if (!selectedStudentId) {
        setData(null);
        return;
      }
      api.get(`/api/faculty/coe/results/${selectedStudentId}`).then((res) => {
        setData(res.data);
        setSemIndex(0);
      });
    } else {
      api.get("/api/coe/results").then((res) => setData(res.data));
    }
  }, [isFaculty, selectedStudentId]);

  const sem = data?.semesters?.[semIndex];

  async function saveGrade(subject) {
    setBusy(true);
    try {
      const res = await api.put(`/api/faculty/coe/results/${selectedStudentId}`, {
        semester: sem.semester,
        subject,
        grade: drafts[subject]
      });
      setData(res.data);
    } finally {
      setBusy(false);
    }
  }

  async function saveGpa(field, value) {
    setBusy(true);
    try {
      const payload = { semester: sem.semester, [field]: value };
      const res = await api.put(`/api/faculty/coe/results/${selectedStudentId}`, payload);
      setData(res.data);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-slate-900">Exam Results</h1>
        {data && (
          <select value={semIndex} onChange={(e) => setSemIndex(Number(e.target.value))} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            {data.semesters.map((s, i) => (
              <option key={s.semester} value={i}>{s.semester}</option>
            ))}
          </select>
        )}
      </div>

      {isFaculty && <FacultyBar label="editing exam results" />}

      {isFaculty && !selectedStudentId ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-500">
          Select a student above to view or edit their exam results.
        </div>
      ) : (
        sem && (
          <>
            <div className="mb-4 flex gap-4">
              <div className="rounded-xl border border-slate-200 bg-white px-5 py-3">
                <p className="text-xs text-slate-500">SGPA</p>
                {isFaculty ? (
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={sem.sgpa}
                    onBlur={(e) => saveGpa("sgpa", e.target.value)}
                    className="w-20 rounded-md border border-slate-200 px-2 py-1 font-display text-lg font-bold text-slate-900"
                  />
                ) : (
                  <p className="font-display text-2xl font-bold text-slate-900">{sem.sgpa}</p>
                )}
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-5 py-3">
                <p className="text-xs text-slate-500">CGPA</p>
                {isFaculty ? (
                  <input
                    type="number"
                    step="0.01"
                    defaultValue={data.cgpa}
                    onBlur={(e) => saveGpa("cgpa", e.target.value)}
                    className="w-20 rounded-md border border-slate-200 px-2 py-1 font-display text-lg font-bold text-slate-900"
                  />
                ) : (
                  <p className="font-display text-2xl font-bold text-slate-900">{data.cgpa}</p>
                )}
              </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-6 py-3">Subject</th>
                    <th className="px-6 py-3">Grade</th>
                    {isFaculty && <th className="px-6 py-3"></th>}
                  </tr>
                </thead>
                <tbody>
                  {sem.subjects.map((s) => (
                    <tr key={s.subject} className="border-b border-slate-50 last:border-0">
                      <td className="px-6 py-4 text-slate-800">{s.subject}</td>
                      <td className="px-6 py-4 font-semibold text-cobalt-600">
                        {isFaculty ? (
                          <select
                            defaultValue={s.grade}
                            onChange={(e) => setDrafts((prev) => ({ ...prev, [s.subject]: e.target.value }))}
                            className="rounded-md border border-slate-200 px-2 py-1 text-sm"
                          >
                            {GRADES.map((g) => <option key={g}>{g}</option>)}
                          </select>
                        ) : (
                          s.grade
                        )}
                      </td>
                      {isFaculty && (
                        <td className="px-6 py-4">
                          <button onClick={() => saveGrade(s.subject)} disabled={busy} className="flex items-center gap-1.5 rounded-md bg-cobalt-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-cobalt-600 disabled:opacity-60">
                            <Save className="h-3 w-3" /> Save
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )
      )}
    </div>
  );
}
