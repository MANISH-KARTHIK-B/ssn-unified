import React, { useEffect, useState } from "react";
import { Upload, ShieldCheck, Trash2 } from "lucide-react";
import { useAuth } from "../lib/auth";

const STORAGE_PREFIX = "coe_local_photo_";

export default function UploadPhoto() {
  const { user } = useAuth();
  const storageKey = STORAGE_PREFIX + (user?.id || "guest");
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) setPreview(saved);
  }, [storageKey]);

  function onFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      localStorage.setItem(storageKey, reader.result);
    };
    reader.readAsDataURL(file);
  }

  function remove() {
    setPreview(null);
    localStorage.removeItem(storageKey);
  }

  return (
    <div className="px-8 py-8">
      <h1 className="mb-6 font-display text-2xl font-bold text-slate-900">Upload Your Photo</h1>

      <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-6">
        <div className="mx-auto mb-4 grid h-32 w-32 place-items-center overflow-hidden rounded-full bg-slate-100">
          {preview ? (
            <img src={preview} alt="Profile preview" className="h-full w-full object-cover" />
          ) : (
            <Upload className="h-8 w-8 text-slate-300" />
          )}
        </div>

        <label className="block w-full cursor-pointer rounded-lg bg-cobalt-500 py-2.5 text-center text-sm font-semibold text-white hover:bg-cobalt-600">
          Choose a photo
          <input type="file" accept="image/*" onChange={onFile} className="hidden" />
        </label>

        {preview && (
          <button onClick={remove} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-sm text-slate-600 hover:border-red-300 hover:text-red-500">
            <Trash2 className="h-3.5 w-3.5" /> Remove photo
          </button>
        )}

        <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          This photo is stored only in your browser (never uploaded to the server) — a deliberate privacy choice for this prototype, since it never needs to persist anywhere outside your own device.
        </div>
      </div>
    </div>
  );
}
