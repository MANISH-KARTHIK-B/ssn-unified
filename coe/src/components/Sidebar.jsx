import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  User, Upload, FileCheck2, BookMarked, Award, Bell, ClipboardList,
  GraduationCap, ChevronDown, Settings, KeyRound, LogOut
} from "lucide-react";
import { useAuth } from "../lib/auth";

const NAV = [
  { to: "/", label: "Profile", icon: User, end: true },
  { to: "/upload-photo", label: "Upload Your Photo", icon: Upload },
  { to: "/verify-gradesheet", label: "Verify Gradesheet", icon: FileCheck2 },
  { to: "/registered-subjects", label: "Registered Subjects & Exam Fees Details", icon: BookMarked },
  { to: "/cat-marks", label: "CAT Marks", icon: Award },
  { to: "/final-internal-marks", label: "Final Internal Marks", icon: Bell },
  { to: "/exam-timetable", label: "Exam Timetable & Seating", icon: ClipboardList }
];

const RESULTS_SUB = [
  { to: "/exam-results", label: "Semester Results" },
  { to: "/academic-report", label: "Academic Report" }
];

const REVAL_SUB = [
  { to: "/photocopy", label: "Photocopy Request" },
  { to: "/revaluation", label: "Revaluation Request" }
];

function Expandable({ label, icon: Icon, items }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800"
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="flex-1 text-left">{label}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="ml-6 space-y-0.5 border-l border-slate-800 pl-3">
          {items.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              className={({ isActive }) =>
                `block rounded-md px-2 py-1.5 text-xs ${isActive ? "text-cobalt-400" : "text-slate-400 hover:text-slate-200"}`
              }
            >
              {it.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const isFaculty = user?.role === "faculty";

  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col overflow-y-auto border-r border-slate-800 bg-slate-900 px-4 py-6">
      <p className="mb-6 px-2 font-display text-lg font-bold text-white">SSN - COE</p>

      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="grid h-11 w-11 place-items-center rounded-full bg-slate-700 text-sm font-semibold text-white">
          {(user?.name || "?").split(" ").map((p) => p[0]).slice(0, 2).join("")}
        </div>
        <div>
          <p className="text-sm font-medium text-white">{user?.name}</p>
          {isFaculty ? (
            <p className="text-xs text-cobalt-400">Faculty · {user?.department}</p>
          ) : (
            <>
              <p className="text-xs text-slate-400">{user?.regNo}</p>
              <p className="text-xs text-slate-500">{user?.program}</p>
            </>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-0.5">
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            className={({ isActive }) =>
              `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm ${isActive ? "bg-cobalt-500 text-white" : "text-slate-300 hover:bg-slate-800"}`
            }
          >
            <n.icon className="h-4 w-4 shrink-0" />
            <span>{n.label}</span>
          </NavLink>
        ))}
        <Expandable label="Exam Results" icon={GraduationCap} items={RESULTS_SUB} />
        <Expandable label="Photocopy & Revaluation" icon={Settings} items={REVAL_SUB} />
        <NavLink to="/change-password" className={({ isActive }) => `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm ${isActive ? "bg-cobalt-500 text-white" : "text-slate-300 hover:bg-slate-800"}`}>
          <KeyRound className="h-4 w-4" /> Change Password
        </NavLink>
      </nav>

      <button onClick={logout} className="mt-4 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-red-300 hover:bg-slate-800">
        <LogOut className="h-4 w-4" /> Logout
      </button>
    </aside>
  );
}
