"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Bell, Wallet, User, CheckCircle2 } from "lucide-react";
import { connectWallet, getConnectedAddress } from "@/lib/wallet/bridgekey";
import { shortenAddress } from "@/lib/format";
import { getStoredNotifications } from "@/lib/notifications";

export const Header: React.FC = () => {
  const [wallet, setWallet] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    getConnectedAddress().then(setWallet);
    const notifs = getStoredNotifications();
    setUnreadCount(notifs.filter((n) => !n.read).length);
  }, []);

  const handleConnect = async () => {
    try {
      const addr = await connectWallet();
      setWallet(addr);
    } catch (err: any) {
      alert(err.message || "Failed to connect BridgeKey");
    }
  };

  return (
    <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-white/80 px-8 flex items-center justify-between sticky top-0 z-30 ml-64">
      {/* Search Input */}
      <div className="relative w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder="Search subscriptions..."
          className="w-full bg-slate-100/70 border border-slate-200/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white transition-all"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Network Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
          <span>MST Testnet</span>
        </div>

        {/* Notifications Icon */}
        <Link
          href="/notifications"
          className="relative p-2.5 rounded-xl bg-white/80 border border-slate-200/70 hover:bg-white text-slate-600 transition-colors shadow-xs"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
          )}
        </Link>

        {/* Wallet Button */}
        {wallet ? (
          <Link
            href="/wallet"
            className="flex items-center gap-2 bg-white/80 hover:bg-white border border-slate-200/80 px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-800 shadow-xs transition-all"
          >
            <Wallet className="w-3.5 h-3.5 text-indigo-600" />
            <span>{shortenAddress(wallet)}</span>
          </Link>
        ) : (
          <button
            onClick={handleConnect}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs shadow-indigo-100 transition-all"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Connect BridgeKey</span>
          </button>
        )}

        {/* Profile Avatar */}
        <Link
          href="/profile"
          className="w-9 h-9 rounded-xl bg-indigo-100/80 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs hover:scale-105 transition-transform"
        >
          <User className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
};
