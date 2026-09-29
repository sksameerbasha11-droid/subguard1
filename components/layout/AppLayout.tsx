"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import {
  Home,
  CreditCard,
  ShieldCheck,
  Receipt,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();

  const mobileNav = [
    { label: "Home", href: "/dashboard", icon: Home },
    { label: "Subscriptions", href: "/subscriptions", icon: CreditCard },
    { label: "Firewall", href: "/firewall", icon: ShieldCheck },
    { label: "Transactions", href: "/transactions", icon: Receipt },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-900 flex">
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-0">
        <Header />
        <main className="flex-1 ml-0 lg:ml-64 p-6 sm:p-8">{children}</main>
      </div>

      {/* Mobile App Bottom Navigation Bar (Page 12 requirement) */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white/80 backdrop-blur-xl border-t border-slate-200/80 px-4 py-2 z-50 flex justify-around items-center">
        {mobileNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[11px] font-semibold transition-colors",
                isActive ? "text-indigo-600 font-bold" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.5]" : "stroke-[1.75]")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
