import React, { useState } from "react";
import { Bell, Search, ChevronDown, LogOut, User } from "lucide-react";
import { useAuth } from "../lib/auth";
import { Link } from "react-router-dom";

export default function Nav() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-navy-800/60 bg-navy-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-3.5">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-amber-500 font-display text-lg font-bold text-navy-950">
            S
          </div>
          <span className="font-display text-lg font-semibold tracking-tight text-white">
            SSN Unified
          </span>
        </Link>

        <div className="relative ml-4 hidden max-w-md flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-600" />
          <input
            placeholder="Search services, courses, mentors…"
            className="w-full rounded-full border border-navy-700 bg-navy-900 py-2 pl-9 pr-4 text-sm text-white placeholder:text-navy-600 outline-none focus:border-amber-500"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button className="relative grid h-9 w-9 place-items-center rounded-full text-navy-300 hover:bg-navy-800" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-500" />
          </button>

          <div className="relative">
            <button
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-2 rounded-full border border-navy-700 bg-navy-900 py-1 pl-1 pr-2.5 text-sm text-white hover:border-amber-500"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-navy-700 text-xs font-semibold">
                {(user?.name || "?").split(" ").map((p) => p[0]).slice(0, 2).join("")}
              </span>
              <span className="hidden sm:block">{user?.name}</span>
              <ChevronDown className="h-4 w-4 text-navy-400" />
            </button>
            {open && (
              <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-navy-700 bg-navy-900 shadow-xl">
                <div className="border-b border-navy-800 px-4 py-3 text-xs text-navy-400">
                  {user?.regNo} · {user?.department}
                </div>
                <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-navy-200 hover:bg-navy-800">
                  <User className="h-4 w-4" /> View profile
                </button>
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-300 hover:bg-navy-800"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
