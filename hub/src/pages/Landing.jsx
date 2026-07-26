import React from "react";
import { Link } from "react-router-dom";
import { Bus, ClipboardCheck, UtensilsCrossed, CalendarClock, CalendarRange, ArrowRight } from "lucide-react";
import ServiceTile from "../components/ServiceTile";
import ProfileWidget from "../components/ProfileWidget";
import { SATELLITES } from "../lib/satellites";
import { useAuth } from "../lib/auth";

const EVENTS = [
  { title: "Semester 4 CAT-II begins", date: "10 Aug 2026", tag: "Exams" },
  { title: "Design Thinking studio review", date: "03 Aug 2026", tag: "Academics" },
  { title: "Inter-department tech symposium", date: "30 Jul 2026", tag: "Campus" },
  { title: "Hostel mess committee meeting", date: "28 Jul 2026", tag: "Hostel" }
];

const NATIVE_FEATURES = [
  {
    to: "/bus-tracker",
    icon: Bus,
    title: "Bus Tracker",
    desc: "Live campus bus positions, routes and ETAs",
    accent: "#2563EB"
  },
  {
    to: "/attendance",
    icon: ClipboardCheck,
    title: "Attendance Monitor",
    desc: "Subject-wise attendance with a what-if calculator",
    accent: "#16A34A"
  },
  {
    to: "/mess",
    icon: UtensilsCrossed,
    title: "Mess",
    desc: "Weekly menu and per-meal feedback",
    accent: "#DB2777"
  },
  {
    to: "/mentors",
    icon: CalendarClock,
    title: "Mentor Booking",
    desc: "Book a slot with your mentor",
    accent: "#D97706"
  },
  {
    to: "/events",
    icon: CalendarRange,
    title: "Event Catalog",
    desc: "Upcoming events at SSN and other colleges",
    accent: "#2563EB"
  }
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <p className="text-sm text-navy-500">Welcome back,</p>
        <h1 className="font-display text-3xl font-semibold text-white">{user?.name?.split(" ")[0] || "Student"}</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold text-white">College services</h2>
              <p className="text-xs text-navy-500">Each tile opens the service as its own site, in a new tab</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {SATELLITES.map((s) => (
                <ServiceTile key={s.id} service={s} />
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="mb-4 font-display text-xl font-semibold text-white">On this dashboard</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {NATIVE_FEATURES.map((f) => (
                <Link
                  key={f.to}
                  to={f.to}
                  className="group flex items-center gap-4 rounded-2xl border border-navy-800 bg-navy-900 p-5 transition hover:border-amber-500/60"
                >
                  <div
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
                    style={{ backgroundColor: `${f.accent}22`, color: f.accent }}
                  >
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{f.title}</p>
                    <p className="text-xs text-navy-400">{f.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-navy-600 transition group-hover:translate-x-0.5 group-hover:text-amber-500" />
                </Link>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <ProfileWidget />
          <div className="rounded-2xl border border-navy-800 bg-navy-900 p-5">
            <h3 className="mb-3 font-display text-base font-semibold text-white">Upcoming</h3>
            <ul className="space-y-3">
              {EVENTS.map((e) => (
                <li key={e.title} className="border-t border-navy-800 pt-3 first:border-0 first:pt-0">
                  <p className="text-sm font-medium text-navy-100">{e.title}</p>
                  <div className="mt-1 flex items-center justify-between text-xs text-navy-500">
                    <span>{e.date}</span>
                    <span className="rounded-full bg-navy-800 px-2 py-0.5 text-amber-400">{e.tag}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
