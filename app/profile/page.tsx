"use client";

import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { User, Wallet, LogOut, CheckCircle2 } from "lucide-react";
import { getConnectedAddress, disconnectWallet } from "@/lib/wallet/bridgekey";
import { getSession } from "@/lib/auth/session";
import { shortenAddress } from "@/lib/format";

export default function ProfilePage() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("Sameer");
  const [email, setEmail] = useState("user@subguard.io");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getConnectedAddress().then(setWallet);
    const session = getSession();
    if (session) {
      if (session.name) setName(session.name);
      if (session.email) setEmail(session.email);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    setWallet(null);
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            User Profile
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your personal identity and Web3 account details.
          </p>
        </div>

        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile details updated successfully.</span>
          </div>
        )}

        <GlassCard className="p-8 space-y-6">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-xl">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{name}</h2>
              <p className="text-xs text-slate-500">{email}</p>
            </div>
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase text-slate-500 block">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="font-bold uppercase text-slate-500 block">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Account Name</span>
                <span className="text-sm font-bold text-slate-900 mt-1 block">{name}</span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Account Email</span>
                <span className="text-sm font-semibold text-slate-900 mt-1 block">{email}</span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Wallet Address</span>
                <span className="text-xs font-mono font-semibold text-slate-900 mt-1 block">
                  {wallet ? shortenAddress(wallet) : "No wallet connected"}
                </span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Account Created</span>
                <span className="text-xs text-slate-700 mt-1 block">September 2026</span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Connected Network</span>
                <span className="text-xs font-bold text-slate-900 mt-1 block flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>MST Testnet (Chain ID 8277)</span>
                </span>
              </div>
            </div>
          )}

          <div className="border-t border-slate-100 pt-6 flex gap-4">
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-5 py-2.5 rounded-xl text-xs border border-indigo-200"
              >
                Edit Profile
              </button>
            )}

            {wallet && (
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold px-5 py-2.5 rounded-xl text-xs border border-rose-200"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect Wallet</span>
              </button>
            )}
          </div>
        </GlassCard>
      </div>
    </AppLayout>
  );
}
