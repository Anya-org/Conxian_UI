export const CoreContracts = [
  // Monitoring & Security
  {
    id: "STSZXAKV7DWTDZN2601WR31BM51BD3YTQXKCF9EZ.health-check",
    kind: "monitoring",
    label: "Health Check",
  },
  {
    id: "STSZXAKV7DWTDZN2601WR31BM51BD3YTQXKCF9EZ.oracle-aggregator-v2",
    kind: "oracle",
    label: "Oracle V2",
  },
  {
    id: "STSZXAKV7DWTDZN2601WR31BM51BD3YTQXKCF9EZ.circuit-breaker",
    kind: "security",
    label: "Circuit Breaker",
  },
  {
    id: "STSZXAKV7DWTDZN2601WR31BM51BD3YTQXKCF9EZ.audit-registry",
    kind: "security",
    label: "Auditor",
  },

  // DEX & AMM
  {
    id: "STSZXAKV7DWTDZN2601WR31BM51BD3YTQXKCF9EZ.dex-factory-v2",
    kind: "dex",
    label: "DEX Factory",
  },
  {
    id: "STSZXAKV7DWTDZN2601WR31BM51BD3YTQXKCF9EZ.liquidity-pool",
    kind: "dex",
    label: "Liquidity Pool",
  }, // Placeholder or generic interface
  {
    id: "STSZXAKV7DWTDZN2601WR31BM51BD3YTQXKCF9EZ.multi-hop-router-v3",
    kind: "dex",
    label: "Router",
  },
  {
    id: "STSZXAKV7DWTDZN2601WR31BM51BD3YTQXKCF9EZ.on-chain-router-helper",
    kind: "dex",
    label: "Router Helper",
  },
  {
    id: "STSZXAKV7DWTDZN2601WR31BM51BD3YTQXKCF9EZ.swap-manager",
    kind: "dex",
    label: "Swap Manager",
  },

  // Tokens & Vault
  {
    id: "STSZXAKV7DWTDZN2601WR31BM51BD3YTQXKCF9EZ.cxd-token",
    kind: "token",
    label: "CXD Token",
    decimals: 6,
  },
  {
    id: "STSZXAKV7DWTDZN2601WR31BM51BD3YTQXKCF9EZ.cxlp-token",
    kind: "token",
    label: "CXLP Token",
    decimals: 6,
  },
  {
    id: "STSZXAKV7DWTDZN2601WR31BM51BD3YTQXKCF9EZ.sbtc-token",
    kind: "token",
    label: "sBTC",
    decimals: 8,
  },
  {
    id: "STSZXAKV7DWTDZN2601WR31BM51BD3YTQXKCF9EZ.vault",
    kind: "vault",
    label: "Vault",
  },

  // Staking & Governance
  {
    id: "STSZXAKV7DWTDZN2601WR31BM51BD3YTQXKCF9EZ.cxd-staking",
    kind: "governance",
    label: "Staking",
  },
  {
    id: "STSZXAKV7DWTDZN2601WR31BM51BD3YTQXKCF9EZ.governance-token",
    kind: "governance",
    label: "Governance Token",
    decimals: 6,
  },

  // Others
  {
    id: "STSZXAKV7DWTDZN2601WR31BM51BD3YTQXKCF9EZ.bond-factory",
    kind: "vault",
    label: "Bond Factory",
  },
  {
    id: "STSZXAKV7DWTDZN2601WR31BM51BD3YTQXKCF9EZ.self-launch-coordinator",
    kind: "governance",
    label: "Self Launch Coordinator",
  },
  {
    id: "STSZXAKV7DWTDZN2601WR31BM51BD3YTQXKCF9EZ.performance-recommender",
    kind: "monitoring",
    label: "Performance Recommender",
  },
  {
    id: "STSZXAKV7DWTDZN2601WR31BM51BD3YTQXKCF9EZ.analytics-aggregator",
    kind: "monitoring",
    label: "Metrics Aggregator",
  },
  {
    id: "STSZXAKV7DWTDZN2601WR31BM51BD3YTQXKCF9EZ.finance-metrics",
    kind: "monitoring",
    label: "Financial Metrics",
  },
];

export const Tokens = CoreContracts.filter(c => c.kind === 'token');

export function explorerContractUrl(
  contractId: string,
  network: "devnet" | "testnet" | "mainnet"
): string {
  const baseUrl = `https://explorer.stacks.co/txid/${contractId}`;
  const params = network === "mainnet" ? "?chain=mainnet" : `?chain=testnet`;
  return baseUrl + params;
}
