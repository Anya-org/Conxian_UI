## Conxian UI

Next.js app for interacting with Conxian contracts on Stacks. Includes dynamic contract routing, transaction templates, and a Pools dashboard with KPIs.

### Requirements

- Node.js 20+
- A Core API URL (Hiro): mainnet/testnet/devnet

### Environment

- `NEXT_PUBLIC_CORE_API_URL` (browser + server)
  - Defaults to `https://api.testnet.hiro.so`
  - Network is inferred from the URL: `devnet` if localhost, `testnet` if contains `testnet`, else `mainnet`.

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

### Features

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
