"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, CheckCircle2, ArrowRight, LogIn, Lock } from "lucide-react";
import { clearSession } from "@/lib/auth/session";
import { disconnectWallet } from "@/lib/wallet/bridgekey";

export default function LogoutPage() {
  const router = useRouter();
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    // Clear session and wallet storage
    clearSession();
    disconnectWallet();
    const timer = setTimeout(() => {
      setCleared(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col justify-center items-center p-6 relative overflow-hidden text-slate-800 selection:bg-indigo-500 selection:text-white">
      {/* Background Soft Diffuse Bokeh */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -left-20 top-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-[100px]" />
        <div className="absolute right-10 top-20 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px]" />
        <div className="absolute right-1/3 bottom-10 w-80 h-80 bg-indigo-100/40 rounded-full blur-[110px]" />
      </div>

      {/* Brand Header */}
      <Link href="/" className="flex items-center gap-3 mb-6 group">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
          <Shield className="w-5 h-5 fill-white stroke-none" />
        </div>
        <div>
          <h1 className="font-extrabold text-xl text-slate-900 tracking-tight leading-none">SubGuard</h1>
          <p className="text-xs text-indigo-600 font-semibold tracking-wide">on MST Blockchain</p>
        </div>
      </Link>

      {/* Glassmorphic Sign Out Confirmation Card */}
      <div className="bg-white/85 backdrop-blur-2xl border border-white/90 rounded-[32px] p-8 sm:p-10 max-w-md w-full shadow-[0_15px_45px_rgba(0,0,0,0.04)] space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 mx-auto shadow-md shadow-emerald-500/10">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/70">
            Session Terminated
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2.5">
            You&apos;ve been signed out
          </h2>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Your wallet session and SubGuard mandate credentials have been safely cleared from this browser.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs text-slate-600 flex items-center gap-3 text-left">
          <Lock className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <p>
            Your on-chain payment firewall rules remain <strong>active and protected</strong> on MST Blockchain.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/login"
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In Again</span>
          </Link>

          <Link
            href="/"
            className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Return to Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
