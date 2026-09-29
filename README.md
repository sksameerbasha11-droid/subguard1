# SubGuard
**"Your Subscriptions. Your Rules."**

SubGuard is a blockchain-powered subscription manager and payment firewall that empowers users to manage recurring subscriptions and enforce programmable, maximum authorized payment limits via MST Blockchain smart contracts.

---

## Overview

Modern web software relies heavily on recurring subscriptions. However, legacy credit card billing surrenders total unilateral pricing power to merchants. SubGuard restores financial sovereignty to subscribers by establishing an immutable, decentralized firewall between your digital assets and recurring merchants.

## Problem

- **Unannounced Price Hikes:** Streaming and SaaS platforms frequently raise subscription fees without requiring re-authentication.
- **Dark Patterns & Cancellation Friction:** Services deliberately complicate unsubscribe flows with endless surveys and retention hurdles.
- **Ghost Subscriptions:** Forgotten trial memberships silently continue billing indefinitely.
- **Centralized Vulnerabilities:** Centralized billing servers are prone to leaks and unauthorized charges.

## Solution

SubGuard inverts this paradigm through **Programmable Payment Firewalls**:
1. Users define explicit recurring parameters and an immutable **maximum authorized payment limit** on MST Blockchain.
2. When a merchant submits a payment request, the **SubGuard smart contract (`SubGuard.sol`)** evaluates the requested amount.
3. If the amount is within authorized boundaries, the payment is approved (`PaymentAllowed`).
4. If a merchant attempts to charge even 1 unit above your authorized ceiling, the payment is blocked immediately (`PaymentBlocked`) with zero fund transfer.
5. Subscriptions can be paused, resumed, or permanently cancelled on-chain in 1 click.

---

## Features

- **White Glassmorphism UI:** Clean, clutter-free aesthetic with subtle backdrop blur, soft shadows, and high contrast typography.
- **Smart Contract Firewall:** Mathematical rule enforcement in Solidity deployed on MST Testnet.
- **Real-Time Firewall Simulation:** Live console to test payment authorization against defined limits.
- **Brand Service Logos:** Authentic vector representations for Netflix, Spotify, YouTube Premium, GitHub, Apple Music, Adobe, ChatGPT, and custom services.
- **EIP-1193 BridgeKey Wallet Integration:** Non-custodial connection with automatic MST Testnet switching.
- **Transparent Transaction Ledger:** Every firewall decision generates a verifiable blockchain transaction viewable on the MST Explorer.
- **Responsive Mobile Navigation:** Tailored bottom navigation and mobile-first experience.

---

## Architecture

```
[ User Browser / BridgeKey Wallet ]
                │
                ▼ (EIP-1193)
     [ SubGuard Next.js Frontend ]
                │
                ▼ (JSON-RPC)
       [ MST Testnet Node ]
                │
                ▼
     [ SubGuard.sol Smart Contract ]
     ├── Subscription Structs & Mappings
     ├── createSubscription()
     ├── isPaymentAllowed()  <-- FIREWALL DECISION ENGINE
     ├── requestPayment()
     ├── pauseSubscription()
     └── resumeSubscription()
```

---

## How MST Blockchain Is Used

MST Blockchain functions as the authoritative decentralized state layer for:
- Storing subscription parameters (`amount`, `maxAmount`, `billingInterval`, `nextPaymentAt`).
- Executing the payment firewall logic (`requestedAmount <= maxAmount`).
- Emitting auditable cryptographic events (`PaymentAllowed`, `PaymentBlocked`, `SubscriptionCreated`).
- Preventing front-running and unauthorized cancellation through cryptographic signatures.

---

## Smart Contract

The core contract is located at `contracts/SubGuard.sol`:
- Written in Solidity `^0.8.20`.
- Implements strict checks-effects-interactions and access-control modifiers (`onlySubscriber`, `exists`).
- Emits detailed events for telemetry and indexers.

---

## BridgeKey Integration

