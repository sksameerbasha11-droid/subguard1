import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col items-center justify-center p-6 selection:bg-indigo-500 selection:text-white">
      <GlassCard className="p-10 sm:p-14 text-center max-w-md w-full space-y-4 shadow-xl">
        <h1 className="text-6xl font-black text-indigo-600">404</h1>
        <h2 className="text-xl font-bold text-slate-900">This page doesn&apos;t exist.</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          The route you are looking for was not found or has been moved.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl text-xs shadow-md shadow-indigo-100 transition-all hover:scale-105"
          >
            Back to Home
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
