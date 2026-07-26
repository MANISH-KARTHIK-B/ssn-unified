import React from "react";
import { useAuth } from "../lib/auth";

export default function ProfileWidget() {
  const { user } = useAuth();
  if (!user) return null;

  const rows = [
    ["Register No.", user.regNo || "—"],
    ["Department", user.department || "—"],
    ["Batch / Section", user.batch ? `${user.batch} · ${user.section}` : "—"],
    ["CGPA", user.cgpa || "—"]
  ];

  return (
    <div className="rounded-2xl border border-navy-800 bg-navy-900 p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-navy-700 font-display text-xl font-semibold text-white">
          {(user.name || "?").split(" ").map((p) => p[0]).slice(0, 2).join("")}
        </div>
        <div>
          <p className="font-display text-base font-semibold text-white">{user.name}</p>
          <p className="text-xs text-navy-400">{user.program}</p>
        </div>
      </div>
      <dl className="mt-4 space-y-2 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between border-t border-navy-800 pt-2 first:border-0 first:pt-0">
            <dt className="text-navy-500">{k}</dt>
            <dd className="font-medium text-navy-200">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
