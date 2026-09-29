"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  PlusCircle,
  ShieldCheck,
  Receipt,
  Wallet,
  Settings,
  HelpCircle,
  User,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const mainNav = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Subscriptions", href: "/subscriptions", icon: CreditCard },
    { label: "Add Subscription", href: "/add-subscription", icon: PlusCircle },
    { label: "Payment Firewall", href: "/firewall", icon: ShieldCheck },
    { label: "Transactions", href: "/transactions", icon: Receipt },
    { label: "Wallet", href: "/wallet", icon: Wallet },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  const bottomNav = [
    { label: "Help & Support", href: "/help", icon: HelpCircle },
    { label: "Profile", href: "/profile", icon: User },
  ];

  return (
    <aside className="w-64 bg-white/70 backdrop-blur-xl border-r border-white/80 min-h-screen flex flex-col justify-between p-6 select-none fixed left-0 top-0 bottom-0 z-40">
      <div className="space-y-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-200">
            <Shield className="w-5 h-5 fill-white/20" />
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-slate-900 leading-tight">
              SUBGUARD
            </h1>
            <p className="text-[10px] text-indigo-600 font-semibold uppercase tracking-wider">
              on MST Blockchain
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150",
                  isActive
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-100"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-400")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Nav */}
      <div className="space-y-4 pt-6 border-t border-slate-100">
        <nav className="space-y-1">
          {bottomNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150",
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                <Icon className="w-4 h-4 text-slate-400" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Network indicator badge */}
        <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-3 flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-[11px] leading-tight">
            <span className="font-semibold text-slate-800 block">MST Testnet</span>
            <span className="text-slate-400">Chain ID: 8277</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
