"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/GlassCard";
import { Shield, Wallet, Layers, PlusCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { connectWallet } from "@/lib/wallet/bridgekey";
import { shortenAddress } from "@/lib/format";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [wallet, setWallet] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      const addr = await connectWallet();
      setWallet(addr);
      setCurrentStep(2);
    } catch (err: any) {
      alert(err.message || "Failed to connect wallet");
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col justify-center items-center p-6 selection:bg-indigo-500 selection:text-white">
      <Link href="/" className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-100">
          <Shield className="w-5 h-5 fill-white/20" />
        </div>
        <span className="font-extrabold text-xl tracking-tight text-slate-900">SUBGUARD</span>
      </Link>

      <GlassCard className="p-8 sm:p-10 max-w-lg w-full space-y-8 shadow-xl" glow="purple">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900">Welcome to SubGuard</h1>
          <p className="text-xs text-slate-500">
            Let's get your payment firewall initialized in three simple steps.
          </p>
        </div>

        {/* 3 Step Indicator */}
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-0 -translate-y-1/2" />
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs z-10 transition-colors ${
                currentStep >= step
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                  : "bg-white border-2 border-slate-200 text-slate-400"
              }`}
            >
              {currentStep > step ? "✓" : step}
            </div>
          ))}
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl text-indigo-600 flex items-center justify-center mx-auto">
              <Wallet className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 1: Connect Wallet</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Connect your BridgeKey or standard EIP-1193 wallet to enable on-chain subscription verification.
              </p>
            </div>
            <button
              onClick={handleConnect}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl text-xs shadow-md shadow-indigo-100 transition-all hover:scale-[1.01]"
            >
              Connect BridgeKey Wallet
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl text-indigo-600 flex items-center justify-center mx-auto">
              <Layers className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 2: Choose MST Testnet</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Connected address: <strong className="font-mono text-slate-800">{shortenAddress(wallet)}</strong>. MST Testnet is selected for low-fee programmable payment rules.
              </p>
            </div>
            <button
              onClick={() => setCurrentStep(3)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl text-xs shadow-md shadow-indigo-100 transition-all hover:scale-[1.01]"
            >
              Confirm MST Testnet
            </button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6 text-center">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl text-indigo-600 flex items-center justify-center mx-auto">
              <PlusCircle className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Step 3: Add your first subscription</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                Create a protected spending ceiling for Netflix, Spotify, or your favorite software subscription.
              </p>
            </div>
            <Link
              href="/add-subscription"
              className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl text-xs shadow-md shadow-indigo-100 transition-all hover:scale-[1.01]"
            >
              Add First Subscription
            </Link>
          </div>
        )}

        {/* Skip for now (Page 4 requirement) */}
        <div className="text-center pt-2">
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors"
          >
            Skip for now &rarr;
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
