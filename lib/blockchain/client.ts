import { ethers } from "ethers";
import { MST_CONFIG, getExplorerTxUrl } from "@/config/mst";
import SubGuardABI from "@/abi/SubGuard.json";
import { getBridgeKeyProvider } from "@/lib/wallet/bridgekey";

export interface SubscriptionData {
  id: number;
  subscriber: string;
  merchant: string;
  serviceName: string;
  amount: number;
  maxAmount: number;
  billingInterval: number;
  nextPaymentAt: number;
  active: boolean;
  paused: boolean;
  createdAt: number;
}

export function getContractReadOnly(): ethers.Contract {
  const rpc = MST_CONFIG.rpcUrls[0];
  const provider = new ethers.JsonRpcProvider(rpc);
  return new ethers.Contract(MST_CONFIG.contractAddress, SubGuardABI, provider);
}

export async function getContractWithSigner(): Promise<ethers.Contract> {
  const ethereum = getBridgeKeyProvider();
  if (!ethereum) {
    throw new Error("BridgeKey was not detected.");
  }
  const browserProvider = new ethers.BrowserProvider(ethereum);
  const signer = await browserProvider.getSigner();
  return new ethers.Contract(MST_CONFIG.contractAddress, SubGuardABI, signer);
}

/**
 * Creates a subscription on the MST Smart Contract
 */
export async function createSubscription(
  merchant: string,
  serviceName: string,
  amount: number,
  maxAmount: number,
  billingIntervalSeconds: number,
  nextPaymentTimestamp: number
): Promise<{ hash: string; subscriptionId?: number }> {
  const contract = await getContractWithSigner();
  const tx = await contract.createSubscription(
    merchant,
    serviceName,
    amount,
    maxAmount,
    billingIntervalSeconds,
    nextPaymentTimestamp
  );
  const receipt = await tx.wait();

  // Find SubscriptionCreated event from receipt
  let subscriptionId: number | undefined;
  if (receipt && receipt.logs) {
    for (const log of receipt.logs) {
      try {
        const parsed = contract.interface.parseLog(log);
        if (parsed && parsed.name === "SubscriptionCreated") {
          subscriptionId = Number(parsed.args.id);
          break;
        }
      } catch {
        // Skip unparsed log
      }
    }
  }

  return { hash: receipt.hash, subscriptionId };
}

/**
 * Reads a single subscription rule from MST Blockchain
 */
export async function getSubscription(subscriptionId: number): Promise<SubscriptionData> {
  const contract = getContractReadOnly();
  const sub = await contract.getSubscription(subscriptionId);
  return {
    id: Number(sub.id),
    subscriber: sub.subscriber,
    merchant: sub.merchant,
    serviceName: sub.serviceName,
    amount: Number(sub.amount),
    maxAmount: Number(sub.maxAmount),
    billingInterval: Number(sub.billingInterval),
    nextPaymentAt: Number(sub.nextPaymentAt),
    active: sub.active,
    paused: sub.paused,
    createdAt: Number(sub.createdAt),
  };
}

/**
 * Fetches all subscriptions for a given wallet address
 */
export async function getUserSubscriptions(userAddress: string): Promise<SubscriptionData[]> {
  try {
    const contract = getContractReadOnly();
    const subs = await contract.getUserSubscriptions(userAddress);
    return subs.map((sub: any) => ({
      id: Number(sub.id),
      subscriber: sub.subscriber,
      merchant: sub.merchant,
      serviceName: sub.serviceName,
      amount: Number(sub.amount),
      maxAmount: Number(sub.maxAmount),
      billingInterval: Number(sub.billingInterval),
      nextPaymentAt: Number(sub.nextPaymentAt),
      active: sub.active,
      paused: sub.paused,
      createdAt: Number(sub.createdAt),
    }));
  } catch (err) {
    console.warn("Could not fetch on-chain subscriptions from RPC:", err);
    return [];
  }
}

/**
 * Pauses a subscription rule on-chain
 */
export async function pauseSubscription(subscriptionId: number): Promise<string> {
  const contract = await getContractWithSigner();
  const tx = await contract.pauseSubscription(subscriptionId);
  const receipt = await tx.wait();
  return receipt.hash;
}

/**
 * Resumes a paused subscription rule on-chain
 */
export async function resumeSubscription(subscriptionId: number): Promise<string> {
  const contract = await getContractWithSigner();
  const tx = await contract.resumeSubscription(subscriptionId);
  const receipt = await tx.wait();
  return receipt.hash;
}

/**
 * Cancels a subscription rule on-chain
 */
export async function cancelSubscription(subscriptionId: number): Promise<string> {
  const contract = await getContractWithSigner();
  const tx = await contract.cancelSubscription(subscriptionId);
  const receipt = await tx.wait();
  return receipt.hash;
}

/**
 * Merchant or Firewall request payment
 */
export async function requestPayment(
  subscriptionId: number,
  requestedAmount: number
): Promise<{ allowed: boolean; hash?: string; reason?: string }> {
  try {
    const contract = await getContractWithSigner();
    // Pre-check via view call first
    const [allowed, reason] = await contract.isPaymentAllowed(subscriptionId, requestedAmount);
    if (!allowed) {
      return { allowed: false, reason };
    }

    const tx = await contract.requestPayment(subscriptionId, requestedAmount);
    const receipt = await tx.wait();
    return { allowed: true, hash: receipt.hash, reason: "Payment authorized by SubGuard firewall" };
  } catch (err: any) {
    return { allowed: false, reason: err.message || "Payment blocked by smart contract rules" };
  }
}

/**
 * Retrieves details of a specific transaction
 */
export async function getTransaction(txHash: string): Promise<ethers.TransactionReceipt | null> {
  const rpc = MST_CONFIG.rpcUrls[0];
  const provider = new ethers.JsonRpcProvider(rpc);
  return await provider.getTransactionReceipt(txHash);
}

export function getExplorerUrl(txHash: string): string {
  return getExplorerTxUrl(txHash);
}
