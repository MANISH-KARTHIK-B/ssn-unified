import React from "react";

const NOTICES = [
  "NPTEL Swayam 2026 (July-December) course registration is now open",
  "Central Library will remain open till 8:00 PM during exam week",
  "New arrivals in the Electronics and Communication section",
  "Overdue fine waiver week: 28 Jul – 02 Aug 2026"
];

export default function NoticeTicker() {
  const text = NOTICES.join("     •     ");
  return (
    <div className="overflow-hidden border-y border-ocean-100 bg-ocean-50 py-2">
      <div className="ticker-track flex w-max whitespace-nowrap text-sm font-medium text-ocean-700">
        <span className="px-4">{text}</span>
        <span className="px-4">{text}</span>
      </div>
    </div>
  );
}
