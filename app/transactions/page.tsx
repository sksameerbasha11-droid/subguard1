"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { ServiceLogo } from "@/components/ui/ServiceLogo";
import { ExternalLink, Search, Filter } from "lucide-react";
import { shortenTxHash } from "@/lib/format";

export default function TransactionsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [transactions] = useState([
    {
      id: 1,
      service: "Netflix",
      type: "Payment Allowed",
      amount: "649 MSTC",
      status: "Allowed",
      date: "2026-09-28 14:22",
      hash: "0x7a83b24f10de29c49182390f738a1bbcc2839210",
    },
    {
      id: 2,
      service: "Adobe",
      type: "Payment Blocked",
      amount: "2999 MSTC",
      status: "Blocked",
      date: "2026-09-27 09:15",
      hash: "0x39a1c89f001bca7291840294719bbcd104928e19",
    },
    {
      id: 3,
      service: "Spotify",
      type: "Subscription Created",
      amount: "119 MSTC",
      status: "Confirmed",
      date: "2026-09-24 18:03",
      hash: "0x9183ec289410ca78921820938491829381928391",
    },
    {
      id: 4,
      service: "GitHub",
      type: "Subscription Paused",
      amount: "40 MSTC",
      status: "Confirmed",
      date: "2026-09-20 11:45",
      hash: "0x4b78912301928301928301928301928301928301",
    },
    {
      id: 5,
      service: "Netflix",
      type: "Subscription Created",
      amount: "649 MSTC",
      status: "Confirmed",
      date: "2026-09-02 10:14",
      hash: "0x8920192830192830192830192830192830192830",
    },
  ]);

  const filtered = transactions.filter((tx) => {
    const matchesFilter = filter === "all" || tx.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch =
      tx.service.toLowerCase().includes(search.toLowerCase()) ||
      tx.hash.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Transactions
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real on-chain audit log of subscription authorizations, renewals, and firewall interventions.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search service or transaction hash..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/70 border border-slate-200/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            {["all", "allowed", "blocked", "confirmed"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
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

        {/* Table of Transactions */}
        <GlassCard className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="pb-3.5">Service</th>
                  <th className="pb-3.5">Transaction Type</th>
                  <th className="pb-3.5">Amount</th>
                  <th className="pb-3.5">Status</th>
                  <th className="pb-3.5">Date</th>
                  <th className="pb-3.5 text-right">Transaction Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <ServiceLogo name={tx.service} size={36} />
                        <span className="font-bold text-slate-900">{tx.service}</span>
                      </div>
                    </td>
                    <td className="py-4 text-slate-600 font-medium">{tx.type}</td>
                    <td className="py-4 font-mono font-bold text-slate-900">{tx.amount}</td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          tx.status === "Allowed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : tx.status === "Blocked"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-indigo-50 text-indigo-700 border-indigo-200"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-4 text-slate-500">{tx.date}</td>
                    <td className="py-4 text-right">
                      <a
                        href={`https://explorer.testnet.mstblockchain.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-indigo-600 hover:underline font-medium"
                      >
                        <span>{shortenTxHash(tx.hash)}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </AppLayout>
  );
}
