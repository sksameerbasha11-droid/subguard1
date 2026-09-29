import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { ShieldCheck, Lock, Eye, Key } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-900 selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto pt-36 pb-20 px-6 space-y-10 flex-1">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-900">Security Architecture</h1>
          <p className="text-slate-500 text-sm">
            Zero-trust mathematical guarantees enforced on MST Blockchain.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <GlassCard className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Self-Custodial Always</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              SubGuard never requests, stores, or transmits your private keys, seed phrases, or wallet passwords. All interactions occur directly through BridgeKey EIP-1193 RPC.
            </p>
          </GlassCard>

          <GlassCard className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Immutable Smart Contracts</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Subscription spending limits are enforced on-chain by the verified SubGuard smart contract. No backend server can alter rules without your signature.
            </p>
          </GlassCard>

          <GlassCard className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Checks-Effects-Interactions</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our Solidity smart contracts follow industry-standard CEI patterns and access modifiers ensuring unauthorized parties cannot pause, resume, or alter subscriptions.
            </p>
          </GlassCard>

          <GlassCard className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Public Verifiability</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every single payment authorization and block event produces cryptographic proofs viewable on the official MST Blockchain Explorer.
            </p>
          </GlassCard>
        </div>
      </main>

      <footer className="py-8 px-6 border-t border-slate-200 text-center text-xs text-slate-400">
        © 2026 SubGuard. Powered by MST Blockchain.
      </footer>
    </div>
  );
}
