"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Wallet, ArrowRight, Lock, Mail, CheckCircle2, Sparkles } from "lucide-react";
import { connectWallet } from "@/lib/wallet/bridgekey";
import { setSession } from "@/lib/auth/session";
import { GlassShield3D } from "@/components/ui/GlassShield3D";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("kabir@subguard.io");
  const [password, setPassword] = useState("••••••••••••");
  const [loading, setLoading] = useState(false);
  const [walletLoading, setWalletLoading] = useState(false);

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSession({
        id: "usr_102",
        name: email.split("@")[0] || "Kabir H.",
        email,
        walletAddress: "0x3f2A8b21C4e79b8dE0F219b882Aa8f2a7d9C",
        isWalletConnected: true,
        createdAt: new Date().toISOString(),
      });
      router.push("/");
    }, 600);
  };

  const handleWalletLogin = async () => {
    try {
      setWalletLoading(true);
      const addr = await connectWallet();
      setSession({
        id: `usr_${addr.slice(2, 10)}`,
        name: `User ${addr.slice(0, 6)}`,
        walletAddress: addr,
        isWalletConnected: true,
        createdAt: new Date().toISOString(),
      });
      router.push("/");
    } catch (err: any) {
      alert(err.message || "Failed to login with Bridgekey / Web3 Wallet");
    } finally {
      setWalletLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] flex flex-col justify-center items-center p-6 relative overflow-hidden text-slate-800 selection:bg-indigo-500 selection:text-white">
      {/* Background Soft Diffuse Bokeh & Indoor Lighting */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -left-20 top-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-[100px]" />
        <div className="absolute right-10 top-20 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px]" />
        <div className="absolute right-1/3 bottom-10 w-80 h-80 bg-indigo-100/40 rounded-full blur-[110px]" />
      </div>

      {/* Brand Header */}
      <Link href="/" className="flex items-center gap-3 mb-6 group">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform">
          <Shield className="w-5 h-5 fill-white stroke-none" />
        </div>
        <div>
          <h1 className="font-extrabold text-xl text-slate-900 tracking-tight leading-none">SubGuard</h1>
          <p className="text-xs text-indigo-600 font-semibold tracking-wide">on MST Blockchain</p>
        </div>
      </Link>

      {/* Glassmorphic Login Card */}
      <div className="bg-white/85 backdrop-blur-2xl border border-white/90 rounded-[32px] p-8 sm:p-10 max-w-md w-full shadow-[0_15px_45px_rgba(0,0,0,0.04)] space-y-6 relative">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to SubGuard</h2>
          <p className="text-xs text-slate-500">
            Access your protected subscriptions & payment firewall
          </p>
        </div>

        {/* 1-Click Bridgekey Wallet Login Button */}
        <button
          onClick={handleWalletLogin}
          disabled={walletLoading}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
        >
          <Wallet className="w-4 h-4" />
          <span>{walletLoading ? "Connecting Bridgekey..." : "Sign In with Bridgekey Wallet"}</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 text-slate-300">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">or sign in with email</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kabir@subguard.io"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50/80 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                Password
              </label>
              <Link href="/forgot-password" className="text-[11px] text-indigo-600 hover:underline font-semibold">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200/80 bg-slate-50/80 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl text-xs shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? "Signing in..." : "Sign In with Password"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link */}
        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-indigo-600 font-bold hover:underline">
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
