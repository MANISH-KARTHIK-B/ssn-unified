import React, { useState } from "react";
import {
  MonitorPlay, ShoppingCart, Archive, BookOpenCheck, GraduationCap, Search
} from "lucide-react";
import { api, HUB_URL } from "../lib/api";
import NoticeTicker from "../components/NoticeTicker";
import LoginPanel from "../components/LoginPanel";

const QUICK_LINKS = [
  { label: "E-Resources", icon: MonitorPlay },
  { label: "Purchase Suggestions", icon: ShoppingCart },
  { label: "Institutional Repository", icon: Archive },
  { label: "Syllabus", icon: BookOpenCheck },
  { label: "NPTEL", icon: GraduationCap }
];

export default function Opac({ onNavigateAccount }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState(null);
  const [busy, setBusy] = useState(false);

  async function search(e) {
    e.preventDefault();
    setBusy(true);
    const res = await api.get("/api/library/catalog", { params: { q } });
    setResults(res.data);
    setBusy(false);
  }

  return (
    <div>
      <div className="border-b border-ocean-100 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="font-display text-3xl font-black text-ocean-700">Central Library</p>
            <p className="text-xs uppercase tracking-widest text-ocean-500">Online Public Access Catalog</p>
          </div>
          <a href={HUB_URL} className="text-xs text-ocean-600 hover:underline">← Back to SSN Unified hub</a>
        </div>
        <div className="mx-auto grid max-w-6xl grid-cols-4 gap-1 px-6 pb-4 sm:grid-cols-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-16 rounded bg-gradient-to-br from-ocean-100 to-ocean-50" />
          ))}
        </div>
      </div>

      <nav className="border-b border-ocean-800 bg-ocean-900">
        <div className="mx-auto flex max-w-6xl gap-6 px-6 py-3 text-sm font-medium text-white/90">
          <a href="#">About us</a>
          <a href="#">Library Services</a>
          <a href="#">Rules/Regulations</a>
          <a href="#">Library Resources</a>
          <a href="#">Gallery</a>
          <a href="#">Contact us</a>
        </div>
      </nav>

      <NoticeTicker />

      <div className="mx-auto max-w-6xl px-6 py-6">
        <form onSubmit={search} className="mb-2 flex gap-2">
          <select className="rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm">
            <option>Library catalog</option>
          </select>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the catalog by keyword"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm"
          />
          <button className="flex items-center gap-1.5 rounded-lg bg-ocean-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ocean-700">
            <Search className="h-4 w-4" /> Search
          </button>
        </form>
        <div className="mb-6 flex gap-4 text-sm text-ocean-600">
          <a href="#" className="hover:underline">Advanced search</a> |
          <a href="#" className="hover:underline">Tag cloud</a> |
          <a href="#" className="hover:underline">Most popular</a> |
          <a href="#" className="hover:underline">Libraries</a>
        </div>

        {results && (
          <div className="mb-8 overflow-hidden rounded-xl border border-ocean-100 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ocean-100 bg-ocean-50 text-left text-xs uppercase tracking-wide text-ocean-600">
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Author</th>
                  <th className="px-4 py-3">Availability</th>
                </tr>
              </thead>
              <tbody>
                {results.map((b) => (
                  <tr key={b.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 font-medium text-ocean-900">{b.title}</td>
                    <td className="px-4 py-3 text-ocean-700">{b.author}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${b.available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                        {b.available ? `${b.copies} available` : "Not available"}
                      </span>
                    </td>
                  </tr>
                ))}
                {results.length === 0 && (
                  <tr><td colSpan={3} className="px-4 py-6 text-center text-ocean-500">No matches found in the catalog.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <p className="mb-3 font-display text-xl font-bold text-ocean-900">Welcome to SSN Central Library OPAC</p>
            <p className="mb-5 text-sm leading-relaxed text-ocean-700">
              Browse the catalog, check book availability, and manage your issued titles from one place.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {QUICK_LINKS.map((l) => (
                <a key={l.label} href="#" className="flex flex-col items-center gap-2 rounded-xl border border-ocean-100 bg-white p-4 text-center hover:border-ocean-400">
                  <l.icon className="h-6 w-6 text-ocean-600" />
                  <span className="text-xs font-medium text-ocean-800">{l.label}</span>
                </a>
              ))}
            </div>
          </div>
          <LoginPanel onNavigateAccount={onNavigateAccount} />
        </div>
      </div>
    </div>
  );
}
