## Conxian UI

![Conxian UI Homepage](docs/images/homepage.png)

Next.js app for interacting with Conxian contracts on Stacks. Includes dynamic contract routing, transaction templates, and a Pools dashboard with KPIs.

### Requirements

- Node.js 20+
- A Core API URL (Hiro): mainnet/testnet/devnet

### Environment

- `NEXT_PUBLIC_CORE_API_URL` (browser + server)
  - Defaults to `https://api.testnet.hiro.so`
  - Network is inferred from the URL: `devnet` if localhost, `testnet` if contains `testnet`, else `mainnet`.

### Installation

```bash
npm install
```

After installation, a `prepare` script will automatically create a `src/lib/generated/base.json` file with a default principal. This file is required for the application to build.

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
- **DEX Factory V2** (`dex-factory-v2`): Factory for creating liquidity pools
- **DEX Router** (`dex-router`): Multi-hop routing for token swaps
- **Oracle Aggregator** (`oracle-aggregator`): Price feed aggregation
- **Vault** (`vault`): Main liquidity vault
- **Circuit Breaker** (`circuit-breaker`): Emergency pause mechanism
- **Bond Factory** (`bond-factory`): Bond issuance system

#### Tokens
- **CXD Token** (`cxd-token`): Protocol governance token
- **CXVG Token** (`cxvg-token`): Vault governance token
- **CXTR Token** (`cxtr-token`): Treasury token
- **CXS Token** (`cxs-token`): Staking token
- **CXLP Token** (`cxlp-token`): Liquidity provider token

#### Monitoring & Security
- **Analytics Aggregator** (`analytics-aggregator`): Protocol analytics
- **Performance Optimizer** (`performance-optimizer`): Performance monitoring
- **Finance Metrics** (`finance-metrics`): Financial KPIs
- **Audit Registry** (`audit-registry`): Security audit tracking
- **MEV Protector** (`mev-protector`): MEV protection

### Contract Interaction System

The application includes a comprehensive contract interaction system (`src/lib/contract-interactions.ts`) that provides:

- **Read-only function calls**: Query contract state without transactions
- **Public function calls**: Execute transactions through user wallets
- **Type-safe interfaces**: Proper TypeScript types for all contract interactions
- **Error handling**: Comprehensive error handling for network and contract issues

### Testing

Run the test suite to verify contract interactions:

```bash
npm test        # Interactive test runner
npm run test:run # Run tests once
npm run test:ui  # Visual test interface
```

Tests cover:
- Contract function calls
- Error handling scenarios
- Configuration validation
- Integration with Stacks network

### Development

- Clarity Argument Builder
  - Per-row Optional toggle: wrap values as `some(...)` or `none`
  - Supports base types: `uint`, `int`, `bool`, `principal`, `ascii`, `utf8`, `buffer-hex`
- Transactions (/tx)
  - Templates (ABI-checked):
    - SIP-010: `transfer`, `approve`, `transfer-from`
    - Pools: `add-liquidity`, `remove-liquidity`, `swap-exact-in`, `swap-exact-out`
  - Wallet call via `@stacks/connect`
- Router (/router)
  - ABI fetched dynamically; function dropdown populated from contract ABI
  - Preset inputs maintained for quick estimate flows
- Pools (/pools)
  - Read-only calls: `get-reserves`, `get-total-supply`, `get-price`, `get-fee-info`, `get-pool-performance`
  - Derived KPIs: LP/Protocol/Total fees (bps), Price X/Y, Price Y/X, Inventory Skew, 24h Volume, 24h Fees, TVL (A units)

### Smoke Tests

- Wallet connect button in navbar
- Transactions
  - Open `/tx`, pick a template, confirm function + args populated, click Open Wallet
- Router
  - Open `/router`, confirm function list is populated from ABI, run an estimate
- Pools
  - Open `/pools`, select a pool, click refresh; verify KPIs render

### Notes

- Contract ABIs are retrieved on demand from the configured Core API via `GET /v2/contracts/interface/{principal}/{name}`.
- Read-only calls are sent via `POST /v2/contracts/call-read/...` with hex-encoded Clarity args.
- If a template function is not present in the selected contract ABI, the UI will show a "Template not supported" status.
