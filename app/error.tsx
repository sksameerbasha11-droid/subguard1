"use client";

import React, { useEffect } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col items-center justify-center p-6 selection:bg-indigo-500 selection:text-white">
      <GlassCard className="p-10 sm:p-14 text-center max-w-md w-full space-y-4 shadow-xl" glow="red">
        <h2 className="text-xl font-bold text-slate-900">Something went wrong</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          {error.message || "An unexpected application error occurred."}
        </p>
        <div className="pt-2">
          <button
            onClick={() => reset()}
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl text-xs shadow-md shadow-indigo-100 transition-all hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
