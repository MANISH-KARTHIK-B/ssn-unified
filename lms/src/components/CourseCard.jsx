import React from "react";
import { Link } from "react-router-dom";
import { MoreVertical } from "lucide-react";

const BANNER_COLORS = {
  hexagon: "#4A8FE7",
  diamond: "#6C4DF0",
  wave: "#12B886",
  grid: "#E8590C",
  plaid: "#9C6BFF",
  circuit: "#0CA678",
  dots: "#5C7CFA",
  ring: "#F08C00"
};

export default function CourseCard({ course }) {
  return (
    <Link
      to={`/course/${course.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:shadow-md"
    >
      <div
        className={`banner-${course.banner} h-28`}
        style={{ backgroundColor: BANNER_COLORS[course.banner] || "#6C4DF0" }}
      />
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold leading-snug text-violet-700 group-hover:underline">
            {course.code} — {course.title}
          </p>
          <MoreVertical className="h-4 w-4 shrink-0 text-graphite-500" />
        </div>
        <p className="mt-1 text-xs text-graphite-500">{course.department} · {course.term}</p>
        <div className="mt-auto pt-4">
          <div className="mb-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="h-full rounded-full bg-violet-500" style={{ width: `${course.progress}%` }} />
          </div>
          <p className="text-xs font-medium text-graphite-700">{course.progress}% complete</p>
        </div>
      </div>
    </Link>
  );
}
