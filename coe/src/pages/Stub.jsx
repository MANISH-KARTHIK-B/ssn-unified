import React from "react";
import { Construction } from "lucide-react";

export default function Stub({ title, note }) {
  return (
    <div className="px-8 py-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-slate-900">{title}</h1>
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
        <Construction className="mb-3 h-8 w-8 text-slate-300" />
        <p className="text-sm font-medium text-slate-600">This section is a placeholder in the prototype</p>
        <p className="mt-1 max-w-sm text-xs text-slate-400">{note || "Wire this page to the COE backend endpoint for this feature when ready."}</p>
      </div>
    </div>
  );
}
