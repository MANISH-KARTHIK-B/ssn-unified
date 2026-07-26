import React, { useState } from "react";
import { AuthProvider, useAuth } from "./lib/auth";
import Opac from "./pages/Opac";
import MyAccount from "./pages/MyAccount";

function Shell() {
  const { loading } = useAuth();
  const [view, setView] = useState("opac");

  if (loading) return <div className="grid min-h-screen place-items-center text-ocean-500">Loading…</div>;

  return (
    <div className="min-h-screen">
      {view === "opac" ? (
        <Opac onNavigateAccount={() => setView("account")} />
      ) : (
        <MyAccount onBack={() => setView("opac")} />
      )}
      <footer className="border-t border-ocean-100 bg-white py-6 text-center text-xs text-ocean-400">
        Part of SSN Unified
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}
