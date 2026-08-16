import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-6">
      <Link to="/" className="mb-4 flex items-center gap-1.5 text-xs text-stone-500 hover:text-wine-600">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to dashboard
      </Link>
      <div className="flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-wine-50 text-wine-600">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-stone-900">{title}</h1>
          {subtitle && <p className="text-sm text-stone-500">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
