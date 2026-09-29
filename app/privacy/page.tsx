import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-900 selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto pt-36 pb-20 px-6 space-y-8 flex-1">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900">Privacy Policy</h1>
          <p className="text-slate-500 text-xs mt-1">Last updated: September 2026</p>
        </div>

        <GlassCard className="p-8 space-y-6 text-xs text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">1. Decentralized Architecture</h2>
            <p>
              SubGuard operates primarily via client-side Web3 connections and public EVM smart contracts on MST Blockchain. We do not store your private keys, seed phrases, or custodial assets on any central server.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">2. Information Collection</h2>
            <p>
              When using optional traditional email authentication, we collect your name and email solely for account management and security notifications. When connecting a Web3 wallet like BridgeKey, your public address is read to query on-chain subscription rules.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">3. On-Chain Public Records</h2>
            <p>
              Transactions executed on the MST Blockchain (such as creating subscriptions, payment allowances, or cancellations) are public records on the decentralized ledger.
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
