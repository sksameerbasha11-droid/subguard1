export interface MSTNetworkConfig {
  chainId: string;
  chainIdDecimal: number;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
  contractAddress: string;
}

export const MST_CONFIG: MSTNetworkConfig = {
  chainId: process.env.NEXT_PUBLIC_MST_CHAIN_ID || "0x11c1", // 4545 Dec (MST Testnet)
  chainIdDecimal: 4545,
  chainName: "MST Testnet",
  nativeCurrency: {
    name: "MST Coin",
    symbol: "MSTC",
    decimals: 18,
  },
  rpcUrls: [
    process.env.NEXT_PUBLIC_MST_RPC_URL || "https://testnetrpc.mstblockchain.com",
  ],
  blockExplorerUrls: [
    process.env.NEXT_PUBLIC_MST_EXPLORER_URL || "https://testnet.mstscan.com",
  ],
  contractAddress:
    process.env.NEXT_PUBLIC_SUBGUARD_CONTRACT || "0x8Fa7344931aB551a37c02b36b5A2D2B1761F4181",
};

export const getExplorerTxUrl = (txHash: string): string => {
  return `${MST_CONFIG.blockExplorerUrls[0]}/tx/${txHash}`;
};

export const getExplorerAddressUrl = (address: string): string => {
  return `${MST_CONFIG.blockExplorerUrls[0]}/address/${address}`;
};
