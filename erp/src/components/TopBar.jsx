import React from "react";
import { Link } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../lib/auth";

export default function TopBar() {
  const { user, logout } = useAuth();
  return (
    <header className="border-b border-wine-100 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-wine-600 font-display text-sm font-bold text-white">E</div>
          <div>
            <p className="font-display text-sm font-bold leading-tight text-stone-900">SSN ERP</p>
            <p className="text-xs leading-tight text-stone-500">{user?.name}</p>
          </div>
        </Link>
        <button onClick={logout} className="flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1.5 text-xs text-stone-600 hover:border-wine-400">
          <LogOut className="h-3.5 w-3.5" /> Logout
        </button>
      </div>
    </header>
  );
}
