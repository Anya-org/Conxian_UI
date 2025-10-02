import { AppConfig } from "./config";

function baseUrl(): string {
  return (process.env.NEXT_PUBLIC_CORE_API_URL || AppConfig.coreApiUrl).replace(/\/$/, "");
}

export async function getStatus(): Promise<{ ok: boolean; chain_id?: number; network_id?: string; error?: string }>{
  try {
    const r = await fetch(`${baseUrl()}/extended/v1/status`, { cache: "no-store" });
    if (!r.ok) return { ok: false, error: `status=${r.status}` };
    const j = await r.json();
    return { ok: true, chain_id: j.chain_id, network_id: j.network_id };
  } catch (e: any) {
    return { ok: false, error: e?.message || "request-failed" };
  }
}

export async function getNetworkBlockTimes(): Promise<any>{
  try {
    const r = await fetch(`${baseUrl()}/extended/v1/info/network_block_times`, { cache: "no-store" });
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

export async function getMempool(limit = 10): Promise<any[]>{
  try {
    const r = await fetch(`${baseUrl()}/extended/v1/tx/mempool?limit=${limit}`, { cache: "no-store" });
    if (!r.ok) return [];
    const j = await r.json();
    return Array.isArray(j.results) ? j.results : [];
  } catch {
    return [];
  }
}

export async function getAddressBalances(addr: string): Promise<any | null> {
  try {
    const r = await fetch(`${baseUrl()}/extended/v1/address/${addr}/balances`, { cache: "no-store" });
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

export async function getFungibleTokenBalances(addr: string): Promise<any[]>{
  try {
    const r = await fetch(`${baseUrl()}/extended/v1/tokens/balances/${addr}`, { cache: "no-store" });
    if (!r.ok) return [];
    const j = await r.json();
    return Array.isArray(j?.fungible_tokens) ? j.fungible_tokens : [];
  } catch {
    return [];
  }
}

export async function getContractInterface(principal: string, name: string): Promise<any | null> {
  try {
    const r = await fetch(`${baseUrl()}/v2/contracts/interface/${principal}/${name}`, { cache: "no-store" });
    if (!r.ok) return null;
    return r.json();
  } catch {
    return null;
  }
}

// Read-only contract call via Hiro API. Args must be hex-encoded Clarity values (0x...)
export async function callReadOnly(
  contractPrincipal: string,
  contractName: string,
  functionName: string,
  sender: string,
  argsHex: string[]
): Promise<any> {
  try {
    const body = {
      sender,
      arguments: argsHex,
    };
    const r = await fetch(`${baseUrl()}/v2/contracts/call-read/${contractPrincipal}/${contractName}/${functionName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false, status: r.status, error: j?.error || 'call-failed' };
    return { ok: true, result: j.result, events: j.events };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'request-failed' };
  }
}
