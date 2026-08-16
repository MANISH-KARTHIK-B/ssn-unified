import React, { useEffect, useState } from "react";
import { CreditCard, BedDouble, UserCircle2 } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import SectionHeader from "../components/SectionHeader";

export default function Profile() {
  const { user } = useAuth();
  const [hostel, setHostel] = useState(null);

  useEffect(() => {
    api.get("/api/erp/hostel").then((res) => setHostel(res.data)).catch(() => setHostel(null));
  }, []);

  const rows = [
    ["Register No.", user?.regNo],
    ["Digital ID", user?.digitalId],
    ["Department", user?.department],
    ["Batch / Section", user ? `${user.batch} · ${user.section}` : "—"],
    ["Email", user?.email],
    ["CGPA", user?.cgpa]
  ];

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <SectionHeader icon={CreditCard} title="Profile" subtitle="Your personal and academic identity" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <div className="rounded-2xl border border-wine-100 bg-white p-6 text-center">
          <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-wine-50 text-wine-400">
            <UserCircle2 className="h-14 w-14" />
          </div>
          <p className="mt-3 font-display font-semibold text-stone-900">{user?.name}</p>
          <p className="text-xs text-stone-500">{user?.program}</p>
        </div>

        <div className="rounded-2xl border border-wine-100 bg-white p-6">
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {rows.map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-stone-100 pb-2">
                <dt className="text-sm text-stone-500">{k}</dt>
                <dd className="text-sm font-medium text-stone-800">{v || "—"}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {hostel && (
        <div className="mt-6 rounded-2xl border border-wine-100 bg-white p-6">
          <p className="mb-4 flex items-center gap-2 font-display text-sm font-bold text-stone-900">
            <BedDouble className="h-4 w-4 text-wine-600" /> Hostel & Room Allocation
          </p>
          <dl className="grid grid-cols-3 gap-4 text-sm">
            <div><dt className="text-stone-500">Block</dt><dd className="font-medium text-stone-800">{hostel.block}</dd></div>
            <div><dt className="text-stone-500">Room</dt><dd className="font-medium text-stone-800">{hostel.room}</dd></div>
            <div><dt className="text-stone-500">Type</dt><dd className="font-medium text-stone-800">{hostel.roomType}</dd></div>
          </dl>
        </div>
      )}
    </main>
  );
}
