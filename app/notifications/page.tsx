"use client";

import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { GlassCard } from "@/components/ui/GlassCard";
import {
  Bell,
  CheckCircle2,
  XCircle,
  PauseCircle,
  PlayCircle,
  Check,
  AlertTriangle,
} from "lucide-react";
import {
  getStoredNotifications,
  markAllNotificationsAsRead,
  SubGuardNotification,
} from "@/lib/notifications";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<SubGuardNotification[]>([]);

  useEffect(() => {
    setNotifications(getStoredNotifications());
  }, []);

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getIcon = (type: SubGuardNotification["type"]) => {
    switch (type) {
      case "payment_allowed":
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case "payment_blocked":
        return <XCircle className="w-5 h-5 text-rose-600" />;
      case "subscription_paused":
        return <PauseCircle className="w-5 h-5 text-amber-600" />;
      case "subscription_resumed":
        return <PlayCircle className="w-5 h-5 text-indigo-600" />;
      case "wallet_issue":
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      default:
        return <Bell className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Notifications
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Real-time firewall decisions and blockchain lifecycle events.
            </p>
          </div>

          <button
            onClick={handleMarkAllRead}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-2xs"
          >
            Mark all as read
          </button>
        </div>

        {notifications.length === 0 ? (
          <GlassCard className="p-12 text-center space-y-3">
            <p className="text-base font-bold text-slate-800">You're all caught up.</p>
            <p className="text-xs text-slate-500">No new notifications at this time.</p>
          </GlassCard>
        ) : (
          <div className="space-y-3">
            {notifications.map((notif) => (
              <GlassCard
                key={notif.id}
                className={`p-4 flex items-start gap-4 transition-all ${
                  !notif.read ? "bg-white/80 border-indigo-200/80 shadow-xs" : ""
                }`}
              >
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex-shrink-0">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-sm text-slate-900">{notif.title}</h2>
                    <span className="text-[11px] text-slate-400">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{notif.message}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
