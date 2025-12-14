import base from './generated/base.json';

export type ContractRef = {
  id: string; // principal.contract-name
  label: string;
  kind: 'token' | 'dex' | 'oracle' | 'security' | 'enterprise' | 'rewards' | 'other' | 'monitoring';
  decimals?: number;
};

const BASE = (base && typeof base.basePrincipal === 'string' && base.basePrincipal) || 'ST3PPMPR7SAY4CAKQ4ZMYC2Q9FAVBE813YWNJ4JE6';

export const Tokens: ContractRef[] = [
  { id: `${BASE}.cxd-token`, label: 'CXD Token', kind: 'token', decimals: 6 },
  { id: `${BASE}.cxvg-token`, label: 'CXVG Token', kind: 'token', decimals: 6 },
  { id: `${BASE}.cxtr-token`, label: 'CXTR Token', kind: 'token', decimals: 6 },
  { id: `${BASE}.cxs-token`, label: 'CXS Token', kind: 'token', decimals: 6 },
];

export const CoreContracts: ContractRef[] = [
  { id: `${BASE}.concentrated-liquidity-pool`, label: 'Concentrated Pool', kind: 'dex' },
  { id: `${BASE}.dex-factory-v2`, label: 'DEX Factory', kind: 'dex' },
  { id: `${BASE}.dex-router`, label: 'DEX Router', kind: 'dex' },
  { id: `${BASE}.multi-hop-router-v3`, label: 'Router V3', kind: 'dex' },
  { id: `${BASE}.vault`, label: 'Vault', kind: 'dex' },
  { id: `${BASE}.bond-factory`, label: 'Bond Factory', kind: 'dex' },
  { id: `${BASE}.oracle-aggregator-v2`, label: 'Oracle Aggregator v2', kind: 'oracle' },
  { id: `${BASE}.circuit-breaker`, label: 'Circuit Breaker', kind: 'security' },
  { id: `${BASE}.cxd-staking`, label: 'CXD Staking', kind: 'rewards' },
  { id: `${BASE}.distributed-cache-manager`, label: 'Cache Manager', kind: 'other' },
  { id: `${BASE}.flash-loan-vault`, label: 'Flash Loan Vault', kind: 'dex' },
  { id: `${BASE}.sbtc-vault`, label: 'sBTC Vault', kind: 'dex' },
  { id: `${BASE}.audit-registry`, label: 'Audit Registry', kind: 'security' },
  { id: `${BASE}.governance-signature-verifier`, label: 'Governance Verifier', kind: 'other' },
  { id: `${BASE}.system-monitor`, label: 'System Monitor', kind: 'monitoring' },
  { id: `${BASE}.enterprise-api`, label: 'Enterprise API', kind: 'enterprise' },
  { id: `${BASE}.yield-optimizer`, label: 'Yield Optimizer', kind: 'rewards' },
  { id: `${BASE}.analytics-aggregator`, label: 'Analytics Aggregator', kind: 'monitoring' },
  { id: `${BASE}.performance-optimizer`, label: 'Performance Optimizer', kind: 'monitoring' },
  { id: `${BASE}.finance-metrics`, label: 'Finance Metrics', kind: 'monitoring' },
  { id: `${BASE}.monitoring-dashboard`, label: 'Monitoring Dashboard', kind: 'monitoring' },
];

export function explorerContractUrl(contractId: string, network: 'devnet' | 'testnet' | 'mainnet' = 'testnet') {
  // Map devnet to 'devnet' param (Explorer may show local-only if configured). Fallback to testnet visually if needed.
  const chain = network;
  return `https://explorer.hiro.so/contract/${contractId}?chain=${chain}`;
}
