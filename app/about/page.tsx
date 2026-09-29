import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-900 selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto pt-36 pb-20 px-6 space-y-8 flex-1">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-900">About SubGuard</h1>
          <p className="text-slate-500 text-sm">
            Empowering consumers with sovereign subscription authorization.
          </p>
        </div>

        <GlassCard className="p-8 space-y-6 leading-relaxed text-sm text-slate-700">
          <h2 className="text-xl font-bold text-slate-900">The Problem with Traditional Subscriptions</h2>
          <p>
            When you enter your credit card on conventional web services, you surrender spending control. Merchants can silently hike prices from $10 to $25 without requiring you to re-enter a security code, charge cancellation penalties, or make pausing virtually impossible through dark patterns.
          </p>

          <h2 className="text-xl font-bold text-slate-900">Our Solution</h2>
          <p>
            SubGuard inverts the balance of power. By deploying programmable payment firewall rules on MST Blockchain, users dictate the maximum price allowed for any recurring service. If an authorized charge comes in, it processes smoothly. If a merchant attempts to charge even one cent more than your rule, the MST smart contract rejects the transaction instantly.
          </p>

          <div className="border-t border-slate-100 pt-6">
            <h3 className="font-bold text-slate-900 text-base">Core Tenets</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1.5 text-xs text-slate-600">
              <li><strong>Zero Unauthorized Charges:</strong> Smart contracts verify spending ceilings.</li>
              <li><strong>1-Click Cancellation:</strong> Cancel or pause on-chain without dark patterns.</li>
              <li><strong>Verifiable Auditability:</strong> Real ledger receipts for every payment decision.</li>
            </ul>
          </div>
        </GlassCard>
      </main>

      <footer className="py-8 px-6 border-t border-slate-200 text-center text-xs text-slate-400">
        © 2026 SubGuard. Powered by MST Blockchain.
      </footer>
    </div>
  );
}
