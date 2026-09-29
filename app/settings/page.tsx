"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { MST_CONFIG } from "@/config/mst";
import { Shield, Bell, Moon, Sun, Lock, Layers } from "lucide-react";

export default function SettingsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [onchainAlerts, setOnchainAlerts] = useState(true);
  const [firewallStrictness, setFirewallStrictness] = useState("strict");

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Settings
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Configure application behavior, firewall strictness, network RPC, and notifications.
          </p>
        </div>

        <div className="space-y-6">
          {/* Network Settings */}
          <GlassCard className="p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Network Configuration</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Default Blockchain</span>
                <span className="font-semibold text-slate-800 mt-1 block">MST Testnet</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Chain ID</span>
                <span className="font-mono text-slate-800 mt-1 block">{MST_CONFIG.chainIdDecimal}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400 font-medium block">RPC Endpoint</span>
                <span className="font-mono text-xs text-indigo-600 mt-1 block">
                  {MST_CONFIG.rpcUrls[0]}
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Smart Contract Settings */}
          <GlassCard className="p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              <span>Smart Contract Authority</span>
            </h2>
            <div className="space-y-2 text-xs">
              <p className="text-slate-500">
                All subscriptions and firewall policies are governed by the verified SubGuard smart contract on MST Testnet.
              </p>
              <div>
                <span className="text-slate-400 font-medium block">Contract Address</span>
                <span className="font-mono text-slate-900 font-bold mt-0.5 block break-all">
                  {MST_CONFIG.contractAddress}
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Appearance (Page 11: Light Glass Theme) */}
          <GlassCard className="p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Appearance</span>
            </h2>
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800 block">Theme Style</span>
                <span className="text-slate-500">SubGuard White Glassmorphism</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Light Glass Active
              </span>
            </div>
          </GlassCard>

          {/* Notifications */}
          <GlassCard className="p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-600" />
              <span>Notification Preferences</span>
            </h2>
            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 font-medium">Alert on Blocked Payment Attempts</span>
                <input
                  type="checkbox"
                  checked={firewallStrictness === "strict"}
                  onChange={(e) => setFirewallStrictness(e.target.checked ? "strict" : "lenient")}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 font-medium">On-chain Confirmation Notifications</span>
                <input
                  type="checkbox"
                  checked={onchainAlerts}
                  onChange={(e) => setOnchainAlerts(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 font-medium">Monthly Burn Summaries</span>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
              </label>
            </div>
          </GlassCard>
        </div>
      </div>
    </AppLayout>
  );
}
