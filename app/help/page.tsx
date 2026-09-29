"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare, ExternalLink } from "lucide-react";

export default function HelpPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "What is SubGuard?",
      a: "SubGuard is a blockchain-powered subscription manager and payment firewall that allows users to manage recurring subscriptions and define maximum authorized payment rules. It guarantees you will never be charged unexpected price hikes or renewal fees without your explicit on-chain consent.",
    },
    {
      q: "How does the payment firewall work?",
      a: "Whenever a service or merchant submits a payment authorization request, the request is evaluated directly by the SubGuard smart contract. If the requested amount is within your authorized limit (and the subscription is not paused or cancelled), the payment is allowed. If the requested amount exceeds your maximum authorized rule, the payment is blocked immediately.",
    },
    {
      q: "What is MST Blockchain?",
      a: "MST Blockchain is the high-performance, EVM-compatible underlying blockchain layer providing decentralized state persistence and verifiable smart contract execution for SubGuard's subscription rules and payment authorizations.",
    },
    {
      q: "How do I connect BridgeKey?",
      a: "BridgeKey connects seamlessly through the standard EIP-1193 provider interface. Click 'Connect BridgeKey' in the top header or login screen. Your browser will prompt you to select your account and switch to MST Testnet (Chain ID 8277).",
    },
    {
      q: "How do I add a subscription?",
      a: "Navigate to 'Add Subscription' from the sidebar, select your desired service (Netflix, Spotify, GitHub, etc.), enter the merchant's destination wallet address, set your normal recurring cost and your maximum authorized ceiling, and sign the transaction with BridgeKey.",
    },
    {
      q: "What happens when a payment exceeds my limit?",
      a: "The smart contract halts the transaction and emits a 'PaymentBlocked' event. No funds are transferred to the merchant. You receive a notification detailing the attempted overcharge, and the record is permanently logged in your transaction history.",
    },
  ];

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Help &amp; Support Center
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Frequently asked questions and guides for SubGuard and MST Blockchain.
          </p>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <GlassCard key={idx} className="p-6 transition-all">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-sm font-bold text-slate-900"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </p>
                )}
              </GlassCard>
            );
          })}
        </div>

        {/* Contact Support Banner */}
        <GlassCard className="p-8 text-center space-y-4" glow="blue">
          <h2 className="text-xl font-bold text-slate-900">Still have questions?</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Our technical support team and community developers are available 24/7 on MST Blockchain Discord and Telegram.
          </p>
          <a
            href="mailto:support@subguard.io"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl text-xs shadow-xs"
          >
            Contact Support
          </a>
        </GlassCard>
      </div>
    </AppLayout>
  );
}
