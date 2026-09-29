"use client";

import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Wallet,
  ExternalLink,
  LogOut,
  RefreshCw,
  Copy,
  Check,
  ShieldCheck,
} from "lucide-react";
import {
  connectWallet,
  disconnectWallet,
  getConnectedAddress,
  getBalance,
  switchToMSTTestnet,
} from "@/lib/wallet/bridgekey";
import { shortenAddress } from "@/lib/format";
import { MST_CONFIG } from "@/config/mst";

export default function WalletPage() {
  const [address, setAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState("0.00");
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWallet = async () => {
    setRefreshing(true);
    const addr = await getConnectedAddress();
    setAddress(addr);
    if (addr) {
      const bal = await getBalance(addr);
      setBalance(bal);
    }
    setRefreshing(false);
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const handleConnect = async () => {
    try {
      const addr = await connectWallet();
      setAddress(addr);
      const bal = await getBalance(addr);
      setBalance(bal);
    } catch (err: any) {
      alert(err.message || "Failed to connect BridgeKey");
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    setAddress(null);
    setBalance("0.00");
  };

  const copyToClipboard = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Wallet Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your BridgeKey connection, native MSTC gas token, and network state.
          </p>
        </div>

        {address ? (
          <div className="space-y-6">
            {/* Wallet Overview Card */}
            <GlassCard className="p-8 space-y-6" glow="purple">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-100">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900">BridgeKey Wallet</h2>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Connected
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono text-xs text-slate-600">
                        {address}
                      </span>
                      <button
                        onClick={copyToClipboard}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchWallet}
                    disabled={refreshing}
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
                  </button>
                  <button
                    onClick={handleDisconnect}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Disconnect</span>
                  </button>
                </div>
              </div>

              {/* Balance & Network details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
                <div>
                  <span className="text-slate-400 font-medium block">MSTC Available Balance</span>
                  <span className="text-2xl font-black text-slate-900 font-mono mt-1 block">
                    {balance} <span className="text-sm font-semibold text-slate-400">MSTC</span>
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Connected Network</span>
                  <span className="text-sm font-bold text-slate-900 mt-1 block flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{MST_CONFIG.chainName}</span>
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 font-medium block">Chain ID</span>
                  <span className="text-sm font-mono font-semibold text-slate-900 mt-1 block">
                    {MST_CONFIG.chainIdDecimal} ({MST_CONFIG.chainId})
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="border-t border-slate-100 pt-6 flex flex-wrap gap-4">
                <a
                  href={`${MST_CONFIG.blockExplorerUrls[0]}/address/${address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold px-4 py-2.5 rounded-xl text-xs shadow-2xs"
                >
                  <span>View on MST Explorer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={switchToMSTTestnet}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-4 py-2.5 rounded-xl text-xs border border-indigo-200/80 transition-colors"
                >
                  Verify Network Switch
                </button>
              </div>
            </GlassCard>
          </div>
        ) : (
          <GlassCard className="p-12 text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <Wallet className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">No Wallet Connected</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Connect BridgeKey or an EIP-1193 compatible wallet to view balances, manage payment rules, and sign transactions.
            </p>
            <button
              onClick={handleConnect}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl text-xs shadow-md shadow-indigo-100 transition-all hover:scale-105"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect BridgeKey</span>
            </button>
          </GlassCard>
        )}
      </div>
    </AppLayout>
  );
}
