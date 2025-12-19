export const CoreContracts = [
  // Monitoring & Security
  { id: 'ST123.health-check', kind: 'monitoring', label: 'Health Check' },
  { id: 'ST123.oracle-aggregator-v1', kind: 'oracle', label: 'Oracle V1' },
  { id: 'ST123.oracle-aggregator-v2', kind: 'oracle', label: 'Oracle V2' },
  { id: 'ST123.circuit-breaker', kind: 'security', label: 'Circuit Breaker' },
  { id: 'ST123.auditor', kind: 'security', label: 'Auditor' },

  // DEX & AMM
  { id: 'ST123.dex-factory', kind: 'dex', label: 'DEX Factory' },
  { id: 'ST123.liquidity-pool', kind: 'dex', label: 'Liquidity Pool' },
  { id: 'ST123.router', kind: 'dex', label: 'Router' },
  { id: 'ST123.amm', kind: 'dex', label: 'AMM' },

  // Tokens & Vault
  { id: 'ST123.token-a', kind: 'token', label: 'Token A', decimals: 6 },
  { id: 'ST123.token-b', kind: 'token', label: 'Token B', decimals: 6 },
  { id: 'ST123.sbtc', kind: 'token', label: 'sBTC', decimals: 8 },
  { id: 'ST123.vault', kind: 'vault', label: 'Vault' },

  // Staking & Governance
  { id: 'ST123.staking', kind: 'governance', label: 'Staking' },
  { id: 'ST123.governance-token', kind: 'governance', label: 'Governance Token', decimals: 6 },
  { id: 'ST123.rewards', kind: 'rewards', label: 'Rewards' },

  // Others
  { id: 'ST123.bond-factory', kind: 'vault', label: 'Bond Factory' },
  { id: 'ST123.flash-loan', kind: 'dex', label: 'Flash Loan' },
  { id: 'ST123.performance-recommender', kind: 'monitoring', label: 'Performance Recommender' },
  { id: 'ST123.metrics-aggregator', kind: 'monitoring', label: 'Metrics Aggregator' },
  { id: 'ST123.financial-metrics', kind: 'monitoring', label: 'Financial Metrics' },
  { id: 'ST123.enterprise-config', kind: 'governance', label: 'Enterprise Config' },
  { id: 'ST123.yield-optimizer', kind: 'vault', label: 'Yield Optimizer' },
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
