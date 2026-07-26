import React from "react";
import { NavLink } from "react-router-dom";
import { Wallet, FileStack, BedDouble, LogOut } from "lucide-react";
import { useAuth } from "../lib/auth";

const NAV = [
  { to: "/", label: "Fees", icon: Wallet, end: true },
  { to: "/documents", label: "Document Requests", icon: FileStack },
  { to: "/hostel", label: "Hostel & Room", icon: BedDouble }
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-wine-100 bg-white px-5 py-6">
      <div className="mb-8 flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-wine-600 font-display text-sm font-bold text-white">E</div>
        <div>
          <p className="font-display text-sm font-bold leading-tight text-stone-900">SSN</p>
          <p className="text-xs leading-tight text-stone-500">ERP</p>
        </div>
      </div>
      <div className="mb-6 rounded-xl bg-wine-50 p-3">
        <p className="text-sm font-semibold text-stone-900">{user?.name}</p>
        <p className="text-xs text-stone-500">{user?.regNo}</p>
      </div>
      <nav className="flex-1 space-y-1">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => `flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm ${isActive ? "bg-wine-600 text-white" : "text-stone-700 hover:bg-wine-50"}`}>
            <n.icon className="h-4 w-4" /> {n.label}
          </NavLink>
        ))}
      </nav>
      <button onClick={logout} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-stone-500 hover:bg-gray-100">
        <LogOut className="h-4 w-4" /> Logout
      </button>
    </aside>
  );
}
