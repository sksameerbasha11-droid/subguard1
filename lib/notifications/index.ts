export interface SubGuardNotification {
  id: string;
  type:
    | "subscription_created"
    | "payment_allowed"
    | "payment_blocked"
    | "subscription_paused"
    | "subscription_resumed"
    | "transaction_confirmed"
    | "wallet_issue";
  title: string;
  message: string;
  service?: string;
  amount?: string;
  txHash?: string;
  timestamp: string;
  read: boolean;
}

const NOTIFICATIONS_KEY = "subguard_notifications";

export const getStoredNotifications = (): SubGuardNotification[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) {
      return [
        {
          id: "notif_1",
          type: "payment_allowed",
          title: "Payment Allowed",
          message: "Netflix recurring payment of 649 MSTC was successfully verified within your 699 MSTC rule.",
          service: "Netflix",
          amount: "649 MSTC",
          txHash: "0x7a83b24f...c491",
          timestamp: "10 mins ago",
          read: false,
        },
        {
          id: "notif_2",
          type: "payment_blocked",
          title: "Payment Blocked",
          message: "Adobe attempted to charge 2999 MSTC which exceeded your 1999 MSTC maximum authorized limit.",
          service: "Adobe",
          amount: "2999 MSTC",
          txHash: "0x39a1c89f...8e19",
          timestamp: "Yesterday",
          read: true,
        },
        {
          id: "notif_3",
          type: "subscription_created",
          title: "Subscription Created",
          message: "Protected rule for Spotify created and recorded on MST Testnet.",
          service: "Spotify",
          amount: "119 MSTC",
          timestamp: "3 days ago",
          read: true,
        },
      ];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const addNotification = (notif: Omit<SubGuardNotification, "id" | "timestamp" | "read">): void => {
  if (typeof window === "undefined") return;
  const current = getStoredNotifications();
  const newItem: SubGuardNotification = {
    ...notif,
    id: `notif_${Date.now()}`,
    timestamp: "Just now",
    read: false,
  };
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([newItem, ...current]));
};

export const markAllNotificationsAsRead = (): void => {
  if (typeof window === "undefined") return;
  const current = getStoredNotifications();
  const updated = current.map((n) => ({ ...n, read: true }));
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
};
