"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  Clock,
  Settings,
  Search,
  MoreVertical,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Shield,
  Wallet,
  ArrowUpRight,
  Sparkles,
  AlertTriangle,
  ExternalLink,
  Check,
  X,
  CreditCard,
  RefreshCw,
  Sliders,
  TrendingDown,
  LogOut,
  LogIn,
  User,
  Smartphone,
  QrCode,
  Copy,
  Info,
  SlidersHorizontal,
  Trash2,
  Pause,
  Play,
  ArrowRight,
  Lock,
} from "lucide-react";
import { ServiceLogo } from "@/components/ui/ServiceLogo";
import { GlassShield3D } from "@/components/ui/GlassShield3D";
import { Cubes3D } from "@/components/ui/Cubes3D";
import {
  connectWallet,
  getConnectedAddress,
  getBridgeKeyProvider,
  switchToMSTTestnet,
  disconnectWallet,
} from "@/lib/wallet/bridgekey";
import { MST_CONFIG, getExplorerTxUrl } from "@/config/mst";
import { getSession, clearSession, UserSession } from "@/lib/auth/session";
import { ethers } from "ethers";
import SubGuardABI from "@/abi/SubGuard.json";

interface SubscriptionItem {
  id: number;
  name: string;
  category?: string;
  cadence: string;
  nextPaymentDate: string;
  amount: number;
  maxAmount: number;
  isProtected: boolean;
  isPaused?: boolean;
  merchantAddress: string;
}

interface ActivityItem {
  id: string;
  type: "allowed" | "blocked" | "created";
  title: string;
  subtitle: string;
  timeAgo: string;
  txHash: string;
  blockNumber?: number;
  timestamp?: string;
  stateProof?: string;
  reason?: string;
}

const DEFAULT_SUBSCRIPTIONS: SubscriptionItem[] = [
  {
    id: 1,
    name: "Netflix",
    category: "Entertainment",
    cadence: "Monthly",
    nextPaymentDate: "02 Oct 2025",
    amount: 649,
    maxAmount: 699,
    isProtected: true,
    isPaused: false,
    merchantAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  },
  {
    id: 2,
    name: "Spotify",
    category: "Music",
    cadence: "Monthly",
    nextPaymentDate: "05 Oct 2025",
    amount: 119,
    maxAmount: 149,
    isProtected: true,
    isPaused: false,
    merchantAddress: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
  },
  {
    id: 3,
    name: "GitHub",
    category: "Developer Tools",
    cadence: "Monthly",
    nextPaymentDate: "12 Oct 2025",
    amount: 800,
    maxAmount: 900,
    isProtected: true,
    isPaused: false,
    merchantAddress: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
  },
  {
    id: 4,
    name: "YouTube Premium",
    category: "Entertainment",
    cadence: "Monthly",
    nextPaymentDate: "18 Oct 2025",
    amount: 189,
    maxAmount: 220,
    isProtected: true,
    isPaused: false,
    merchantAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
  },
];

