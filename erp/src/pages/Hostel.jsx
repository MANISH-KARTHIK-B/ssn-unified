import React, { useEffect, useState } from "react";
import { BedDouble } from "lucide-react";
import { api } from "../lib/api";

// Note: this module is generic/mock and should be revisited once real ERP hostel
// reference screenshots are provided by the college's existing system.
export default function Hostel() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/api/erp/hostel").then((res) => setData(res.data));
  }, []);

  return (
    <div className="px-8 py-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-stone-900">Hostel & Room Allocation</h1>
      {data ? (
        <div className="max-w-md rounded-2xl border border-wine-100 bg-white p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-wine-50 text-wine-600"><BedDouble className="h-5 w-5" /></div>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">{data.status}</span>
          </div>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-2"><dt className="text-stone-500">Block</dt><dd className="font-medium">{data.block}</dd></div>
            <div className="flex justify-between border-b border-gray-100 pb-2"><dt className="text-stone-500">Room</dt><dd className="font-medium">{data.room}</dd></div>
            <div className="flex justify-between"><dt className="text-stone-500">Room type</dt><dd className="font-medium">{data.roomType}</dd></div>
          </dl>
        </div>
      ) : (
        <p className="text-sm text-stone-500">Loading…</p>
      )}
    </div>
  );
}
