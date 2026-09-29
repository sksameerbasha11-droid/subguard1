"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Shield, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col justify-center items-center p-6 selection:bg-indigo-500 selection:text-white">
      <Link href="/" className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-100">
          <Shield className="w-5 h-5 fill-white/20" />
        </div>
        <span className="font-extrabold text-xl tracking-tight text-slate-900">SUBGUARD</span>
      </Link>

      <GlassCard className="p-8 sm:p-10 max-w-md w-full space-y-6 shadow-xl" glow="purple">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Login</span>
        </Link>

        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Forgot Password</h1>
          <p className="text-slate-500 text-xs mt-1">
            Enter your account email to receive a password reset link.
          </p>
        </div>

        {sent ? (
          <div className="space-y-4 text-center py-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Reset link dispatched</h2>
            <p className="text-xs text-slate-600">
              We&apos;ve sent a password reset link to <strong>{email}</strong> if an account exists.
            </p>
            <Link
              href="/reset-password"
              className="inline-block text-xs font-semibold text-indigo-600 hover:underline pt-2"
            >
              Proceed to Reset Password screen &rarr;
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 block">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-xs shadow-md shadow-indigo-100 transition-all hover:scale-[1.01]"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </GlassCard>
    </div>
  );
}
