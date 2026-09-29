"use client";

import { MST_CONFIG } from "@/config/mst";

declare global {
  interface Window {
    ethereum?: any;
    bridgeKey?: any;
  }
}

export interface WalletInfo {
  address: string | null;
  chainId: string | null;
  balance: string;
  isConnected: boolean;
  isMSTTestnet: boolean;
}

export const getBridgeKeyProvider = () => {
  if (typeof window === "undefined") return null;
  return window.bridgeKey || window.ethereum || null;
};

export const hasWallet = (): boolean => {
  return !!getBridgeKeyProvider();
};

export const connectWallet = async (): Promise<string> => {
  const provider = getBridgeKeyProvider();
  if (!provider) {
    throw new Error("BridgeKey was not detected. Please install BridgeKey or an EIP-1193 wallet extension.");
  }

  try {
    const accounts: string[] = await provider.request({
      method: "eth_requestAccounts",
    });

    if (!accounts || accounts.length === 0) {
      throw new Error("Wallet connection was cancelled.");
    }

    const connectedAddress = accounts[0];
    await switchToMSTTestnet();

    return connectedAddress;
  } catch (err: any) {
    if (err.code === 4001) {
      throw new Error("Wallet connection was cancelled by user.");
    }
    throw err;
  }
};

export const disconnectWallet = async (): Promise<void> => {
  // EIP-1193 does not have a native disconnect method; state is cleared in client context
  if (typeof window !== "undefined") {
    localStorage.removeItem("subguard_wallet_connected");
  }
};

export const getConnectedAddress = async (): Promise<string | null> => {
  const provider = getBridgeKeyProvider();
  if (!provider) return null;

  try {
    const accounts: string[] = await provider.request({ method: "eth_accounts" });
    return accounts.length > 0 ? accounts[0] : null;
  } catch {
    return null;
  }
};

export const getNetwork = async (): Promise<string | null> => {
  const provider = getBridgeKeyProvider();
  if (!provider) return null;

  try {
    return await provider.request({ method: "eth_chainId" });
  } catch {
    return null;
  }
};

export const switchToMSTTestnet = async (): Promise<boolean> => {
  const provider = getBridgeKeyProvider();
  if (!provider) return false;

  try {
    const currentChain = await provider.request({ method: "eth_chainId" });
    if (currentChain?.toLowerCase() === MST_CONFIG.chainId.toLowerCase()) {
      return true;
    }

    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: MST_CONFIG.chainId }],
    });
    return true;
  } catch (switchError: any) {
    // 4902 code indicates that the chain has not been added to BridgeKey/MetaMask
    if (switchError.code === 4902 || switchError.data?.originalError?.code === 4902) {
      try {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: MST_CONFIG.chainId,
              chainName: MST_CONFIG.chainName,
              nativeCurrency: MST_CONFIG.nativeCurrency,
              rpcUrls: MST_CONFIG.rpcUrls,
              blockExplorerUrls: MST_CONFIG.blockExplorerUrls,
            },
          ],
        });
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
};

export const getBalance = async (address: string): Promise<string> => {
  const provider = getBridgeKeyProvider();
  if (!provider || !address) return "0.00";

  try {
    const balanceHex: string = await provider.request({
      method: "eth_getBalance",
      params: [address, "latest"],
    });

    const wei = BigInt(balanceHex);
    // Format to 4 decimals in MSTC
    const mstc = Number(wei) / 1e18;
    return mstc.toFixed(2);
  } catch {
    return "0.00";
  }
};
