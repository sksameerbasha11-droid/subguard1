import React from "react";
import { cn } from "@/lib/utils";

export type StatusType = "Active" | "Paused" | "Cancelled" | "Allowed" | "Blocked" | "Pending";

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = "" }) => {
  const normalized = (status || "").toLowerCase();

  let styles = "bg-slate-100 text-slate-700 border-slate-200";

  if (normalized === "active" || normalized === "allowed" || normalized === "confirmed") {
    styles = "bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-[0_2px_8px_0_rgba(16,185,129,0.1)]";
  } else if (normalized === "paused" || normalized === "pending") {
    styles = "bg-amber-50 text-amber-700 border-amber-200/80 shadow-[0_2px_8px_0_rgba(245,158,11,0.1)]";
  } else if (normalized === "cancelled" || normalized === "blocked" || normalized === "failed") {
    styles = "bg-rose-50 text-rose-700 border-rose-200/80 shadow-[0_2px_8px_0_rgba(239,68,68,0.1)]";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md transition-all",
        styles,
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          normalized === "active" || normalized === "allowed" || normalized === "confirmed"
            ? "bg-emerald-500 animate-pulse"
            : normalized === "paused"
            ? "bg-amber-500"
            : normalized === "cancelled" || normalized === "blocked"
            ? "bg-rose-500"
            : "bg-slate-400"
        )}
      />
      <span>{status}</span>
    </span>
  );
};
