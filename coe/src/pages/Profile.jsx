import React, { useEffect, useState } from "react";
import { UserCircle2 } from "lucide-react";
import { useAuth } from "../lib/auth";
import { useFaculty } from "../lib/facultyContext";
import { api } from "../lib/api";
import FacultyBar from "../components/FacultyBar"; 
 
function ProfileCard({ person }) {
  const rows = [
    ["Full Name", person.name],
    ["Digital ID", person.digitalId], 
    ["DOB", person.dob],
    ["Gender", person.gender],
    ["Email", person.email],
    ["Govt ID No", person.govtIdNo],
    ["Department", person.department],
    ["Batch", person.batch],
    ["Section", person.section],
    ["Regulation", person.regulation] 
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-slate-100 text-slate-400">
          <UserCircle2 className="h-16 w-16" />
        </div>
        <p className="mt-4 font-display text-lg font-semibold text-slate-900">{person.name}</p>
        <p className="text-sm text-slate-500">{person.regNo}</p>
        <p className="mt-1 text-xs text-slate-400">{person.program}</p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          {rows.map(([k, v]) => (
            <div key={k} className="flex justify-between border-b border-slate-100 pb-2">
              <dt className="text-sm text-slate-500">{k}</dt>
              <dd className="text-sm font-medium text-slate-800">{v || "—"}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const isFaculty = user?.role === "faculty";
  const { selectedStudentId } = useFaculty();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (isFaculty && selectedStudentId) {
      api.get(`/api/faculty/students/${selectedStudentId}`).then((res) => setStudent(res.data));
    } else {
      setStudent(null);
    }
  }, [isFaculty, selectedStudentId]);

  if (isFaculty) {
    return (
      <div className="px-8 py-8">
        <h1 className="mb-6 font-display text-2xl font-bold text-slate-900">Student Profile</h1>
        <FacultyBar label="viewing student profile" />
        {!selectedStudentId && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center text-sm text-slate-500">
            Select a student above to view their profile.
          </div>
        )}
        {selectedStudentId && !student && <p className="text-sm text-slate-500">Loading…</p>}
        {student && <ProfileCard person={student} />}
      </div>
    );
  }

  if (!user) return null;
  return (
    <div className="px-8 py-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-slate-900">Profile</h1>
      <ProfileCard person={user} />
    </div>
  );
}
