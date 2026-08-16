import React from "react";
import { FileText, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../lib/auth";

const NAV_LABEL = {
  student: "My Passes",
  faculty: "Mentor Approvals",
  warden: "Warden Approvals"
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-brand-100 bg-white px-5 py-6">
      <div className="mb-8 flex items-center gap-2.5">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-700 font-display text-base font-extrabold italic text-white shadow-sm">
          S
        </div>
        <div>
          <p className="font-display text-sm font-bold leading-tight tracking-wide text-brand-900">SSN</p>
          <p className="text-xs leading-tight text-ink-500">Gatepass</p>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-brand-100 bg-brand-50 p-3">
        <p className="text-sm font-semibold text-ink-900">{user?.name}</p>
        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-brand-500/15 px-2 py-0.5 text-[11px] font-medium capitalize text-brand-700">
          <ShieldCheck className="h-3 w-3" /> {user?.role}
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        <a className="flex items-center gap-2.5 rounded-lg border-l-2 border-gold-500 bg-brand-50 px-3 py-2.5 text-sm font-medium text-brand-700">
          <FileText className="h-4 w-4" /> {NAV_LABEL[user?.role] || "My Passes"}
        </a>
      </nav>

      <button onClick={logout} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-500 hover:bg-gray-100">
        <LogOut className="h-4 w-4" /> Logout
      </button>
    </aside>
  );
}
