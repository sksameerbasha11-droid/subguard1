"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { ServiceLogo } from "@/components/ui/ServiceLogo";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  ArrowLeft,
  PauseCircle,
  PlayCircle,
  Trash2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { shortenAddress, shortenTxHash } from "@/lib/format";

export default function SubscriptionDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  // Realistic subscription state matching the Netflix example from spec
  const [subscription, setSubscription] = useState({
    id: params.id || "1",
    serviceName: "Netflix",
    status: "Active" as "Active" | "Paused" | "Cancelled",
    amount: 649,
    maxAmount: 699,
    billingCycle: "Monthly (30 Days)",
    nextPayment: "02 October 2026",
    merchant: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    createdDate: "02 September 2026",
    blockchain: "MST Testnet",
    contractSubId: "0x01",
    creationTx: "0x7a83b24f10de29c49182390f738a1bbcc2839210",
  });

  const [dialogState, setDialogState] = useState<"none" | "pause" | "resume" | "cancel">("none");
  const [isProcessing, setIsProcessing] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const handlePause = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setSubscription((prev) => ({ ...prev, status: "Paused" }));
      setIsProcessing(false);
      setDialogState("none");
    }, 1200);
  };

  const handleResume = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setSubscription((prev) => ({ ...prev, status: "Active" }));
      setIsProcessing(false);
      setDialogState("none");
    }, 1200);
  };

  const handleCancel = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      setSubscription((prev) => ({ ...prev, status: "Cancelled" }));
      setIsProcessing(false);
      setDialogState("none");
    }, 1200);
  };

  const handleTestPayment = (amount: number) => {
    if (subscription.status === "Paused") {
      setTestResult({
        allowed: false,
        amount,
        reason: "Subscription is currently paused. Payment requests are not authorized.",
      });
      return;
    }
    if (subscription.status === "Cancelled") {
      setTestResult({
        allowed: false,
        amount,
        reason: "Subscription has been permanently cancelled.",
      });
      return;
    }
    if (amount <= subscription.maxAmount) {
      setTestResult({
        allowed: true,
        amount,
        rule: "Within authorized limit.",
        txHash: "0x89fc321b...ea41",
      });
    } else {
      setTestResult({
        allowed: false,
        amount,
        reason: "Requested amount exceeds your authorized subscription limit. No payment transferred.",
      });
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <Link
          href="/subscriptions"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Subscriptions</span>
        </Link>

        {/* Main Details Glass Card */}
        <GlassCard className="p-8 space-y-8">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div className="flex items-center gap-4">
              <ServiceLogo name={subscription.serviceName} size={56} />
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-extrabold text-slate-900">
                    {subscription.serviceName}
                  </h1>
                  <StatusBadge status={subscription.status} />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Protected Subscription • ID #{subscription.contractSubId}
                </p>
              </div>
            </div>

            {/* Action Buttons (Page 8 & 9) */}
            <div className="flex flex-wrap items-center gap-2">
              {subscription.status === "Active" ? (
                <button
                  onClick={() => setDialogState("pause")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors"
                >
                  <PauseCircle className="w-4 h-4" />
                  <span>Pause Protection</span>
                </button>
              ) : subscription.status === "Paused" ? (
                <button
                  onClick={() => setDialogState("resume")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Resume Protection</span>
                </button>
              ) : null}

              {subscription.status !== "Cancelled" && (
                <button
                  onClick={() => setDialogState("cancel")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Cancel Subscription</span>
                </button>
              )}
            </div>
          </div>

          {/* Details Grid (Page 8) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">Subscription Amount</span>
              <span className="text-base font-extrabold text-slate-900 font-mono mt-1 block">
                {subscription.amount} MSTC
              </span>
            </div>

            <div>
              <span className="text-indigo-600 font-semibold block">Maximum Authorized Limit</span>
              <span className="text-base font-extrabold text-indigo-700 font-mono mt-1 block">
                {subscription.maxAmount} MSTC
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">Billing Cycle</span>
              <span className="text-sm font-semibold text-slate-900 mt-1 block">
                {subscription.billingCycle}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">Next Payment Date</span>
              <span className="text-sm font-semibold text-slate-900 mt-1 block">
                {subscription.nextPayment}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">Merchant Wallet</span>
              <span className="text-xs font-mono font-semibold text-slate-800 mt-1 block">
                {shortenAddress(subscription.merchant)}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">Created Date</span>
              <span className="text-sm font-medium text-slate-700 mt-1 block">
                {subscription.createdDate}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">Blockchain</span>
              <span className="text-xs font-semibold text-slate-800 mt-1 block">
                {subscription.blockchain}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">Contract Subscription ID</span>
              <span className="text-xs font-mono font-semibold text-slate-800 mt-1 block">
                {subscription.contractSubId}
              </span>
            </div>

            <div>
              <span className="text-slate-400 font-medium block">Creation Transaction</span>
              <a
                href={`https://explorer.testnet.mstblockchain.io/tx/${subscription.creationTx}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-mono text-indigo-600 hover:underline mt-1 font-medium"
              >
                <span>{shortenTxHash(subscription.creationTx)}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Test Payment Simulation (Page 9) */}
          <div className="border-t border-slate-100 pt-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Firewall Test Payment Simulator
            </h3>
            <p className="text-xs text-slate-500">
              Simulate a merchant billing request to observe the smart contract firewall authorization response.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleTestPayment(649)}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
              >
                Test Valid Charge (649 MSTC)
              </button>
              <button
                onClick={() => handleTestPayment(2999)}
                className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
              >
                Test Price Hike Charge (2999 MSTC)
              </button>
            </div>

            {testResult && (
              <div
                className={`p-4 rounded-xl border backdrop-blur-md text-xs space-y-1 ${
                  testResult.allowed
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-950"
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {testResult.allowed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>✓ PAYMENT ALLOWED</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>✕ PAYMENT BLOCKED</span>
                    </>
                  )}
                </div>
                <p>
                  Requested: <strong>{testResult.amount} MSTC</strong>
                </p>
                <p>{testResult.allowed ? testResult.rule : `Reason: ${testResult.reason}`}</p>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Confirmation Modal */}
        {dialogState !== "none" && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <GlassCard className="p-6 max-w-md w-full space-y-4 shadow-2xl bg-white/95">
              <h3 className="text-base font-bold text-slate-900">
                {dialogState === "pause" && "Pause payment protection?"}
                {dialogState === "resume" && "Resume payment protection?"}
                {dialogState === "cancel" && "Cancel subscription protection?"}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {dialogState === "pause" &&
                  "While paused, payment requests are not authorized by the smart contract."}
                {dialogState === "resume" &&
                  "Resuming will re-enable automatic authorization for payments within your spending limit."}
                {dialogState === "cancel" &&
                  "Cancellation is permanent and should stop future authorization completely."}
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setDialogState("none")}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Dismiss
                </button>
                <button
                  disabled={isProcessing}
                  onClick={
                    dialogState === "pause"
                      ? handlePause
                      : dialogState === "resume"
                      ? handleResume
                      : handleCancel
                  }
                  className={`px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs ${
                    dialogState === "cancel"
                      ? "bg-rose-600 hover:bg-rose-700"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {isProcessing ? "Confirming on Blockchain..." : "Confirm Action"}
                </button>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
