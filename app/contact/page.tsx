"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { Mail, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-900 selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      <Navbar />

      <main className="max-w-2xl mx-auto pt-36 pb-20 px-6 space-y-8 flex-1 w-full">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-900">Contact Us</h1>
          <p className="text-slate-500 text-sm">
            Have questions about MST Blockchain or SubGuard firewall integrations?
          </p>
        </div>

        <GlassCard className="p-8 space-y-6">
          {submitted ? (
            <div className="text-center space-y-3 py-8">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Message Received</h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Thank you for reaching out. Our engineering team will respond within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold uppercase text-slate-500 block">Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div>
                <label className="font-bold uppercase text-slate-500 block">Email</label>
                <input
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="w-full mt-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <div>
                <label className="font-bold uppercase text-slate-500 block">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us what you'd like to discuss..."
                  className="w-full mt-1 bg-white border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-xs shadow-md shadow-indigo-100 transition-all hover:scale-[1.01]"
              >
                Send Message
              </button>
            </form>
          )}
        </GlassCard>
      </main>

      <footer className="py-8 px-6 border-t border-slate-200 text-center text-xs text-slate-400">
        © 2026 SubGuard. Powered by MST Blockchain.
      </footer>
    </div>
  );
}
