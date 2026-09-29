"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { ServiceLogo } from "@/components/ui/ServiceLogo";
import {
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { shortenTxHash } from "@/lib/format";

export default function FirewallPage() {
  const subscriptions = [
    { id: 1, name: "Netflix", amount: 649, maxAllowed: 699, status: "Active" },
    { id: 2, name: "Spotify", amount: 119, maxAllowed: 149, status: "Active" },
    { id: 3, name: "GitHub", amount: 40, maxAllowed: 50, status: "Paused" },
    { id: 4, name: "Adobe", amount: 1999, maxAllowed: 1999, status: "Active" },
  ];

  const [selectedSubId, setSelectedSubId] = useState(1);
  const currentSub = subscriptions.find((s) => s.id === selectedSubId) || subscriptions[0];

  const [requestedAmount, setRequestedAmount] = useState<string>("649");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleCheckPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setResult(null);

    const reqNum = parseFloat(requestedAmount);

    setTimeout(() => {
      setChecking(false);
      if (currentSub.status === "Paused") {
        setResult({
          allowed: false,
          amount: reqNum,
          maximum: currentSub.maxAllowed,
          reason: "Subscription is currently paused. Payment requests are not authorized.",
        });
        return;
      }

      if (reqNum <= currentSub.maxAllowed) {
        setResult({
          allowed: true,
          amount: reqNum,
          rule: "Within authorized limit.",
          txHash: "0x7a83b24f10de29c49182390f738a1bbcc2839210",
        });
      } else {
        setResult({
          allowed: false,
          amount: reqNum,
          maximum: currentSub.maxAllowed,
          reason: "Requested amount exceeds your authorized subscription limit. No payment should be transferred.",
        });
      }
    }, 600);
  };

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Payment Firewall
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Every payment request is checked against your subscription rules on MST Blockchain.
          </p>
        </div>

        {/* Stats Grid (Page 9) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <GlassCard className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Protected Subscriptions
            </p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2">12</p>
            <p className="text-xs text-slate-500 mt-1">Actively guarded by smart contracts</p>
          </GlassCard>

          <GlassCard className="p-6" glow="green">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
              Allowed Payments
            </p>
            <p className="text-3xl font-extrabold text-emerald-700 mt-2">84</p>
            <p className="text-xs text-emerald-600/80 mt-1">Transactions executed within budget</p>
          </GlassCard>

          <GlassCard className="p-6" glow="red">
            <p className="text-xs font-semibold uppercase tracking-wider text-rose-600">
              Blocked Payments
            </p>
            <p className="text-3xl font-extrabold text-rose-700 mt-2">5</p>
            <p className="text-xs text-rose-600/80 mt-1">Unauthorized charges stopped</p>
          </GlassCard>
        </div>

        {/* Live Payment Request & Evaluation Console (Page 9) */}
        <GlassCard className="p-8 space-y-6">
          <h2 className="text-xl font-bold text-slate-900">Payment Request Evaluation</h2>
          <p className="text-xs text-slate-500">
            Select a subscription, set a claimed charge amount, and observe how the SubGuard smart contract rules enforce payment authorization.
          </p>

          <form onSubmit={handleCheckPayment} className="space-y-6">
            <div>
              <label className="text-xs font-bold uppercase text-slate-500 block">
                Choose Subscription
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                {subscriptions.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => {
                      setSelectedSubId(sub.id);
                      setRequestedAmount(sub.amount.toString());
                      setResult(null);
                    }}
                    className={`p-3 rounded-2xl flex items-center gap-3 border text-left transition-all ${
                      selectedSubId === sub.id
                        ? "bg-indigo-50 border-indigo-500 shadow-xs"
                        : "bg-white/60 border-slate-200 hover:bg-white"
                    }`}
                  >
                    <ServiceLogo name={sub.name} size={36} />
                    <div className="truncate">
                      <span className="font-bold text-xs text-slate-900 block truncate">
                        {sub.name}
                      </span>
                      <span className="text-[10px] text-slate-500">{sub.amount} MSTC</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Service Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Authorized Subscription Amount:</span>
                <span className="font-bold text-slate-900 font-mono ml-2">
                  {currentSub.amount} MSTC
                </span>
              </div>
              <div>
                <span className="text-indigo-600 font-semibold">Maximum Allowed Rule:</span>
                <span className="font-bold text-indigo-700 font-mono ml-2">
                  {currentSub.maxAllowed} MSTC
                </span>
              </div>
            </div>

            {/* Requested Amount Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-slate-700">
                  Requested Amount (MSTC)
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRequestedAmount(currentSub.amount.toString())}
                    className="text-[11px] text-indigo-600 font-semibold hover:underline"
                  >
                    Standard ({currentSub.amount} MSTC)
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={() => setRequestedAmount("2999")}
                    className="text-[11px] text-rose-600 font-semibold hover:underline"
                  >
                    Simulate Price Hike (2999 MSTC)
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <input
                  type="number"
                  step="any"
                  required
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
                <button
                  type="submit"
                  disabled={checking}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-indigo-100 transition-all hover:scale-[1.01] text-xs disabled:opacity-50"
                >
                  {checking ? "Checking Smart Contract..." : "Check Payment"}
                </button>
              </div>
            </div>
          </form>

          {/* DYNAMIC RESULT DISPLAY (Page 9 & 10) */}
          {result && (
            <div className="pt-2 animate-in fade-in duration-200">
              {result.allowed ? (
                /* Green Glass Result (Page 9) */
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-md text-emerald-950 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    <span className="text-base font-extrabold tracking-wide text-emerald-800">
                      ✓ PAYMENT ALLOWED
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p>
                      Amount: <strong>{result.amount} MSTC</strong>
                    </p>
                    <p>
                      Rule: <strong>{result.rule}</strong>
                    </p>
                  </div>

                  <div className="border-t border-emerald-500/20 pt-3 flex items-center justify-between font-mono text-[11px] text-emerald-800">
                    <span>Transaction: {shortenTxHash(result.txHash)}</span>
                    <a
                      href={`https://explorer.testnet.mstblockchain.io/tx/${result.txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-sans text-emerald-700 font-bold hover:underline"
                    >
                      <span>View on MST Explorer</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ) : (
                /* Red Glass Result (Page 10) */
                <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 backdrop-blur-md text-rose-950 space-y-3">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-6 h-6 text-rose-600" />
                    <span className="text-base font-extrabold tracking-wide text-rose-800">
                      ✕ PAYMENT BLOCKED
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p>
                      Amount: <strong>{result.amount.toLocaleString()} MSTC</strong>
                    </p>
                    <p>
                      Maximum: <strong>{result.maximum.toLocaleString()} MSTC</strong>
                    </p>
                    <p className="font-semibold text-rose-800 mt-1">
                      Reason: {result.reason}
                    </p>
                  </div>

                  <div className="border-t border-rose-500/20 pt-2 text-[11px] text-rose-700 font-medium">
                    No payment should be transferred. The smart contract blocked this transaction.
                  </div>
                </div>
              )}
            </div>
          )}
        </GlassCard>
      </div>
    </AppLayout>
  );
}
