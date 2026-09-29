import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-900 selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto pt-36 pb-20 px-6 space-y-8 flex-1">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900">Terms of Service</h1>
          <p className="text-slate-500 text-xs mt-1">Last updated: September 2026</p>
        </div>

        <GlassCard className="p-8 space-y-6 text-xs text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">1. Agreement to Terms</h2>
            <p>
              By accessing or using SubGuard, you agree to be bound by these Terms of Service. If you do not agree, do not connect your wallet or use our services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">2. Self-Custody &amp; Blockchain Transactions</h2>
            <p>
              You understand that transactions submitted to the MST Blockchain cannot be reversed once confirmed. You are solely responsible for verifying merchant wallet addresses, authorized limits, and gas fees before signing transactions with BridgeKey.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">3. Service Labels</h2>
            <p>
              Service brand logos (Netflix, Spotify, etc.) are user-managed reference labels for personal accounting and identification. SubGuard is not affiliated with, endorsed by, or an integrated merchant for these entities unless explicitly stated.
            </p>
          </section>
        </GlassCard>
      </main>

      <footer className="py-8 px-6 border-t border-slate-200 text-center text-xs text-slate-400">
        © 2026 SubGuard. Powered by MST Blockchain.
      </footer>
    </div>
  );
}
