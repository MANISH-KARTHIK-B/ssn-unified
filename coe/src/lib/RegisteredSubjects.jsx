import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { useFaculty } from "../lib/facultyContext";
import FacultyBar from "../components/FacultyBar";

export default function RegisteredSubjects() {
  const { user } = useAuth();
  const isFaculty = user?.role === "faculty";
  const { selectedStudentId } = useFaculty();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (isFaculty) {
      if (!selectedStudentId) {
        setData(null);
        return;
      }
      api.get(`/api/faculty/coe/registered-subjects/${selectedStudentId}`).then((res) => setData(res.data));
    } else {
      api.get("/api/coe/registered-subjects").then((res) => setData(res.data));
    }
  }, [isFaculty, selectedStudentId]);

  async function toggleFee(subject, current) {
    const res = await api.put(`/api/faculty/coe/registered-subjects/${selectedStudentId}`, {
      subject,
      feeStatus: current === "Paid" ? "Due" : "Paid"
    });
    setData(res.data);
  }

  const totalFees = data?.subjects.reduce((sum, s) => sum + s.examFee, 0) || 0;
  const dueFees = data?.subjects.filter((s) => s.feeStatus === "Due").reduce((sum, s) => sum + s.examFee, 0) || 0;

  return (
    <div className="px-8 py-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-slate-900">Registered Subjects & Exam Fees Details</h1>
      {isFaculty && <FacultyBar label="viewing registered subjects" />}

      {isFaculty && !selectedStudentId ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-500">
          Select a student above to view their registered subjects.
        </div>
      ) : (
        <>
          {data && (
            <div className="mb-4 flex gap-4">
              <div className="rounded-xl border border-slate-200 bg-white px-5 py-3">
                <p className="text-xs text-slate-500">Total exam fees</p>
                <p className="font-display text-xl font-bold text-slate-900">₹{totalFees}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white px-5 py-3">
                <p className="text-xs text-slate-500">Due</p>
                <p className="font-display text-xl font-bold text-amber-600">₹{dueFees}</p>
              </div>
            </div>
          )}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3">Code</th>
                  <th className="px-6 py-3">Credits</th>
                  <th className="px-6 py-3">Exam Fee</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.subjects.map((s) => (
                  <tr key={s.subject} className="border-b border-slate-50 last:border-0">
                    <td className="px-6 py-4 font-medium text-slate-800">{s.subject}</td>
                    <td className="px-6 py-4 text-slate-600">{s.code}</td>
                    <td className="px-6 py-4 text-slate-600">{s.credits}</td>
                    <td className="px-6 py-4 text-slate-600">₹{s.examFee}</td>
                    <td className="px-6 py-4">
                      {isFaculty ? (
                        <button
                          onClick={() => toggleFee(s.subject, s.feeStatus)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${s.feeStatus === "Paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                        >
                          {s.feeStatus}
                        </button>
                      ) : (
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${s.feeStatus === "Paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                          {s.feeStatus}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!data && <p className="p-6 text-sm text-slate-500">Loading…</p>}
          </div>
        </>
      )}
    </div>
  );
}
