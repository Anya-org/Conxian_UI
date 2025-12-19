
import { AppConfig } from "@/lib/config";
import { fetch } from "cross-fetch";

export interface FungibleTokenBalance {
  asset_identifier: string;
  balance: string;
}

export async function getFungibleTokenBalances(principal: string): Promise<FungibleTokenBalance[]> {
  const url = `${AppConfig.coreApiUrl}/extended/v1/address/${principal}/balances`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch balances: ${res.statusText}`);
  }
  const data = await res.json() as { fungible_tokens: Record<string, FungibleTokenBalance> };
  return data.fungible_tokens ? Object.values(data.fungible_tokens) : [];
}

export interface ReadOnlySuccessResponse {
  okay: true;
  result: string;
}

export async function callReadOnly(contractAddress: string, contractName: string, functionName: string, senderAddress: string, args: string[]): Promise<ReadOnlySuccessResponse> {
  const url = `${AppConfig.coreApiUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: senderAddress,
      arguments: args,
    }),
  });
  if (!res.ok) {
    throw new Error(`Failed to call read-only function: ${res.statusText}`);
  }
  return res.json() as Promise<ReadOnlySuccessResponse>;
}
