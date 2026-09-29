/**
 * Shortens Ethereum/MST address to 0x1234...abcd format
 */
export function shortenAddress(address: string | null | undefined, chars = 4): string {
  if (!address) return "";
  if (address.length <= chars * 2 + 2) return address;
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
}

/**
 * Shortens transaction hash to 0x1234...abcd format
 */
export function shortenTxHash(hash: string | null | undefined, chars = 4): string {
  if (!hash) return "";
  if (hash.length <= chars * 2 + 2) return hash;
  return `${hash.substring(0, chars + 2)}...${hash.substring(hash.length - chars)}`;
}

/**
 * Formats MSTC amounts with proper decimal separation
 */
export function formatMSTC(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "0 MSTC";
  return `${num.toLocaleString("en-US", { maximumFractionDigits: 4 })} MSTC`;
}

/**
 * Formats unix timestamp into human-readable date string
 */
export function formatTimestamp(timestamp: number): string {
  if (!timestamp) return "N/A";
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
