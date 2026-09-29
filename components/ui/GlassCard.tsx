import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: "none" | "purple" | "green" | "red" | "blue";
  hoverable?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = "",
  glow = "none",
  hoverable = false,
  ...props
}) => {
  const glowStyles = {
    none: "shadow-[0_8px_32px_0_rgba(15,23,42,0.04)] border-white/80",
    purple: "shadow-[0_8px_32px_0_rgba(99,102,241,0.14)] border-indigo-200/70",
    green: "shadow-[0_8px_32px_0_rgba(16,185,129,0.16)] border-emerald-200/70",
    red: "shadow-[0_8px_32px_0_rgba(239,68,68,0.16)] border-rose-200/70",
    blue: "shadow-[0_8px_32px_0_rgba(59,130,246,0.14)] border-blue-200/70",
  };

  return (
    <div
      className={cn(
        "bg-white/60 backdrop-blur-[20px] border rounded-[22px] transition-all duration-200",
        glowStyles[glow],
        hoverable && "hover:shadow-[0_12px_40px_0_rgba(15,23,42,0.08)] hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
