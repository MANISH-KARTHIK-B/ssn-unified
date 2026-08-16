import React from "react";
import { Link } from "react-router-dom";
import { CreditCard, Network, IndianRupee, Landmark, Mail } from "lucide-react";

const TILES = [
  { to: "/profile", label: "Profile", icon: CreditCard },
  { to: "/mentorship", label: "Mentorship", icon: Network },
  { to: "/fee-payment", label: "Fee Payment", icon: IndianRupee },
  { to: "/academic", label: "Academic", icon: Landmark },
  { to: "/grievance", label: "Grievance", icon: Mail }
];

export default function Dashboard() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-1 font-display text-2xl font-bold text-stone-900">Welcome to SSN ERP</h1>
      <p className="mb-8 text-sm text-stone-500">Everything academic and administrative, in one place.</p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {TILES.map((t) => (
          <Link
            key={t.to}
            to={t.to}
            className="flex flex-col items-center gap-3 rounded-2xl bg-wine-600 px-4 py-6 text-center text-white transition hover:bg-wine-700 hover:-translate-y-0.5"
          >
            <t.icon className="h-9 w-9" strokeWidth={1.5} />
            <span className="text-sm font-semibold">{t.label}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
