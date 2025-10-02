export type ContractRef = {
  id: string; // principal.contract-name
  label: string;
  kind: 'token' | 'dex' | 'oracle' | 'security' | 'enterprise' | 'rewards' | 'other';
};

const BASE = 'ST3PPMPR7SAY4CAKQ4ZMYC2Q9FAVBE813YWNJ4JE6';

export const Tokens: ContractRef[] = [
  { id: `${BASE}.cxd-token`, label: 'CXD Token', kind: 'token' },
  { id: `${BASE}.cxvg-token`, label: 'CXVG Token', kind: 'token' },
  { id: `${BASE}.cxtr-token`, label: 'CXTR Token', kind: 'token' },
  { id: `${BASE}.cxs-token`, label: 'CXS Token', kind: 'token' },
];

export const CoreContracts: ContractRef[] = [
  { id: `${BASE}.dex-factory`, label: 'DEX Factory', kind: 'dex' },
  { id: `${BASE}.dex-router`, label: 'DEX Router', kind: 'dex' },
  { id: `${BASE}.concentrated-liquidity-pool-v2`, label: 'Concentrated Pool V2', kind: 'dex' },
  { id: `${BASE}.position-nft`, label: 'Position NFT', kind: 'dex' },
  { id: `${BASE}.oracle-aggregator-v2`, label: 'Oracle Aggregator V2', kind: 'oracle' },
  { id: `${BASE}.mev-protector`, label: 'MEV Protector', kind: 'security' },
  { id: `${BASE}.enterprise-api`, label: 'Enterprise API', kind: 'enterprise' },
  { id: `${BASE}.yield-optimizer`, label: 'Yield Optimizer', kind: 'rewards' },
];

export function explorerContractUrl(contractId: string, network: 'devnet' | 'testnet' | 'mainnet' = 'testnet') {
  // Map devnet to 'devnet' param (Explorer may show local-only if configured). Fallback to testnet visually if needed.
  const chain = network;
  return `https://explorer.hiro.so/contract/${contractId}?chain=${chain}`;
}
