"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { ServiceLogo } from "@/components/ui/ServiceLogo";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Plus, Search, ArrowRight } from "lucide-react";

export default function SubscriptionsPage() {
  const [filter, setFilter] = useState<"all" | "active" | "paused" | "cancelled">("all");
  const [search, setSearch] = useState("");

  const [subscriptions] = useState([
    {
      id: 1,
      name: "Netflix",
      amount: 649,
      maxAmount: 699,
      cycle: "Monthly",
      nextPayment: "02 October 2026",
      status: "Active",
    },
    {
      id: 2,
      name: "Spotify",
      amount: 119,
      maxAmount: 149,
      cycle: "Monthly",
      nextPayment: "14 October 2026",
      status: "Active",
    },
    {
      id: 3,
      name: "GitHub",
      amount: 40,
      maxAmount: 50,
      cycle: "Monthly",
      nextPayment: "28 October 2026",
      status: "Paused",
    },
    {
      id: 4,
      name: "Adobe",
      amount: 1999,
      maxAmount: 1999,
      cycle: "Annual",
      nextPayment: "Cancelled",
      status: "Cancelled",
    },
  ]);

  const filtered = subscriptions.filter((sub) => {
    const matchesFilter = filter === "all" || sub.status.toLowerCase() === filter;
    const matchesSearch = sub.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Your Subscriptions
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Manage and protect your recurring payments.
            </p>
          </div>
          <Link
            href="/add-subscription"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-3 rounded-xl shadow-md shadow-indigo-100 transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subscription</span>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search subscriptions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/70 border border-slate-200/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {(["all", "active", "paused", "cancelled"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                  filter === tab
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-white/60 text-slate-600 hover:bg-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Subscription Cards Grid */}
        {filtered.length === 0 ? (
          <GlassCard className="p-12 text-center space-y-4">
            <p className="text-base font-bold text-slate-800">No protected subscriptions yet.</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Add your first subscription to start protecting your recurring payments.
            </p>
            <Link
              href="/add-subscription"
              className="inline-block bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl text-xs shadow-xs"
            >
              + Add Subscription
            </Link>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((sub) => (
              <GlassCard key={sub.id} className="p-6 space-y-5" hoverable>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ServiceLogo name={sub.name} size={44} />
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{sub.name}</h3>
                      <p className="text-xs text-slate-500">{sub.cycle}</p>
                    </div>
                  </div>
                  <StatusBadge status={sub.status} />
                </div>

                <div className="space-y-2.5 text-xs border-t border-slate-100 pt-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Amount:</span>
                    <span className="font-bold text-slate-900 font-mono">{sub.amount} MSTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Maximum Allowed:</span>
                    <span className="font-semibold text-indigo-600 font-mono">{sub.maxAmount} MSTC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Next Payment:</span>
                    <span className="text-slate-700">{sub.nextPayment}</span>
                  </div>
                </div>

                <Link
                  href={`/subscriptions/${sub.id}`}
                  className="block text-center w-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold py-2.5 rounded-xl text-xs transition-colors shadow-2xs"
                >
                  View Details &amp; Rules
                </Link>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
