"use client";

export interface UserSession {
  id: string;
  name: string;
  email?: string;
  walletAddress?: string;
  isWalletConnected: boolean;
  createdAt: string;
}

const SESSION_STORAGE_KEY = "subguard_auth_session";

export const getSession = (): UserSession | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const setSession = (session: UserSession): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
};

export const clearSession = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_STORAGE_KEY);
};

export const createWalletSession = (address: string): UserSession => {
  const session: UserSession = {
    id: `usr_${address.slice(2, 10)}`,
    name: `User ${address.slice(0, 6)}`,
    walletAddress: address,
    isWalletConnected: true,
    createdAt: new Date().toISOString(),
  };
  setSession(session);
  return session;
};