SubGuard connects to Web3 wallets via the standard `window.bridgeKey` or `window.ethereum` EIP-1193 interface:
- Detects provider automatically.
- Validates chain ID (`0x2055` / `8277` Dec).
- Prompts automatic network addition/switch if connected to another network.
- Shortens addresses cleanly in UI (`0x1234...abcd`).
- **Never requests or stores private keys, seed phrases, or passwords.**

---

## Local Development

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### Setup
```bash
# Clone and enter the subguard directory
cd subguard

# Install dependencies
npm install

# Run the smart contract test suite
npm test

# Launch the Next.js development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the application.

---

## Environment Variables

Copy `.env.example` to `.env.local`:
```env
NEXT_PUBLIC_MST_RPC_URL=https://testnet-rpc.mstblockchain.io
NEXT_PUBLIC_MST_CHAIN_ID=0x2055
NEXT_PUBLIC_MST_EXPLORER_URL=https://explorer.testnet.mstblockchain.io
NEXT_PUBLIC_SUBGUARD_CONTRACT=0x8Fa7344931aB551a37c02b36b5A2D2B1761F4181

# Hardhat Deployer (Used only in deploy scripts, NEVER prefix with NEXT_PUBLIC_)
DEPLOYER_PRIVATE_KEY=
```

---

## Testing

Run the comprehensive unit test suite:
```bash
npx hardhat test
```

### Verified Test Cases:
- Subscription creation and parameter validation.
- Rejection of invalid merchant addresses and zero amounts.
- **Firewall Allow:** Approving charges within authorized ceilings (e.g. 649 MSTC).
- **Firewall Block:** Rejecting price hikes (e.g. 2999 MSTC > 699 MSTC limit).
- **Pause & Resume:** Blocking payments during pauses and restoring authorization upon resumption.
- **Cancellation:** Permanent termination of future charges.
- **Access Control:** Preventing unauthorized users from altering subscription rules.

---

## MST Testnet Deployment

To deploy a fresh instance of the smart contract to MST Testnet:
```bash
npm run deploy:mst
```

The script compiles the contract, deploys it to MST Testnet, and writes the deployment address and metadata to `deployments/mst-testnet.json`.

---

## Vercel Deployment

SubGuard is architected to deploy directly to Vercel without requiring a persistent backend server:
1. Connect your repository to Vercel.
2. In Project Settings -> Environment Variables, configure:
   - `NEXT_PUBLIC_MST_RPC_URL`
   - `NEXT_PUBLIC_MST_CHAIN_ID`
   - `NEXT_PUBLIC_MST_EXPLORER_URL`
   - `NEXT_PUBLIC_SUBGUARD_CONTRACT`
3. Build Command: `npm run build`
4. Output Directory: `.next`

---

## Health Check API

Verify system status via:
```
GET /api/health
```
Response:
```json
{
  "status": "ok",
  "service": "SubGuard"
}
```

---

## Project Structure

```
subguard/
├── app/                     # Next.js App Router (Landing, Dashboard, Firewall, Auth)
├── components/              # Reusable UI & Layout Components
├── contracts/               # Solidity Smart Contracts (SubGuard.sol)
├── test/                    # Hardhat Unit Tests
├── scripts/                 # Deployment and Verification Scripts
├── config/                  # MST Network Configuration
├── abi/                     # Contract JSON ABI
├── deployments/             # Deployment Metadata
└── lib/                     # Wallet, Blockchain, and Auth Utilities
```

---

## Security Best Practices

- Input validation on all amounts, addresses, and timestamps.
- Zero custody: All blockchain transactions are signed directly in the user's wallet.
- No secrets or private keys exposed in client bundles.
- Reentrancy and access checks enforced on state-modifying smart contract calls.

---

## Future Improvements

- Streaming payment integrations via Superfluid on MST.
- Multi-token support (ERC-20 stablecoins).
- Batch subscription creation.
- Merchant webhook notification endpoints.

---

© 2026 SubGuard. All rights reserved. Powered by MST Blockchain.
