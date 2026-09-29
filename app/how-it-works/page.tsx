import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowRight } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Connect Account & BridgeKey",
      desc: "Connect your BridgeKey wallet to MST Testnet (Chain ID 8277). Zero custody surrender, 100% self-sovereignty.",
    },
    {
      num: "02",
      title: "Add a Subscription",
      desc: "Choose from major services like Netflix, Spotify, and GitHub or enter custom merchant credentials.",
    },
    {
      num: "03",
      title: "Define Your Payment Rules",
      desc: "Specify your regular expected subscription amount along with a strict maximum authorized limit on-chain.",
    },
    {
      num: "04",
      title: "Firewall Smart Contract Enforces Rules",
      desc: "When billing occurs, SubGuard checks the requested charge. Charges within the limit pass; surprise price hikes are instantly blocked.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-900 selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto pt-36 pb-20 px-6 space-y-10 flex-1">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-900">How SubGuard Works</h1>
          <p className="text-slate-500 text-sm">
            Total transparency and mathematical enforcement of your spending boundaries.
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((st) => (
            <GlassCard key={st.num} className="p-8 flex items-start gap-6">
              <span className="text-4xl font-black text-indigo-400/40 font-mono">
                {st.num}
              </span>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900">{st.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl text-xs shadow-md shadow-indigo-100 transition-all hover:scale-105"
          >
            <span>Get Started with SubGuard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <footer className="py-8 px-6 border-t border-slate-200 text-center text-xs text-slate-400">
        © 2026 SubGuard. Powered by MST Blockchain.
      </footer>
    </div>
  );
}