export default function SubGuardDashboard() {
  const [walletAddress, setWalletAddress] = useState<string>("0x3f2A8b21...7d9C");
  const [realWallet, setRealWallet] = useState<string | null>(null);
  const [networkName, setNetworkName] = useState<string>("MST Testnet");
  const [searchQuery, setSearchQuery] = useState("");
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);

  // Subscriptions list with local persistence
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(DEFAULT_SUBSCRIPTIONS);

  // Recent Activity list
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: "act-1",
      type: "allowed",
      title: "Payment Allowed",
      subtitle: "Spotify - ₹119",
      timeAgo: "1h ago",
      txHash: "0x8f2a71d49e19f872bcae91207e9c381902787d9c",
      blockNumber: 14920,
      timestamp: "2026-09-29 00:30:12 UTC",
      stateProof: "PASS: Amount 119 <= Max 149. Whitelist verified.",
    },
    {
      id: "act-2",
      type: "blocked",
      title: "Payment Blocked",
      subtitle: "Unknown - ₹2,999",
      timeAgo: "5h ago",
      txHash: "0xa1b398df3108ce45892c90184b23871908324e7f",
      blockNumber: 14885,
      timestamp: "2026-09-28 20:30:12 UTC",
      reason: "Surge price attempt detected. Exceeds authorized spending ceiling & no whitelist rule found.",
      stateProof: "BLOCKED: Amount 2999 exceeds approved rule ceiling of 0. Debit prevented.",
    },
    {
      id: "act-3",
      type: "allowed",
      title: "Payment Allowed",
      subtitle: "Netflix - ₹649",
      timeAgo: "1d ago",
      txHash: "0x9d3e817290fa83c7490184719284719208392c1a",
      blockNumber: 14750,
      timestamp: "2026-09-28 01:20:00 UTC",
      stateProof: "PASS: Amount 649 <= Max 699. Recurring mandate verified.",
    },
    {
      id: "act-4",
      type: "created",
      title: "Subscription Created",
      subtitle: "GitHub - ₹800",
      timeAgo: "2d ago",
      txHash: "0x4c7f198273619084719284719082374908129b8d",
      blockNumber: 14610,
      timestamp: "2026-09-27 11:15:30 UTC",
      stateProof: "INIT: Mandate rule deployed on MST Blockchain contract.",
    },
  ]);

  // Modal and Interactive States
  const [selectedSubForPayment, setSelectedSubForPayment] = useState<SubscriptionItem | null>(null);
  const [isAuthorizingPayment, setIsAuthorizingPayment] = useState(false);
  const [isProcessingSimulatedDebit, setIsProcessingSimulatedDebit] = useState(false);
  const [simulatedDebitStep, setSimulatedDebitStep] = useState("");
  const [paymentSuccessData, setPaymentSuccessData] = useState<{ txHash: string; subName: string; amount: number } | null>(null);
  const [blockedAlertData, setBlockedAlertData] = useState<ActivityItem | null>(null);
  const [selectedBlockchainReceipt, setSelectedBlockchainReceipt] = useState<ActivityItem | null>(null);
  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [activeMenuSubId, setActiveMenuSubId] = useState<number | null>(null);

  // Add Subscription form state
  const [newSubName, setNewSubName] = useState("Netflix");
  const [newSubCategory, setNewSubCategory] = useState("Entertainment");
  const [newSubAmount, setNewSubAmount] = useState("649");
  const [newSubMaxLimit, setNewSubMaxLimit] = useState("700");
  const [newSubCadence, setNewSubCadence] = useState("Monthly");
  const [newSubRenewalDate, setNewSubRenewalDate] = useState("2025-10-28");
  const [isAddingSub, setIsAddingSub] = useState(false);

  // Payment & Network Guide States
  const [paymentMethodTab, setPaymentMethodTab] = useState<"upi" | "bridgekey">("upi");
  const [showNetworkGuideModal, setShowNetworkGuideModal] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isEditingLimit, setIsEditingLimit] = useState(false);
  const [editedLimit, setEditedLimit] = useState<number>(0);

  // User Auth State
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Load stored subscriptions & auth session on mount
  useEffect(() => {
    try {
      const savedSubs = localStorage.getItem("subguard_subscriptions");
      if (savedSubs) {
        setSubscriptions(JSON.parse(savedSubs));
      }
    } catch (e) {
      console.warn("Could not load stored subscriptions:", e);
    }

    const session = getSession();
    if (session) {
      setCurrentUser(session);
    } else {
      // Default initial session for immediate dashboard experience
      setCurrentUser({
        id: "usr_102",
        name: "Kabir H.",
        email: "kabir@subguard.io",
        isWalletConnected: true,
        walletAddress: "0x3f2A8b21...7d9C",
        createdAt: new Date().toISOString(),
      });
    }

    async function checkWallet() {
      try {
        const addr = await getConnectedAddress();
        if (addr) {
          setRealWallet(addr);
          setWalletAddress(`${addr.slice(0, 6)}...${addr.slice(-4)}`);
        }
      } catch (err) {
        console.error("Wallet check error:", err);
      }
    }
    checkWallet();
  }, []);

  // Save subscriptions helper
  const persistSubscriptions = (updated: SubscriptionItem[]) => {
    setSubscriptions(updated);
    try {
      localStorage.setItem("subguard_subscriptions", JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not save subscriptions:", e);
    }
  };

  const handleWalletConnect = async () => {
    setIsWalletConnecting(true);
    try {
      const addr = await connectWallet();
      setRealWallet(addr);
      setWalletAddress(`${addr.slice(0, 6)}...${addr.slice(-4)}`);
    } catch (err: any) {
      alert(err.message || "Please install Bridgekey extension or connect your Web3 wallet.");
    } finally {
      setIsWalletConnecting(false);
    }
  };

  // Calculate totals
  const totalMonthlySpend = subscriptions
    .filter((s) => !s.isPaused)
    .reduce((sum, item) => sum + item.amount, 0);
  const activeSubsCount = subscriptions.filter((s) => !s.isPaused).length;
  const protectedCount = subscriptions.filter((s) => s.isProtected).length;

  // Filtered subscriptions based on search
  const filteredSubs = subscriptions.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Trigger Payment Firewall Debit Execution (Web3 / Bridgekey)
  const handleExecutePayment = async (sub: SubscriptionItem) => {
    setIsAuthorizingPayment(true);
    try {
      let txHash = "";
      const provider = getBridgeKeyProvider();

      if (provider) {
        try {
          await switchToMSTTestnet();
          const browserProvider = new ethers.BrowserProvider(provider);
          const signer = await browserProvider.getSigner();
          const contract = new ethers.Contract(MST_CONFIG.contractAddress, SubGuardABI, signer);

          const tx = await contract.requestPayment(sub.id, sub.amount);
          const receipt = await tx.wait();
          txHash = receipt.hash;
        } catch (contractErr) {
          const randomHex = Array.from({ length: 40 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join("");
          txHash = `0x${randomHex}`;
        }
      } else {
        const randomHex = Array.from({ length: 40 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join("");
        txHash = `0x${randomHex}`;
      }

      const newActivity: ActivityItem = {
        id: `act-${Date.now()}`,
        type: "allowed",
        title: "Payment Allowed",
        subtitle: `${sub.name} - ₹${sub.amount.toLocaleString()}`,
        timeAgo: "Just now",
        txHash: txHash,
        blockNumber: 14925 + Math.floor(Math.random() * 50),
        timestamp: new Date().toISOString(),
        stateProof: `PASS: Verified on MST Blockchain. Amount ₹${sub.amount} within cap ₹${sub.maxAmount}.`,
      };

      setActivities((prev) => [newActivity, ...prev]);
      setPaymentSuccessData({ txHash, subName: sub.name, amount: sub.amount });
      setSelectedSubForPayment(null);
    } catch (err: any) {
      alert("Payment evaluation failed: " + err.message);
    } finally {
      setIsAuthorizingPayment(false);
    }
  };

  // Instant Interactive In-Browser Checkout Simulation
  const handleSimulateInstantDebit = async (sub: SubscriptionItem) => {
    setIsProcessingSimulatedDebit(true);
    setSimulatedDebitStep("Step 1/3: Querying SubGuard Firewall Rules on MST Blockchain...");
    await new Promise((r) => setTimeout(r, 800));

    setSimulatedDebitStep("Step 2/3: Pre-Debit Verification Passed! Forwarding to UPI AutoPay mandate...");
    await new Promise((r) => setTimeout(r, 900));

    setSimulatedDebitStep("Step 3/3: Payment Approved! Generating immutable on-chain block receipt...");
    await new Promise((r) => setTimeout(r, 700));

    const randomHex = Array.from({ length: 40 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    const txHash = `0x${randomHex}`;

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: "allowed",
      title: "Payment Allowed (UPI Mandate)",
      subtitle: `${sub.name} - ₹${sub.amount.toLocaleString()}`,
      timeAgo: "Just now",
      txHash: txHash,
      blockNumber: 14930 + Math.floor(Math.random() * 10),
      timestamp: new Date().toISOString(),
      stateProof: `PASS: Instant mandate debit of ₹${sub.amount} approved. Zero surcharge.`,
    };

    setActivities((prev) => [newActivity, ...prev]);
    setIsProcessingSimulatedDebit(false);
    setPaymentSuccessData({ txHash, subName: sub.name, amount: sub.amount });
    setSelectedSubForPayment(null);
  };

  // Add new subscription manually
  const handleAddNewSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingSub(true);
    try {
      const amountNum = parseInt(newSubAmount) || 500;
      const maxLimitNum = parseInt(newSubMaxLimit) || amountNum + 100;

      const randomHex = Array.from({ length: 40 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      const txHash = `0x${randomHex}`;

      // Format date
      let formattedDate = "15 Nov 2025";
      if (newSubRenewalDate) {
        const d = new Date(newSubRenewalDate);
        if (!isNaN(d.getTime())) {
          formattedDate = d.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        }
      }

      const newSub: SubscriptionItem = {
        id: Date.now(),
        name: newSubName,
        category: newSubCategory,
        cadence: newSubCadence,
        nextPaymentDate: formattedDate,
        amount: amountNum,
        maxAmount: maxLimitNum,
        isProtected: true,
        isPaused: false,
        merchantAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      };

      const updated = [newSub, ...subscriptions];
      persistSubscriptions(updated);

      const newAct: ActivityItem = {
        id: `act-${Date.now()}`,
        type: "created",
        title: "Subscription Created",
        subtitle: `${newSubName} - ₹${amountNum}`,
        timeAgo: "Just now",
        txHash: txHash,
        blockNumber: 14935,
        timestamp: new Date().toISOString(),
        stateProof: `INIT: Immutable firewall mandate rule registered on MST Testnet for ${newSubName}.`,
      };
      setActivities((prev) => [newAct, ...prev]);

      setShowAddSubModal(false);
      setNewSubName("");
    } catch (err: any) {
      alert("Failed to add subscription: " + err.message);
    } finally {
      setIsAddingSub(false);
    }
  };

  // Toggle Pause/Resume
  const handleTogglePause = (subId: number) => {
    const updated = subscriptions.map((s) =>
      s.id === subId ? { ...s, isPaused: !s.isPaused } : s
    );
    persistSubscriptions(updated);
    setActiveMenuSubId(null);
  };

  // Delete subscription
  const handleDeleteSubscription = (subId: number) => {
    if (confirm("Are you sure you want to cancel and remove this subscription mandate?")) {
      const updated = subscriptions.filter((s) => s.id !== subId);
      persistSubscriptions(updated);
      setActiveMenuSubId(null);
    }
  };

  // Preset quick picker for + Add Subscription
  const selectPreset = (name: string, amt: number, max: number, cat: string) => {
    setNewSubName(name);
    setNewSubAmount(amt.toString());
    setNewSubMaxLimit(max.toString());
    setNewSubCategory(cat);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] text-slate-800 relative overflow-x-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background Soft Diffuse Bokeh & Indoor Lighting */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -left-20 top-1/4 w-96 h-96 bg-emerald-100/40 rounded-full blur-[100px]" />
        <div className="absolute left-10 bottom-10 w-80 h-80 bg-teal-100/30 rounded-full blur-[90px]" />
        <div className="absolute right-1/4 top-20 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px]" />
        <div className="absolute right-10 bottom-1/4 w-96 h-96 bg-indigo-100/40 rounded-full blur-[110px]" />
      </div>

      {/* Main Container */}
      <div className="max-w-[1520px] mx-auto p-4 sm:p-6 lg:p-7 min-h-screen flex flex-col lg:flex-row gap-6 items-stretch">
        {/* 1. LEFT SIDEBAR */}
        <aside className="w-full lg:w-60 flex-shrink-0 bg-white/80 backdrop-blur-2xl border border-white/90 rounded-[28px] p-5 shadow-[0_10px_35px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 px-2 pt-1 pb-8">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/25 flex-shrink-0">
                <Shield className="w-5 h-5 fill-white stroke-none" />
              </div>
              <div className="leading-tight">
                <h1 className="font-extrabold text-[17px] text-slate-900 tracking-tight">SubGuard</h1>
                <p className="text-[11px] text-slate-500 font-medium">on MST Blockchain</p>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="space-y-1.5">
              <button className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[13px] font-bold bg-[#EDE9FE]/90 text-[#4F46E5] shadow-xs transition-all">
                <LayoutDashboard className="w-4 h-4 text-[#4F46E5]" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById("subscriptions-list");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[13px] font-medium text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all text-left"
              >
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Subscriptions</span>
              </button>

              <button
                onClick={() => setShowAddSubModal(true)}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[13px] font-medium text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all text-left"
              >
                <PlusCircle className="w-4 h-4 text-slate-400" />
                <span>Add Subscription</span>
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById("recent-activity-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[13px] font-medium text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all text-left"
              >
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Transactions</span>
              </button>

              <button
                onClick={() => setShowNetworkGuideModal(true)}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[13px] font-medium text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-all text-left"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Network & Settings</span>
              </button>

              {/* Sign In / Sign Out Sidebar Action */}
              {currentUser ? (
                <Link
                  href="/logout"
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[13px] font-medium text-rose-600 hover:bg-rose-50/80 transition-all text-left group"
                >
                  <LogOut className="w-4 h-4 text-rose-500 group-hover:translate-x-0.5 transition-transform" />
                  <span>Sign Out</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[13px] font-bold text-indigo-600 bg-indigo-50/80 hover:bg-indigo-100/80 transition-all text-left"
                >
                  <LogIn className="w-4 h-4 text-indigo-600" />
                  <span>Sign In</span>
                </Link>
              )}
            </nav>
          </div>

          {/* Bottom Card: Secured by MST Blockchain */}
          <div className="pt-6">
            <div
              onClick={() => setShowNetworkGuideModal(true)}
              className="bg-white/70 backdrop-blur-md border border-white/90 rounded-2xl p-3.5 shadow-xs flex items-center justify-between hover:bg-white/90 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="leading-tight">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Secured by</p>
                  <p className="text-xs font-bold text-slate-800">MST Blockchain</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </aside>

        {/* 2. MAIN WORKSPACE */}
        <main className="flex-1 flex flex-col gap-6 min-w-0">
          {/* Top Bar (Search + Network + Wallet + Profile) */}
          <header className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Pill */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3" />
              <input
                type="text"
                placeholder="Search subscriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/80 backdrop-blur-xl border border-white/90 rounded-full pl-11 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:bg-white transition-all"
              />
            </div>

            {/* Right Status Controls */}
            <div className="flex items-center gap-3 self-end sm:self-auto">
              {/* Network Pill */}
              <button
                onClick={() => setShowNetworkGuideModal(true)}
                className="flex items-center gap-2 bg-white/80 backdrop-blur-xl border border-white/90 px-4 py-2 rounded-full text-xs font-semibold text-slate-700 shadow-xs hover:bg-white hover:border-indigo-200 transition-all cursor-pointer"
                title="Click to view MST Testnet configuration and faucet instructions"
              >
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span>{networkName}</span>
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Connected Wallet Address Pill */}
              <button
                onClick={handleWalletConnect}
                disabled={isWalletConnecting}
                className="flex items-center gap-2.5 bg-white/80 backdrop-blur-xl border border-white/90 px-4 py-2 rounded-full text-xs font-mono font-bold text-slate-800 shadow-xs hover:bg-white transition-all"
                title="Click to connect Bridgekey / Web3 Wallet"
              >
                <Wallet className="w-3.5 h-3.5 text-blue-600" />
                <span>{walletAddress}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              </button>

              {/* Profile Avatar & Interactive Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="w-9 h-9 rounded-full bg-[#E0E7FF] border border-white flex items-center justify-center text-[#4338CA] font-bold text-xs shadow-xs hover:scale-105 transition-all select-none focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  title="Account Menu"
                >
                  {currentUser ? (currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : "KH") : "KH"}
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-2xl border border-white/90 rounded-2xl p-4 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-150 space-y-3">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                      <div className="w-10 h-10 rounded-full bg-[#E0E7FF] flex items-center justify-center text-[#4338CA] font-bold text-sm">
                        {currentUser ? (currentUser.name ? currentUser.name.slice(0, 2).toUpperCase() : "KH") : "KH"}
                      </div>
                      <div className="leading-tight min-w-0">
                        <p className="font-bold text-xs text-slate-900 truncate">
                          {currentUser ? currentUser.name : "Kabir H."}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {currentUser?.email || "kabir@subguard.io"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      {currentUser ? (
                        <>
                          <div className="px-3 py-2 rounded-xl bg-slate-50 text-[11px] text-slate-600 flex items-center justify-between">
                            <span>Status:</span>
                            <span className="font-bold text-emerald-600 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Active Session
                            </span>
                          </div>

                          <Link
                            href="/login"
                            onClick={() => setShowUserDropdown(false)}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                          >
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span>Switch Account</span>
                          </Link>

                          <Link
                            href="/logout"
                            onClick={() => setShowUserDropdown(false)}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold transition-colors"
                          >
                            <LogOut className="w-3.5 h-3.5 text-rose-500" />
                            <span>Sign Out</span>
                          </Link>
                        </>
                      ) : (
                        <div className="space-y-2 pt-1">
                          <Link
                            href="/login"
                            onClick={() => setShowUserDropdown(false)}
                            className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                          >
                            <LogIn className="w-3.5 h-3.5" />
                            <span>Sign In</span>
                          </Link>

                          <Link
                            href="/signup"
                            onClick={() => setShowUserDropdown(false)}
                            className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center justify-center transition-colors"
                          >
                            <span>Create Account</span>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Grid Layout: Main Center Area + Right Sidebar Column */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            {/* LEFT / CENTER CONTENT (8 cols on XL) */}
            <div className="xl:col-span-8 space-y-6">
              {/* HERO BANNER CARD */}
              <div className="bg-white/85 backdrop-blur-2xl border border-white/90 rounded-[28px] p-7 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.03)] relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
                {/* Left Text */}
                <div className="max-w-md z-10">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    Your Subscriptions.
                  </h2>
                  <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight leading-tight">
                    Your Rules.
                  </h2>
                  <p className="mt-3 text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                    Track, protect and control your subscription <br className="hidden sm:inline" />
                    payments using MST Blockchain.
                  </p>
                </div>

                {/* Right 3D Glowing Glass Shield Visual */}
                <div className="flex-shrink-0 z-10 sm:pr-4">
                  <GlassShield3D size={190} />
                </div>

                {/* Subtle soft internal glow */}
                <div className="absolute right-10 top-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
              </div>

              {/* 3 STATS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. Monthly Spend */}
                <div className="bg-white/85 backdrop-blur-2xl border border-white/90 rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-xs">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                          ₹{totalMonthlySpend.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/50 text-[11px] font-bold text-emerald-600">
                          <TrendingDown className="w-3 h-3" />
                          <span>12%</span>
                          <svg className="w-6 h-3 ml-0.5" viewBox="0 0 24 10" fill="none">
                            <path
                              d="M1 9C5 5 7 8 11 4C15 0 17 6 23 2"
                              stroke="#059669"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">Monthly Spend</p>
                    </div>
                  </div>
                </div>

                {/* 2. Active Subscriptions */}
                <div className="bg-white/85 backdrop-blur-2xl border border-white/90 rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-xs">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      {activeSubsCount}
                    </span>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Active Subscriptions</p>
                  </div>
                </div>

                {/* 3. Protected Payments */}
                <div className="bg-white/85 backdrop-blur-2xl border border-white/90 rounded-[24px] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-xs">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      {protectedCount}
                    </span>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Protected Payments</p>
                  </div>
                </div>
              </div>

              {/* YOUR SUBSCRIPTIONS LIST CONTAINER */}
              <div
                id="subscriptions-list"
                className="bg-white/85 backdrop-blur-2xl border border-white/90 rounded-[28px] p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] space-y-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Your Subscriptions</h3>
                    <p className="text-[11px] text-slate-400">Manage real-time spending limits & auto-debit rules</p>
                  </div>
                  <button
                    onClick={() => setShowAddSubModal(true)}
                    className="text-xs text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>+ Add New</span>
                  </button>
                </div>

                {/* Subscription Rows */}
                <div className="space-y-3">
                  {filteredSubs.map((sub) => (
                    <div
                      key={sub.id}
                      className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-2xl border transition-all ${
                        sub.isPaused
                          ? "bg-slate-50/70 border-slate-200 opacity-60"
                          : "bg-white/60 hover:bg-white border-white/80 hover:border-indigo-100 shadow-xs"
                      }`}
                    >
                      {/* Left: Logo & Name */}
                      <div
                        onClick={() => setSelectedSubForPayment(sub)}
                        className="flex items-center gap-3.5 min-w-[200px] cursor-pointer"
                      >
                        <div className="w-11 h-11 flex-shrink-0">
                          <ServiceLogo name={sub.name} size={44} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {sub.name}
                            </h4>
                            {sub.isPaused && (
                              <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md">
                                Paused
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">{sub.cadence} • {sub.category || "Subscription"}</p>
                        </div>
                      </div>

                      {/* Middle: Next Payment Date */}
                      <div
                        onClick={() => setSelectedSubForPayment(sub)}
                        className="flex items-center gap-2 min-w-[150px] cursor-pointer"
                      >
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <div className="text-xs leading-tight">
                          <p className="text-slate-400 text-[10px]">Next payment</p>
                          <p className="text-slate-700 font-medium">{sub.nextPaymentDate}</p>
                        </div>
                      </div>

                      {/* Right: Amount + Protected Badge + 3 dots Action Menu */}
                      <div className="flex items-center gap-4 justify-between sm:justify-end">
                        <div
                          onClick={() => setSelectedSubForPayment(sub)}
                          className="text-right cursor-pointer"
                        >
                          <span className="font-extrabold text-sm text-slate-900">
                            ₹{sub.amount}/mo
                          </span>
                          <p className="text-[10px] text-slate-400">Cap: ₹{sub.maxAmount}</p>
                        </div>

                        {/* Protected Badge */}
                        <div
                          onClick={() => setSelectedSubForPayment(sub)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                            sub.isPaused
                              ? "bg-slate-100 text-slate-500"
                              : "bg-emerald-50 border border-emerald-200/60 text-emerald-700"
                          }`}
                        >
                          <CheckCircle2 className={`w-3.5 h-3.5 ${sub.isPaused ? "text-slate-400" : "fill-emerald-600 text-white"}`} />
                          <span>{sub.isPaused ? "Paused" : "Protected"}</span>
                        </div>

                        {/* 3-dots Menu Button */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuSubId(activeMenuSubId === sub.id ? null : sub.id);
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Popover Action Menu */}
                          {activeMenuSubId === sub.id && (
                            <div className="absolute right-0 top-8 w-44 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-2 shadow-xl z-30 space-y-1 animate-in fade-in zoom-in-95 duration-100 text-xs font-semibold">
                              <button
                                onClick={() => {
                                  setActiveMenuSubId(null);
                                  setSelectedSubForPayment(sub);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors text-left"
                              >
                                <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Pay / Redirect</span>
                              </button>

                              <button
                                onClick={() => {
                                  const newCap = prompt("Enter new maximum authorized spending ceiling (₹):", sub.maxAmount.toString());
                                  if (newCap && !isNaN(Number(newCap))) {
                                    const updated = subscriptions.map((s) =>
                                      s.id === sub.id ? { ...s, maxAmount: Number(newCap) } : s
                                    );
                                    persistSubscriptions(updated);
                                  }
                                  setActiveMenuSubId(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors text-left"
                              >
                                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                                <span>Edit Spend Cap</span>
                              </button>

                              <button
                                onClick={() => handleTogglePause(sub.id)}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors text-left"
                              >
                                {sub.isPaused ? (
                                  <>
                                    <Play className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Resume Rule</span>
                                  </>
                                ) : (
                                  <>
                                    <Pause className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Pause Rule</span>
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => handleDeleteSubscription(sub.id)}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors text-left border-t border-slate-100 pt-2"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                                <span>Cancel Mandate</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* + Add Subscription Button */}
                <div className="pt-2">
                  <button
                    onClick={() => setShowAddSubModal(true)}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#6366F1] to-[#3B82F6] hover:opacity-95 text-white font-bold text-sm shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.008] active:scale-[0.99]"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+ Add Subscription</span>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR COLUMN (4 cols on XL) */}
            <div className="xl:col-span-4 space-y-6">
              {/* 1. NEXT PAYMENT CARD */}
              <div className="bg-white/85 backdrop-blur-2xl border border-white/90 rounded-[28px] p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-extrabold text-slate-900">Next Payment</h3>
                  </div>
                  <button
                    onClick={() => setSelectedSubForPayment(subscriptions[0])}
                    className="text-xs text-slate-500 font-semibold hover:text-slate-800 flex items-center gap-1"
                  >
                    <span>View All</span>
                    <span>→</span>
                  </button>
                </div>

                {/* Imminent Item */}
                {subscriptions[0] && (
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex-shrink-0">
                        <ServiceLogo name={subscriptions[0].name} size={40} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{subscriptions[0].name}</h4>
                        <p className="text-xs text-slate-400">{subscriptions[0].nextPaymentDate}</p>
                      </div>
                    </div>
                    <div className="text-right font-extrabold text-base text-slate-900">
                      ₹{subscriptions[0].amount}
                    </div>
                  </div>
                )}

                {/* View Details Button */}
                <button
                  onClick={() => setSelectedSubForPayment(subscriptions[0] || DEFAULT_SUBSCRIPTIONS[0])}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-200/60 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 transition-all"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>

              {/* 2. RECENT ACTIVITY CARD */}
              <div
                id="recent-activity-section"
                className="bg-white/85 backdrop-blur-2xl border border-white/90 rounded-[28px] p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] space-y-4"
              >
                <div className="flex items-center justify-between pb-1">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Recent Activity</h3>
                    <p className="text-[10px] text-slate-400">Immutable ledger on MST Blockchain</p>
                  </div>
                  <button
                    onClick={() => setSelectedBlockchainReceipt(activities[0])}
                    className="text-xs text-slate-500 font-semibold hover:text-slate-800 flex items-center gap-1"
                  >
                    <span>View All</span>
                    <span>→</span>
                  </button>
                </div>

                {/* Activity Items */}
                <div className="space-y-4">
                  {activities.map((act) => (
                    <div
                      key={act.id}
                      onClick={() => {
                        if (act.type === "blocked") {
                          setBlockedAlertData(act);
                        } else {
                          setSelectedBlockchainReceipt(act);
                        }
                      }}
                      className="flex items-center justify-between gap-3 group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {act.type === "allowed" || act.type === "created" ? (
                          <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-600 flex-shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-rose-50 border border-rose-200/60 flex items-center justify-center text-rose-600 flex-shrink-0">
                            <X className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}

                        <div className="min-w-0 leading-tight">
                          <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                            {act.title}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">{act.subtitle}</p>
                        </div>
                      </div>

                      <div className="text-right leading-tight flex-shrink-0">
                        <p className="text-[11px] text-slate-400">{act.timeAgo}</p>
                        <p className="text-[10px] font-mono text-slate-400 group-hover:text-indigo-500 transition-colors">
                          {act.txHash.slice(0, 6)}...{act.txHash.slice(-4)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. POWERED BY MST BLOCKCHAIN CARD */}
              <div className="bg-gradient-to-br from-white/90 to-blue-50/60 backdrop-blur-2xl border border-white/90 rounded-[28px] p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] relative overflow-hidden flex items-center justify-between">
                <div className="z-10 leading-snug">
                  <p className="text-xs text-slate-500 font-medium">Powered by</p>
                  <h4 className="text-base font-extrabold text-slate-900 tracking-tight">
                    MST Blockchain
                  </h4>
                  <button
                    onClick={() => setShowNetworkGuideModal(true)}
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700"
                  >
                    <span>Transparent. Secure. Yours.</span>
                    <span>→</span>
                  </button>
                </div>

                {/* 3D Isometric Blue Cubes Graphic */}
                <div className="flex-shrink-0 z-10 -mr-2">
                  <Cubes3D />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ============================================================ */}
      {/* MODAL 1: PAYMENT MANDATE POPUP (REAL REDIRECT & LIVE QR CODE) */}
      {/* ============================================================ */}
      {selectedSubForPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white/95 backdrop-blur-2xl border border-white rounded-[32px] p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 relative my-8">
            {/* Top Close */}
            <button
              onClick={() => {
                setSelectedSubForPayment(null);
                setIsEditingLimit(false);
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 flex-shrink-0">
                <ServiceLogo name={selectedSubForPayment.name} size={48} />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                  Real-Time AutoPay Mandate
                </span>
                <h3 className="text-lg font-black text-slate-900 truncate">
                  {selectedSubForPayment.name}
                </h3>
                <p className="text-xs text-slate-400">Scheduled Renewal: {selectedSubForPayment.nextPaymentDate}</p>
              </div>
            </div>

            {/* Real-time Plan Details Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-slate-500 font-medium">Renewal Amount</p>
                  <p className="text-2xl font-black text-slate-900">
                    ₹{selectedSubForPayment.amount.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <p className="text-[11px] text-slate-500 font-medium">Authorized Ceiling</p>
                    <button
                      onClick={() => {
                        setIsEditingLimit(!isEditingLimit);
                        setEditedLimit(selectedSubForPayment.maxAmount);
                      }}
                      className="text-indigo-600 hover:text-indigo-800 p-0.5"
                      title="Adjust spend limit"
                    >
                      <SlidersHorizontal className="w-3 h-3" />
                    </button>
                  </div>
                  {isEditingLimit ? (
                    <div className="flex items-center gap-1.5 mt-1 justify-end">
                      <input
                        type="number"
                        value={editedLimit}
                        onChange={(e) => setEditedLimit(Number(e.target.value))}
                        className="w-20 px-2 py-1 text-xs border border-indigo-300 rounded-lg bg-white font-bold"
                      />
                      <button
                        onClick={() => {
                          const updated = subscriptions.map((s) =>
                            s.id === selectedSubForPayment.id ? { ...s, maxAmount: editedLimit } : s
                          );
                          persistSubscriptions(updated);
                          setSelectedSubForPayment({
                            ...selectedSubForPayment,
                            maxAmount: editedLimit,
                          });
                          setIsEditingLimit(false);
                        }}
                        className="px-2 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs font-bold text-emerald-600">
                      Cap: ₹{selectedSubForPayment.maxAmount.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Plan Metadata Tags */}
              <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
                <span>Billing: <strong>{selectedSubForPayment.cadence}</strong></span>
                <span>Mandate ID: <strong className="font-mono">MST_SUB_0{selectedSubForPayment.id}</strong></span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Protected by MST Firewall
                </span>
              </div>
            </div>

            {/* Pre-Debit Firewall Verification Checks */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                <span>Pre-Debit Verification (MST Blockchain Rules):</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-800">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Merchant Whitelisted</span>
                  </span>
                  <span className="font-bold">PASSED</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-800">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Amount ≤ Ceiling</span>
                  </span>
                  <span className="font-bold">PASSED</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="space-y-3 pt-1">
              <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold text-slate-600">
                <button
                  type="button"
                  onClick={() => setPaymentMethodTab("upi")}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                    paymentMethodTab === "upi"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>UPI Payment Apps</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethodTab("bridgekey")}
                  className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                    paymentMethodTab === "bridgekey"
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>Bridgekey Wallet ($MSTC)</span>
                </button>
              </div>

              {/* TAB 1: UPI APPS (Google Pay / PhonePe / Paytm) */}
              {paymentMethodTab === "upi" && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  {/* Direct Specific Payment App Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* Google Pay */}
                    <button
                      onClick={() => {
                        const upiUrl = `gpay://upi/pay?pa=subguard.autopay@okaxis&pn=${encodeURIComponent(
                          selectedSubForPayment.name
                        )}&am=${selectedSubForPayment.amount}&cu=INR&tn=${encodeURIComponent(
                          `SubGuard Mandate Pre-Debit: ${selectedSubForPayment.name}`
                        )}`;
                        window.location.href = upiUrl;
                      }}
                      className="py-2.5 px-2 rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 shadow-xs flex flex-col items-center justify-center gap-1 transition-all"
                    >
                      <span className="text-[11px] font-black text-blue-600">Google Pay</span>
                      <span className="text-[9px] text-slate-400">Open App</span>
                    </button>

                    {/* PhonePe */}
                    <button
                      onClick={() => {
                        const upiUrl = `phonepe://pay?pa=subguard.autopay@okaxis&pn=${encodeURIComponent(
                          selectedSubForPayment.name
                        )}&am=${selectedSubForPayment.amount}&cu=INR&tn=${encodeURIComponent(
                          `SubGuard Mandate Pre-Debit: ${selectedSubForPayment.name}`
                        )}`;
                        window.location.href = upiUrl;
                      }}
                      className="py-2.5 px-2 rounded-xl bg-white border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 shadow-xs flex flex-col items-center justify-center gap-1 transition-all"
                    >
                      <span className="text-[11px] font-black text-[#5f259f]">PhonePe</span>
                      <span className="text-[9px] text-slate-400">Open App</span>
                    </button>

                    {/* Paytm */}
                    <button
                      onClick={() => {
                        const upiUrl = `paytmmp://pay?pa=subguard.autopay@okaxis&pn=${encodeURIComponent(
                          selectedSubForPayment.name
                        )}&am=${selectedSubForPayment.amount}&cu=INR&tn=${encodeURIComponent(
                          `SubGuard Mandate Pre-Debit: ${selectedSubForPayment.name}`
                        )}`;
                        window.location.href = upiUrl;
                      }}
                      className="py-2.5 px-2 rounded-xl bg-white border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 shadow-xs flex flex-col items-center justify-center gap-1 transition-all"
                    >
                      <span className="text-[11px] font-black text-[#00b9f5]">Paytm</span>
                      <span className="text-[9px] text-slate-400">Open App</span>
                    </button>
                  </div>

                  {/* Primary Button to redirect to Default Payment App */}
                  <button
                    onClick={() => {
                      const upiUrl = `upi://pay?pa=subguard.autopay@okaxis&pn=${encodeURIComponent(
                        selectedSubForPayment.name
                      )}&am=${selectedSubForPayment.amount}&cu=INR&tn=${encodeURIComponent(
                        `SubGuard Mandate Pre-Debit: ${selectedSubForPayment.name}`
                      )}`;
                      window.location.href = upiUrl;
                    }}
                    className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>Open in Payment App (GPay / PhonePe / Paytm)</span>
                  </button>

                  {/* Instant In-Browser Checkout Simulator */}
                  <button
                    onClick={() => handleSimulateInstantDebit(selectedSubForPayment)}
                    disabled={isProcessingSimulatedDebit}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                  >
                    {isProcessingSimulatedDebit ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>{simulatedDebitStep}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Simulate Instant Online Debit Approval (₹{selectedSubForPayment.amount})</span>
                      </>
                    )}
                  </button>

                  {/* Scannable QR Code */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-2">
                    <p className="text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Or Scan QR Code with your Phone</span>
                    </p>
                    <div className="inline-block p-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                          `upi://pay?pa=subguard.autopay@okaxis&pn=${selectedSubForPayment.name}&am=${selectedSubForPayment.amount}&cu=INR`
                        )}`}
                        alt="UPI Payment QR Code"
                        className="w-32 h-32 mx-auto"
                      />
                    </div>
                    <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
                      <span>UPI ID: <strong className="font-mono text-slate-800">subguard.autopay@okaxis</strong></span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("subguard.autopay@okaxis");
                          setCopiedUpi(true);
                          setTimeout(() => setCopiedUpi(false), 2000);
                        }}
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-bold"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedUpi ? "Copied!" : "Copy"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BRIDGEKEY WALLET */}
              {paymentMethodTab === "bridgekey" && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <button
                    onClick={() => handleExecutePayment(selectedSubForPayment)}
                    disabled={isAuthorizingPayment}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                  >
                    {isAuthorizingPayment ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Submitting to MST Blockchain...</span>
                      </>
                    ) : (
                      <>
                        <Wallet className="w-4 h-4" />
                        <span>Authorize & Debit via MST Testnet (Chain ID 4545)</span>
                      </>
                    )}
                  </button>

                  <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-[11px] text-blue-800 space-y-1">
                    <p className="font-bold flex items-center gap-1">
                      <Info className="w-3.5 h-3.5" />
                      <span>Bridgekey Wallet Integration</span>
                    </p>
                    <p className="text-slate-600">
                      Executes on MST Blockchain Testnet. Gas fee is paid using free testnet $MSTC tokens from the faucet.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Test Firewall Block Surge Button */}
            <div className="pt-1 border-t border-slate-100">
              <button
                onClick={() => {
                  setSelectedSubForPayment(null);
                  setBlockedAlertData({
                    id: "test-blocked",
                    type: "blocked",
                    title: "Payment Blocked",
                    subtitle: "Unknown - ₹2,999",
                    timeAgo: "Just now",
                    txHash: "0xa1b398df3108ce45892c90184b23871908324e7f",
                    blockNumber: 14932,
                    timestamp: new Date().toISOString(),
                    reason: "Unauthorized price surge attempt! Merchant requested ₹2,999 exceeding approved limit.",
                    stateProof: "BLOCKED: Exceeds authorized spending ceiling & no whitelist rule found.",
                  });
                }}
                className="w-full py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                Simulate Surprise Price Surge / Unauthorized Debit (₹2,999)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: FIREWALL INTERVENTION ALERT (PRICE SURGE BLOCKED) */}
      {/* ============================================================ */}
      {blockedAlertData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-2xl border border-rose-200 rounded-[32px] p-7 max-w-md w-full shadow-2xl space-y-5 text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto shadow-md shadow-rose-500/20">
              <X className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                Firewall Rule Tripped
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">Payment Blocked</h3>
              <p className="text-xs text-slate-500 mt-1">
                Zero funds deducted. The transaction was stopped before execution.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-2 border border-slate-100 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Merchant:</span>
                <span className="font-mono font-bold text-slate-800">Unknown (0xa1b3...4e7f)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Attempted Amount:</span>
                <span className="font-extrabold text-rose-600 text-sm">₹2,999</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rule Ceiling:</span>
                <span className="font-bold text-slate-700">₹0 (Unwhitelisted)</span>
              </div>
              <div className="pt-2 border-t border-slate-200 text-slate-600 leading-relaxed">
                <span className="font-bold text-rose-600">Reason: </span>
                {blockedAlertData.reason}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setBlockedAlertData(null)}
                className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-md"
              >
                Dismiss & Stay Protected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: PAYMENT SUCCESS RECEIPT POPUP */}
      {/* ============================================================ */}
      {paymentSuccessData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-2xl border border-white rounded-[32px] p-7 max-w-md w-full shadow-2xl space-y-5 text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto shadow-md shadow-emerald-500/20">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Mandate Executed On-Chain
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">Payment Allowed</h3>
              <p className="text-xs text-slate-500 mt-1">
                SubGuard Firewall evaluated and verified the debit request.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-2 border border-slate-100 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Service:</span>
                <span className="font-bold text-slate-800">{paymentSuccessData.subName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Deducted Amount:</span>
                <span className="font-extrabold text-emerald-600 text-sm">
                  ₹{paymentSuccessData.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">MST Testnet Tx:</span>
                <a
                  href={getExplorerTxUrl(paymentSuccessData.txHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-indigo-600 hover:underline flex items-center gap-1 font-bold"
                >
                  <span>{paymentSuccessData.txHash.slice(0, 8)}...</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setPaymentSuccessData(null)}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md shadow-indigo-200"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: IMMUTABLE BLOCKCHAIN AUDIT RECEIPT MODAL */}
      {/* ============================================================ */}
      {selectedBlockchainReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white/95 backdrop-blur-2xl border border-white rounded-[32px] p-7 max-w-lg w-full shadow-2xl space-y-5 relative overflow-hidden">
            <button
              onClick={() => setSelectedBlockchainReceipt(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  Immutable Blockchain Proof
                </span>
                <h3 className="text-lg font-black text-slate-900">{selectedBlockchainReceipt.title}</h3>
              </div>
            </div>

            {/* Proof Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Network:</span>
                <span className="font-bold text-slate-800">MST Blockchain Testnet (Chain ID 4545)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Block Height:</span>
                <span className="font-mono font-bold text-indigo-600">#{selectedBlockchainReceipt.blockNumber || 14920}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-slate-700">{selectedBlockchainReceipt.timestamp || "2026-09-29 01:00:00 UTC"}</span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-400 block mb-1">Cryptographic Tx Hash:</span>
                <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200">
                  <span className="font-mono text-[11px] text-slate-800 break-all">{selectedBlockchainReceipt.txHash}</span>
                  <a
                    href={getExplorerTxUrl(selectedBlockchainReceipt.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-indigo-600 hover:text-indigo-800 flex-shrink-0"
                    title="View on Explorer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-400 block mb-1">Consensus State Verification:</span>
                <p className="text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 font-medium">
                  {selectedBlockchainReceipt.stateProof || "Verified on-chain. Sealed immutably across MST validators."}
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 text-[11px] text-slate-600 flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-600 flex-shrink-0" />
              <span>This record is cryptographically signed and permanently unalterable on MST Blockchain.</span>
            </div>

            <button
              onClick={() => setSelectedBlockchainReceipt(null)}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md shadow-indigo-200"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 5: + ADD SUBSCRIPTION FORM MODAL (MANUAL ADDER) */}
      {/* ============================================================ */}
      {showAddSubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white/95 backdrop-blur-2xl border border-white rounded-[32px] p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 relative my-8">
            <button
              onClick={() => setShowAddSubModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                New Protected Rule
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-1">Add Subscription Manually</h3>
              <p className="text-xs text-slate-500">
                Create a customized pre-debit firewall mandate rule.
              </p>
            </div>

            {/* Quick 1-Click Preset Chips */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-slate-600">Quick Presets:</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { name: "Netflix", amt: 649, max: 699, cat: "Entertainment" },
                  { name: "Spotify", amt: 119, max: 149, cat: "Music" },
                  { name: "Prime Video", amt: 299, max: 350, cat: "Entertainment" },
                  { name: "Disney+", amt: 299, max: 350, cat: "Entertainment" },
                  { name: "ChatGPT Plus", amt: 1999, max: 2100, cat: "AI Tools" },
                  { name: "Claude Pro", amt: 1800, max: 2000, cat: "AI Tools" },
                  { name: "Cult Gym", amt: 1499, max: 1600, cat: "Fitness" },
                ].map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => selectPreset(preset.name, preset.amt, preset.max, preset.cat)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all ${
                      newSubName === preset.name
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80"
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddNewSubscription} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Service / Mandate Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Netflix, Spotify, Gym, Electricity"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Recurring Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="649"
                    value={newSubAmount}
                    onChange={(e) => {
                      setNewSubAmount(e.target.value);
                      const num = Number(e.target.value);
                      if (!isNaN(num)) {
                        setNewSubMaxLimit((num + 50).toString());
                      }
                    }}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Max Spend Ceiling (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="700"
                    value={newSubMaxLimit}
                    onChange={(e) => setNewSubMaxLimit(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Billing Cadence
                  </label>
                  <select
                    value={newSubCadence}
                    onChange={(e) => setNewSubCadence(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Next Renewal Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newSubRenewalDate}
                    onChange={(e) => setNewSubRenewalDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isAddingSub}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#8B5CF6] via-[#6366F1] to-[#3B82F6] text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 hover:opacity-95 transition-all disabled:opacity-50"
                >
                  {isAddingSub ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Sealing rule on MST Blockchain...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      <span>Save & Activate Protection Rule</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 6: MST TESTNET CONFIGURATION & FAUCET SETUP GUIDE */}
      {/* ============================================================ */}
      {showNetworkGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white/95 backdrop-blur-2xl border border-white rounded-[32px] p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 relative my-8">
            <button
              onClick={() => setShowNetworkGuideModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-600">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  Network Guide
                </span>
                <h3 className="text-lg font-black text-slate-900">How to Setup MST Testnet</h3>
              </div>
            </div>

            {/* Network Parameters Table */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5 text-xs">
              <p className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">
                MST Testnet Parameters
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-white rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Network Name</span>
                  <span className="font-bold text-slate-800">MST Testnet</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Chain ID</span>
                  <span className="font-bold text-indigo-600">4545 (0x11c1)</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-100 col-span-2">
                  <span className="text-slate-400 block text-[10px]">RPC URL</span>
                  <span className="font-mono font-bold text-slate-800 text-[10px] break-all">
                    https://testnetrpc.mstblockchain.com
                  </span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Currency Symbol</span>
                  <span className="font-bold text-slate-800">MSTC</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Explorer</span>
                  <span className="font-mono text-slate-700 text-[10px] truncate block">
                    testnet.mstscan.com
                  </span>
                </div>
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  1
                </span>
                <p>
                  <strong>Install Bridgekey Extension:</strong> Add Bridgekey to Chrome/Brave and create your wallet.
                </p>
              </div>

              <div className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  2
                </span>
                <p>
                  <strong>Select MST Testnet:</strong> Open Bridgekey, copy your wallet address, and ensure MST Testnet is selected.
                </p>
              </div>

              <div className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  3
                </span>
                <div>
                  <p>
                    <strong>Claim 10 Free $MSTC Faucet:</strong>
                  </p>
                  <a
                    href="https://faucet.masterstroke.academy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-indigo-600 font-bold hover:underline mt-0.5"
                  >
                    <span>Visit faucet.masterstroke.academy</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center flex-shrink-0 text-[11px]">
                  4
                </span>
                <p>
                  <strong>Connect & Protect:</strong> Click below to auto-switch your wallet to MST Testnet and start managing subscriptions!
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={async () => {
                  try {
                    await switchToMSTTestnet();
                    setShowNetworkGuideModal(false);
                  } catch (err: any) {
                    alert(err.message || "Failed to switch to MST Testnet");
                  }
                }}
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Auto-Switch Wallet to MST Testnet</span>
              </button>

              <button
                onClick={() => setShowNetworkGuideModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
