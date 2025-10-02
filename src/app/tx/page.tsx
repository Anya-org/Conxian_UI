"use client";

import React from "react";
import { AppConfig } from "@/lib/config";
import { CoreContracts, Tokens } from "@/lib/contracts";
import { userSession } from "@/lib/wallet";
import ClarityArgBuilder, { BuiltArgs, ArgType } from "@/components/ClarityArgBuilder";
import { openContractCall } from "@stacks/connect";
import { createNetwork } from "@stacks/network";
import type { StacksNetwork } from "@stacks/network";
import { getContractInterface } from "@/lib/coreApi";

function getNetwork(): StacksNetwork {
  const name = (AppConfig.network as 'mainnet' | 'testnet' | 'devnet');
  if (name === 'devnet') {
    return createNetwork({ network: 'devnet', client: { baseUrl: AppConfig.coreApiUrl } });
  }
  return createNetwork(name);
}

export default function TxPage() {
  const [selected, setSelected] = React.useState<string>(`${CoreContracts[0].id}`);
  const [fnName, setFnName] = React.useState<string>("");
  const [args, setArgs] = React.useState<BuiltArgs>({ cv: [], hex: [] });
  const [presetRows, setPresetRows] = React.useState<Array<{ type: ArgType; value?: string }> | undefined>(undefined);
  const [sending, setSending] = React.useState(false);
  const [status, setStatus] = React.useState<string>("");

  const onBuild = (built: BuiltArgs) => {
    setArgs(built);
  };

  const onSubmit = async () => {
    setStatus("");
    const [contractAddress, contractName] = selected.split(".");
    if (!contractAddress || !contractName || !fnName) {
      setStatus("Missing contract or function name");
      return;
    }
    try {
      setSending(true);
      await openContractCall({
        network: getNetwork(),
        contractAddress,
        contractName,
        functionName: fnName,
        functionArgs: args.cv,
        userSession,
        onFinish: data => {
          setStatus(`Submitted. Tx ID: ${data?.txId || "(see wallet)"}`);
          setSending(false);
        },
        onCancel: () => {
          setStatus("Cancelled by user");
          setSending(false);
        },
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatus(`Error: ${msg}`);
      setSending(false);
    }
  };

  const contracts = [...Tokens, ...CoreContracts];

  async function hasFunction(contractId: string, fn: string): Promise<boolean> {
    const [addr, name] = contractId.split(".");
    const abi = await getContractInterface(addr, name);
    let names: string[] = [];
    if (abi && typeof abi === 'object' && 'functions' in (abi as Record<string, unknown>)) {
      const list = (abi as Record<string, unknown>).functions;
      if (Array.isArray(list)) {
        names = list
          .map((f: unknown) => {
            if (typeof f === 'object' && f !== null && 'name' in (f as Record<string, unknown>)) {
              const n = (f as Record<string, unknown>).name;
              return typeof n === 'string' ? n : undefined;
            }
            return undefined;
          })
          .filter((n): n is string => typeof n === 'string');
      }
    }
    return names.includes(fn);
  }

  const applyTemplate = async (tpl: string) => {
    setStatus("");
    if (tpl === 'sip10-transfer') {
      // Choose first token contract
      const tok = Tokens[0];
      if (tok) setSelected(tok.id);
      const supported = tok ? await hasFunction(tok.id, 'transfer') : false;
      if (!supported) { setStatus('Template not supported: transfer'); setPresetRows(undefined); return; }
      setFnName('transfer');
      setPresetRows([
        { type: 'uint', value: '1' }, // amount
        { type: 'principal', value: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5' }, // sender
        { type: 'principal', value: 'ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND' }, // recipient
        { type: 'optional-none' }, // memo
      ]);
    } else if (tpl === 'sip10-approve') {
      const tok = Tokens[0];
      if (tok) setSelected(tok.id);
      const supported = tok ? await hasFunction(tok.id, 'approve') : false;
      if (!supported) { setStatus('Template not supported: approve'); setPresetRows(undefined); return; }
      setFnName('approve');
      setPresetRows([
        { type: 'principal', value: 'ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND' }, // spender
        { type: 'uint', value: '1000' }, // amount
      ]);
    } else if (tpl === 'sip10-transfer-from') {
      const tok = Tokens[0];
      if (tok) setSelected(tok.id);
      const supported = tok ? await hasFunction(tok.id, 'transfer-from') : false;
      if (!supported) { setStatus('Template not supported: transfer-from'); setPresetRows(undefined); return; }
      setFnName('transfer-from');
      setPresetRows([
        { type: 'principal', value: 'ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5' }, // spender
        { type: 'principal', value: 'ST3Y8QXTPYK6ZVMQ2BNN0R1B1RZ7RZ87GHN3Z3P43' }, // sender
        { type: 'principal', value: 'ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND' }, // recipient
        { type: 'uint', value: '1' }, // amount
        { type: 'optional-none' }, // memo
      ]);
    } else if (tpl === 'pool-add-liquidity') {
      const pool = CoreContracts.find(c => c.id.endsWith('.dex-dex-pool')) || CoreContracts[0];
      if (pool) setSelected(pool.id);
      const supported = pool ? await hasFunction(pool.id, 'add-liquidity') : false;
      if (!supported) { setStatus('Template not supported: add-liquidity'); setPresetRows(undefined); return; }
      setFnName('add-liquidity');
      setPresetRows([
        { type: 'uint', value: '1000' }, // dx
        { type: 'uint', value: '1000' }, // dy
        { type: 'uint', value: '0' },    // min-shares
      ]);
    } else if (tpl === 'pool-remove-liquidity') {
      const pool = CoreContracts.find(c => c.id.endsWith('.dex-dex-pool')) || CoreContracts[0];
      if (pool) setSelected(pool.id);
      const supported = pool ? await hasFunction(pool.id, 'remove-liquidity') : false;
      if (!supported) { setStatus('Template not supported: remove-liquidity'); setPresetRows(undefined); return; }
      setFnName('remove-liquidity');
      setPresetRows([
        { type: 'uint', value: '100' }, // shares
        { type: 'uint', value: '0' },   // min-dx
        { type: 'uint', value: '0' },   // min-dy
      ]);
    } else if (tpl === 'pool-swap-exact-in') {
      const pool = CoreContracts.find(c => c.id.endsWith('.dex-dex-pool')) || CoreContracts[0];
      if (pool) setSelected(pool.id);
      // note: the pool has two versions; we use the simple signature swap-exact-in(amount-in,min-amount-out,x-to-y,deadline)
      const supported = pool ? await hasFunction(pool.id, 'swap-exact-in') : false;
      if (!supported) { setStatus('Template not supported: swap-exact-in'); setPresetRows(undefined); return; }
      setFnName('swap-exact-in');
      setPresetRows([
        { type: 'uint', value: '100' }, // amount-in
        { type: 'uint', value: '1' },   // min-amount-out
        { type: 'bool', value: 'true' }, // x-to-y
        { type: 'uint', value: String(Date.now()) }, // deadline (placeholder)
      ]);
    } else if (tpl === 'pool-swap-exact-out') {
      const pool = CoreContracts.find(c => c.id.endsWith('.dex-dex-pool')) || CoreContracts[0];
      if (pool) setSelected(pool.id);
      const supported = pool ? await hasFunction(pool.id, 'swap-exact-out') : false;
      if (!supported) { setStatus('Template not supported: swap-exact-out'); setPresetRows(undefined); return; }
      setFnName('swap-exact-out');
      setPresetRows([
        { type: 'uint', value: '100' }, // amount-out
        { type: 'uint', value: '1000' }, // max-amount-in
        { type: 'bool', value: 'true' }, // x-to-y
        { type: 'uint', value: String(Date.now()) }, // deadline
      ]);
    } else {
      setPresetRows(undefined);
    }
  };

  return (
    <div className="min-h-screen w-full p-6 sm:p-10 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <div className="text-sm text-gray-600">Network: {AppConfig.network}</div>
      </header>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-xs block mb-1">Contract</label>
            <select aria-label="Contract" className="border rounded px-2 py-1 w-full" value={selected} onChange={e => setSelected(e.target.value)}>
              {contracts.map(c => (
                <option key={c.id} value={c.id}>{c.label} — {c.id}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs block mb-1">Function</label>
            <input aria-label="Function name" className="border rounded px-2 py-1 w-full" value={fnName} onChange={e => setFnName(e.target.value)} placeholder="swap-exact-in" />
          </div>
          <div>
            <label className="text-xs block mb-1">Network</label>
            <input className="border rounded px-2 py-1 w-full" value={AppConfig.network} readOnly />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-xs block mb-1">Template</label>
            <select aria-label="Template" className="border rounded px-2 py-1 w-full" onChange={e => applyTemplate(e.target.value)} defaultValue="">
              <option value="">None</option>
              <option value="sip10-transfer">SIP-010 transfer</option>
              <option value="sip10-approve">SIP-010 approve</option>
              <option value="sip10-transfer-from">SIP-010 transfer-from</option>
              <option value="pool-add-liquidity">Pool add-liquidity</option>
              <option value="pool-remove-liquidity">Pool remove-liquidity</option>
              <option value="pool-swap-exact-in">Pool swap-exact-in</option>
              <option value="pool-swap-exact-out">Pool swap-exact-out</option>
            </select>
          </div>
        </div>

        <ClarityArgBuilder onChange={onBuild} preset={presetRows} />

        <div className="flex items-center gap-3">
          <button onClick={onSubmit} disabled={sending || !fnName} className="text-sm px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600">
            {sending ? "Sending..." : "Open Wallet"}
          </button>
          {status && <div className="text-xs text-gray-600">{status}</div>}
        </div>
      </div>
    </div>
  );
}
