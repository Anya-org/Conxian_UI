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
