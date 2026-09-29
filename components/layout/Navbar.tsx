"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { connectWallet, getConnectedAddress } from "@/lib/wallet/bridgekey";
import { shortenAddress } from "@/lib/format";
import { Shield } from "lucide-react";

export const Navbar: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    getConnectedAddress().then(setWalletAddress);
  }, []);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      const addr = await connectWallet();
      setWalletAddress(addr);
    } catch (err: any) {
      alert(err.message || "Failed to connect BridgeKey");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/80">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">SUBGUARD</span>
            <span className="hidden sm:inline-block ml-2 text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/60">
              MST Blockchain
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/#features" className="hover:text-indigo-600 transition-colors">Features</Link>
          <Link href="/#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</Link>
          <Link href="/#security" className="hover:text-indigo-600 transition-colors">Security</Link>
          <Link href="/firewall" className="hover:text-indigo-600 transition-colors">Payment Firewall</Link>
        </nav>

        {/* Right CTA / Wallet */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-700 hover:text-indigo-600 px-3 py-2 transition-colors"
          >
            Login
          </Link>

          {walletAddress ? (
            <Link
              href="/dashboard"
              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-mono text-xs font-bold px-4 py-2.5 rounded-xl border border-indigo-200/80 transition-all"
            >
              {shortenAddress(walletAddress)}
            </Link>
          ) : (
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-indigo-100 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {connecting ? "Connecting..." : "Connect Wallet"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
