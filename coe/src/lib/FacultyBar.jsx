import React from "react";
import { GraduationCap } from "lucide-react";
import { useFaculty } from "../lib/facultyContext";
import StudentPicker from "./StudentPicker";

export default function FacultyBar({ label }) {
  const { selectedStudentId, setSelectedStudentId } = useFaculty();
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-cobalt-500/30 bg-cobalt-500/5 px-4 py-3">
      <div className="flex items-center gap-2 text-sm text-cobalt-300">
        <GraduationCap className="h-4 w-4" />
        Faculty mode — {label}
      </div>
      <StudentPicker value={selectedStudentId} onChange={setSelectedStudentId} />
    </div>
  );
}
