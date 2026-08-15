import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { api } from "../lib/api";

export default function StudentPicker({ value, onChange, includeAllOption = false }) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    api.get("/api/faculty/students").then((res) => setStudents(res.data));
  }, []);

  return (
    <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2">
      <Users className="h-4 w-4 text-slate-400" />
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-sm text-white outline-none"
      >
        <option value="" disabled={!includeAllOption}>
          {includeAllOption ? "All students" : "Select a student…"}
        </option>
        {students.map((s) => (
          <option key={s.id} value={s.id} className="bg-slate-900">
            {s.name} — {s.regNo}
          </option>
        ))}
      </select>
    </div>
  );
}
