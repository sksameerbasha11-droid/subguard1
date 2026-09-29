import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "glass" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 select-none disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base rounded-2xl",
  };

  const variantStyles = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 hover:shadow-indigo-200 focus:ring-indigo-500",
    secondary:
      "bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-200 focus:ring-slate-900",
    glass:
      "bg-white/70 hover:bg-white text-slate-800 border border-white/90 backdrop-blur-md shadow-xs focus:ring-indigo-400",
    danger:
      "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-100 focus:ring-rose-500",
    ghost:
      "bg-transparent hover:bg-slate-100/60 text-slate-600 hover:text-slate-900 focus:ring-slate-400",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(base, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
