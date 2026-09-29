"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Shield, Mail, CheckCircle2 } from "lucide-react";

export default function VerifyEmailPage() {
  const [resent, setResent] = useState(false);

  const handleResend = () => {
    setResent(true);
    setTimeout(() => setResent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col justify-center items-center p-6 selection:bg-indigo-500 selection:text-white">
      <Link href="/" className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-100">
          <Shield className="w-5 h-5 fill-white/20" />
        </div>
        <span className="font-extrabold text-xl tracking-tight text-slate-900">SUBGUARD</span>
      </Link>

      <GlassCard className="p-8 sm:p-10 max-w-md w-full space-y-6 text-center shadow-xl" glow="purple">
        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
          <Mail className="w-7 h-7" />
        </div>

        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Verify your email</h1>
          <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
            We sent a verification link to your registered email address. Click the link inside to activate full access.
          </p>
        </div>

        {resent && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Verification email resent successfully.</span>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <button
            onClick={handleResend}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-xs shadow-md shadow-indigo-100 transition-all hover:scale-[1.01]"
          >
            Resend Email
          </button>

          <Link
            href="/onboarding"
            className="block text-xs font-semibold text-slate-600 hover:text-slate-900 py-1"
          >
            Skip to Onboarding &rarr;
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
