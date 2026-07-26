import React from "react";
import * as Icons from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { useAuth } from "../lib/auth";

export default function ServiceTile({ service }) {
  const { satelliteUrl } = useAuth();
  const Icon = Icons[service.icon] || Icons.ExternalLink;

  return (
    <a
      href={satelliteUrl(service.url)}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-navy-800 bg-navy-900 p-5 transition hover:-translate-y-0.5 hover:border-amber-500/60 hover:shadow-lg hover:shadow-amber-500/5"
    >
      <div className="flex items-start justify-between">
        <div
          className="grid h-11 w-11 place-items-center rounded-xl"
          style={{ backgroundColor: `${service.accent}22`, color: service.accent }}
        >
          <Icon className="h-5 w-5" />
        </div>
        <ArrowUpRight className="h-4 w-4 text-navy-600 transition group-hover:text-amber-500" />
      </div>
      <div className="mt-4">
        <p className="font-display text-lg font-semibold text-white">{service.name}</p>
        <p className="mt-0.5 text-xs uppercase tracking-wide text-navy-500">{service.fullName}</p>
        <p className="mt-2 text-sm leading-snug text-navy-400">{service.description}</p>
      </div>
      <span className="mt-4 inline-block text-[11px] font-medium text-navy-500">
        Opens {service.name} in a new tab ↗
      </span>
    </a>
  );
}
