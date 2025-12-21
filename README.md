# Welcome to the Conxian UI

![Conxian UI Homepage](docs/images/homepage.png)

This is the official UI for interacting with Conxian contracts on the Stacks blockchain. Whether you're a casual user or a seasoned pro, we've got you covered.

## Two Modes, One Seamless Experience

We offer two distinct modes to cater to your needs:

* **Retail Mode**: A simple and intuitive interface for everyday users.
* **PRO Mode**: A dark-themed, power-packed interface for our more advanced users.

## Our Signature Look: The Conxian Color Palette

Our "earthy corporate finance" theme is designed to be both professional and inviting:

* **Primary**: #2E403B (a deep, calming green)
* **Accent**: #D4A017 (a touch of sophisticated gold)
* **Neutrals**: #F5F5F5, #E0E0E0, #333333 (for a clean, modern look)

## Key Features

* **Swap**: Seamlessly exchange tokens with our optimized swap interface.
* **Liquidity Management**: Add liquidity to pools and manage your positions.
* **Shielded Wallets**: Enhance your privacy with shielded wallet creation and management.
* **Community Launch**: Participate in the decentralized self-launch of the protocol.

## Getting Started

Ready to dive in? Here's how to get up and running:

### Requirements

* Node.js 20+
* A Core API URL (Hiro): mainnet/testnet/devnet

### Installation

```bash
npm install
```

### Run (Dev)

```bash
NEXT_PUBLIC_CORE_API_URL=https://api.testnet.hiro.so npm run dev
# App will start at http://localhost:3000 (or next available port)
```

### Build & Start (Prod)

```bash
npm run build
npm start
```

### Backend Alignment

This frontend is aligned with the Conxian DeFi protocol backend contracts. Key contracts include:

#### Core Contracts

* **DEX Factory V2** (`dex-factory-v2`): Factory for creating liquidity pools
* **DEX Router** (`dex-router`): Multi-hop routing for token swaps
* **Oracle Aggregator** (`oracle-aggregator`): Price feed aggregation
* **Vault** (`vault`): Main liquidity vault
* **Circuit Breaker** (`circuit-breaker`): Emergency pause mechanism
* **Bond Factory** (`bond-factory`): Bond issuance system

#### Tokens

* **CXD Token** (`cxd-token`): Protocol governance token
* **CXVG Token** (`cxvg-token`): Vault governance token
* **CXTR Token** (`cxtr-token`): Treasury token
* **CXS Token** (`cxs-token`): Staking token
* **CXLP Token** (`cxlp-token`): Liquidity provider token

#### Monitoring & Security

* **Analytics Aggregator** (`analytics-aggregator`): Protocol analytics
* **Performance Optimizer** (`performance-optimizer`): Performance monitoring
* **Finance Metrics** (`finance-metrics`): Financial KPIs
* **Audit Registry** (`audit-registry`): Security audit tracking
* **MEV Protector** (`mev-protector`): MEV protection

### Contract Interaction System

The application includes a comprehensive contract interaction system (`src/lib/contract-interactions.ts`) that provides:

* **Read-only function calls**: Query contract state without transactions
* **Public function calls**: Execute transactions through user wallets
* **Type-safe interfaces**: Proper TypeScript types for all contract interactions
* **Error handling**: Comprehensive error handling for network and contract issues

### Testing

Run the test suite to verify contract interactions:

```bash
npm test        # Interactive test runner
npm run test:run # Run tests once
npm run test:ui  # Visual test interface
```

Tests cover:

* Contract function calls
* Error handling scenarios
* Configuration validation
* Integration with Stacks network

### Development

* Clarity Argument Builder
  * Per-row Optional toggle: wrap values as `some(...)` or `none`
  * Supports base types: `uint`, `int`, `bool`, `principal`, `ascii`, `utf8`, `buffer-hex`
* Transactions (/tx)
  * Templates (ABI-checked):
    * SIP-010: `transfer`, `approve`, `transfer-from`
    * Pools: `add-liquidity`, `remove-liquidity`, `swap-exact-in`, `swap-exact-out`
  * Wallet call via `@stacks/connect`
* Router (/router)
  * ABI fetched dynamically; function dropdown populated from contract ABI
  * Preset inputs maintained for quick estimate flows
* Pools (/pools)
  * Read-only calls: `get-reserves`, `get-total-supply`, `get-price`, `get-fee-info`, `get-pool-performance`
  * Derived KPIs: LP/Protocol/Total fees (bps), Price X/Y, Price Y/X, Inventory Skew, 24h Volume, 24h Fees, TVL (A units)

### Smoke Tests

* Wallet connect button in navbar
* Transactions
  * Open `/tx`, pick a template, confirm function + args populated, click Open Wallet
* Router
  * Open `/router`, confirm function list is populated from ABI, run an estimate
* Pools
  * Open `/pools`, select a pool, click refresh; verify KPIs render

### Notes

* Contract ABIs are retrieved on demand from the configured Core API via `GET /v2/contracts/interface/{principal}/{name}`.
* Read-only calls are sent via `POST /v2/contracts/call-read/...` with hex-encoded Clarity args.
* If a template function is not present in the selected contract ABI, the UI will show a "Template not supported" status.
