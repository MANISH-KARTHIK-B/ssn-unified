import React from "react";
import { UserCircle2 } from "lucide-react";
import { useAuth } from "../lib/auth";

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;

  const rows = [
    ["Full Name", user.name],
    ["Digital ID", user.digitalId],
    ["DOB", user.dob],
    ["Gender", user.gender],
    ["Email", user.email],
    ["Govt ID No", user.govtIdNo],
    ["Department", user.department],
    ["Batch", user.batch],
    ["Section", user.section],
    ["Regulation", user.regulation]
  ];

  return (
    <div className="px-8 py-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-slate-900">Profile</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
          <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-slate-100 text-slate-400">
            <UserCircle2 className="h-16 w-16" />
          </div>
          <p className="mt-4 font-display text-lg font-semibold text-slate-900">{user.name}</p>
          <p className="text-sm text-slate-500">{user.regNo}</p>
          <p className="mt-1 text-xs text-slate-400">{user.program}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
            {rows.map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-slate-100 pb-2">
                <dt className="text-sm text-slate-500">{k}</dt>
                <dd className="text-sm font-medium text-slate-800">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
