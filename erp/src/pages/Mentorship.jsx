import React, { useEffect, useState } from "react";
import { Network, ExternalLink } from "lucide-react";
import { api, HUB_URL } from "../lib/api";
import SectionHeader from "../components/SectionHeader";

const STATUS_STYLE = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-stone-100 text-stone-500"
};

export default function Mentorship() {
  const [mentors, setMentors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    api.get("/api/hub/mentors").then((res) => setMentors(res.data));
    api.get("/api/hub/appointments").then((res) => setAppointments(res.data));
  }, []);

  const mentor = mentors[0];

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <SectionHeader icon={Network} title="Mentorship" subtitle="Your assigned mentor and appointment history" />

      {mentor && (
        <div className="mb-6 rounded-2xl border border-wine-100 bg-white p-6">
          <p className="mb-1 text-xs uppercase tracking-wide text-stone-500">Assigned Mentor</p>
          <p className="font-display text-lg font-bold text-stone-900">{mentor.name}</p>
          <p className="text-sm text-stone-500">{mentor.department}</p>
        </div>
      )}

      <div className="rounded-2xl border border-wine-100 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="font-display text-sm font-bold text-stone-900">Your appointments</p>
          
            href={`${HUB_URL}/mentors`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-lg bg-wine-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-wine-700"
          >
            Book a slot <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div className="space-y-3">
          {appointments.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-xl border border-stone-100 p-3">
              <div>
                <p className="text-sm text-stone-800">{a.slot}</p>
                {a.reply && <p className="mt-1 text-xs text-stone-500">"{a.reply}"</p>}
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[a.status] || "bg-stone-100 text-stone-500"}`}>{a.status}</span>
            </div>
          ))}
          {appointments.length === 0 && <p className="text-sm text-stone-500">No appointments yet, book a slot with your mentor above.</p>}
        </div>
      </div>
    </main>
  );
}
