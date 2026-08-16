import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Bell, MessageCircle, ChevronDown } from "lucide-react";
import { useAuth } from "../lib/auth";

export default function Nav() {
  const { user, logout } = useAuth();
  const isFaculty = user?.role === "faculty";

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-violet-500 font-display text-sm font-bold text-white">L</div>
          <span className="font-display text-lg font-bold text-graphite-900">SSN LMS</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-graphite-500 md:flex">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "text-violet-600" : "hover:text-graphite-900")}>
            {isFaculty ? "Faculty Dashboard" : "My courses"}
          </NavLink>
        </nav>
        <div className="ml-auto flex items-center gap-4">
          <button className="relative text-graphite-500 hover:text-graphite-900" aria-label="Notifications">
            <Bell className="h-5 w-5" />
            {!isFaculty && <span className="absolute -right-1.5 -top-1.5 grid h-4 w-4 place-items-center rounded-full bg-red-500 text-[10px] font-semibold text-white">1</span>}
          </button>
          <button className="text-graphite-500 hover:text-graphite-900" aria-label="Messages">
            <MessageCircle className="h-5 w-5" />
          </button>
          <button onClick={logout} className="flex items-center gap-1.5 rounded-full bg-violet-100 px-2.5 py-1 text-xs font-semibold text-violet-700">
            {(user?.name || "?").split(" ").map((p) => p[0]).slice(0, 2).join("")}
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
