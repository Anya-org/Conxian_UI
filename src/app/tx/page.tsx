"use client";

import React from "react";
import { AppConfig } from "@/lib/config";
import { CoreContracts, Tokens } from "@/lib/contracts";
import { userSession } from "@/lib/wallet";
import ClarityArgBuilder, {
  BuiltArgs,
  ArgType,
} from "@/components/ClarityArgBuilder";
import { openContractCall } from "@stacks/connect";
import { createNetwork } from "@stacks/network";
import type { StacksNetwork } from "@stacks/network";
import { getContractInterface } from "@/lib/coreApi";

type AbiArg = { name?: string; type?: unknown };
type AbiFn = { name?: string; args?: AbiArg[] };
type ContractAbi = { functions?: AbiFn[] };

function getNetwork(): StacksNetwork {
  const name = AppConfig.network as "mainnet" | "testnet" | "devnet";
  if (name === "devnet") {
    return createNetwork({
      network: "devnet",
      client: { baseUrl: AppConfig.coreApiUrl },
    });
  }
  return createNetwork(name);
}

export default function TxPage() {
  const [selected, setSelected] = React.useState<string>(
    `${CoreContracts[0].id}`
  );
  const [fnName, setFnName] = React.useState<string>("");
  const [args, setArgs] = React.useState<BuiltArgs>({ cv: [], hex: [] });
  const [presetRows, setPresetRows] = React.useState<
    Array<{ type: ArgType; value?: string }> | undefined
  >(undefined);
  const [sending, setSending] = React.useState(false);
  const [status, setStatus] = React.useState<string>("");
  const [abiFunctions, setAbiFunctions] = React.useState<string[]>([]);
  const [abiLoading, setAbiLoading] = React.useState<boolean>(false);
  const [mode, setMode] = React.useState<"basic" | "advanced">("basic");
  const [abiFns, setAbiFns] = React.useState<AbiFn[]>([]);

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
        onFinish: (data) => {
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

  // Load ABI and extract function names when contract changes
  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      setAbiLoading(true);
      try {
        const [addr, name] = selected.split(".");
        const abi = (await getContractInterface(addr, name)) as ContractAbi | null;
        const fns: AbiFn[] = Array.isArray(abi?.functions)
          ? (abi!.functions as AbiFn[])
          : [];
        const names: string[] = fns
          .map((f) =>
            typeof f?.name === "string" ? (f.name as string) : undefined
          )
          .filter((n): n is string => typeof n === "string");
        if (!cancelled) {
          setAbiFunctions(names);
          setAbiFns(fns);
        }
      } catch {
        if (!cancelled) setAbiFunctions([]);
      } finally {
        if (!cancelled) setAbiLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [selected]);

  // Keep fnName consistent with available abiFunctions without re-fetching
  React.useEffect(() => {
    if (fnName && abiFunctions.length > 0 && !abiFunctions.includes(fnName)) {
      setFnName("");
    }
  }, [abiFunctions, fnName]);

  const paramMeta = React.useMemo(() => {
    if (!fnName) return undefined;
    const fn = abiFns.find((f) => f?.name === fnName);
    const args = Array.isArray(fn?.args) ? fn!.args : undefined;
    if (!args) return undefined;
    const toType = (t: unknown): string | undefined => {
      if (typeof t === "string") return t;
      try {
        return t ? JSON.stringify(t) : undefined;
      } catch {
        return undefined;
      }
    };
    return args.map((a) => ({
      name: typeof a?.name === "string" ? a.name : undefined,
      type: toType(a?.type),
    }));
  }, [fnName, abiFns]);

  async function hasFunction(contractId: string, fn: string): Promise<boolean> {
    const [addr, name] = contractId.split(".");
    const abi = (await getContractInterface(addr, name)) as ContractAbi | null;
    const names: string[] = Array.isArray(abi?.functions)
      ? (abi!.functions as AbiFn[])
          .map((f) =>
            typeof f?.name === "string" ? (f.name as string) : undefined
          )
          .filter((n): n is string => typeof n === "string")
      : [];
    return names.includes(fn);
  }

  const applyTemplate = async (tpl: string) => {
    setStatus("");
    if (tpl === "sip10-transfer") {
      // Choose first token contract
      const tok = Tokens[0];
      if (tok) setSelected(tok.id);
      const supported = tok ? await hasFunction(tok.id, "transfer") : false;
      if (!supported) {
        setStatus("Template not supported: transfer");
        setPresetRows(undefined);
        return;
      }
      setFnName("transfer");
      setPresetRows([
        { type: "uint", value: "1" }, // amount
        {
          type: "principal",
          value: "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5",
        }, // sender
        {
          type: "principal",
          value: "ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND",
        }, // recipient
        { type: "optional-none" }, // memo
      ]);
    } else if (tpl === "sip10-approve") {
      const tok = Tokens[0];
      if (tok) setSelected(tok.id);
      const supported = tok ? await hasFunction(tok.id, "approve") : false;
      if (!supported) {
        setStatus("Template not supported: approve");
        setPresetRows(undefined);
        return;
      }
      setFnName("approve");
      setPresetRows([
        {
          type: "principal",
          value: "ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND",
        }, // spender
        { type: "uint", value: "1000" }, // amount
      ]);
    } else if (tpl === "sip10-transfer-from") {
      const tok = Tokens[0];
      if (tok) setSelected(tok.id);
      const supported = tok
        ? await hasFunction(tok.id, "transfer-from")
        : false;
      if (!supported) {
        setStatus("Template not supported: transfer-from");
        setPresetRows(undefined);
        return;
      }
      setFnName("transfer-from");
      setPresetRows([
        {
          type: "principal",
          value: "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5",
        }, // spender
        {
          type: "principal",
          value: "ST3Y8QXTPYK6ZVMQ2BNN0R1B1RZ7RZ87GHN3Z3P43",
        }, // sender
        {
          type: "principal",
          value: "ST2NEB84ASENDXKYGJPQW86YXQCEFEX2ZQPG87ND",
        }, // recipient
        { type: "uint", value: "1" }, // amount
        { type: "optional-none" }, // memo
      ]);
    } else if (tpl === "pool-add-liquidity") {
      const pool =
        CoreContracts.find((c) => c.kind === "dex") || CoreContracts[0];
      if (pool) setSelected(pool.id);
      const supported = pool
        ? await hasFunction(pool.id, "add-liquidity")
        : false;
      if (!supported) {
        setStatus("Template not supported: add-liquidity");
        setPresetRows(undefined);
        return;
      }
      setFnName("add-liquidity");
      setPresetRows([
        { type: "uint", value: "1000" }, // dx
        { type: "uint", value: "1000" }, // dy
        { type: "uint", value: "0" }, // min-shares
      ]);
    } else if (tpl === "pool-remove-liquidity") {
      const pool =
        CoreContracts.find((c) => c.kind === "dex") || CoreContracts[0];
      if (pool) setSelected(pool.id);
      const supported = pool
        ? await hasFunction(pool.id, "remove-liquidity")
        : false;
      if (!supported) {
        setStatus("Template not supported: remove-liquidity");
        setPresetRows(undefined);
        return;
      }
      setFnName("remove-liquidity");
      setPresetRows([
        { type: "uint", value: "100" }, // shares
        { type: "uint", value: "0" }, // min-dx
        { type: "uint", value: "0" }, // min-dy
      ]);
    } else if (tpl === "pool-swap-exact-in") {
      const pool =
        CoreContracts.find((c) => c.kind === "dex") || CoreContracts[0];
      if (pool) setSelected(pool.id);
      // note: the pool has two versions; we use the simple signature swap-exact-in(amount-in,min-amount-out,x-to-y,deadline)
      const supported = pool
        ? await hasFunction(pool.id, "swap-exact-in")
        : false;
      if (!supported) {
        setStatus("Template not supported: swap-exact-in");
        setPresetRows(undefined);
        return;
      }
      setFnName("swap-exact-in");
      setPresetRows([
        { type: "uint", value: "100" }, // amount-in
        { type: "uint", value: "1" }, // min-amount-out
        { type: "bool", value: "true" }, // x-to-y
        { type: "uint", value: String(Date.now()) }, // deadline (placeholder)
      ]);
    } else if (tpl === "pool-swap-exact-out") {
      const pool =
        CoreContracts.find((c) => c.kind === "dex") || CoreContracts[0];
      if (pool) setSelected(pool.id);
      const supported = pool
        ? await hasFunction(pool.id, "swap-exact-out")
        : false;
      if (!supported) {
        setStatus("Template not supported: swap-exact-out");
        setPresetRows(undefined);
        return;
      }
      setFnName("swap-exact-out");
      setPresetRows([
        { type: "uint", value: "100" }, // amount-out
        { type: "uint", value: "1000" }, // max-amount-in
        { type: "bool", value: "true" }, // x-to-y
        { type: "uint", value: String(Date.now()) }, // deadline
      ]);
    } else {
      setPresetRows(undefined);
    }
  };

  return (
    <div className="min-h-screen w-full p-6 sm:p-10 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-light">
          Transactions
        </h1>
        <div
          className="text-sm flex items-center gap-2"
          aria-label="Current network"
        >
          <span className="text-gray-400">Network</span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium border
              ${
                AppConfig.network === "mainnet"
                  ? "bg-red-900 text-red-200 border-red-800"
                  : AppConfig.network === "testnet"
                  ? "bg-yellow-900 text-yellow-200 border-yellow-800"
                  : "bg-green-900 text-green-200 border-green-800"
              }`}
          >
            {AppConfig.network}
          </span>
        </div>
      </header>

      <form
        className="rounded-lg border border-gray-700 bg-gray-900 p-4 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        noValidate
      >
        {/* Interface Mode toggle */}
        <div
          className="flex items-center gap-4 text-gray-300"
          role="radiogroup"
          aria-labelledby="mode-label"
        >
          <span id="mode-label" className="text-xs font-medium">
            Interface Mode
          </span>
          <label className="text-xs flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name="ui-mode"
              value="basic"
              checked={mode === "basic"}
              onChange={() => setMode("basic")}
              className="accent-blue-500"
            />
            Basic
          </label>
          <label className="text-xs flex items-center gap-1 cursor-pointer">
            <input
              type="radio"
              name="ui-mode"
              value="advanced"
              checked={mode === "advanced"}
              onChange={() => setMode("advanced")}
              className="accent-blue-500"
            />
            Advanced
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label
              htmlFor="contract-select"
              className="text-xs block mb-1 text-gray-300"
            >
              Contract
            </label>
            <select
              id="contract-select"
              aria-label="Contract"
              className="border rounded px-2 py-1 w-full text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              {contracts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label} — {c.id}
                </option>
              ))}
            </select>
          </div>
          {mode === "advanced" && (
            <div>
              <label
                htmlFor="function-select"
                className="text-xs block mb-1 text-gray-300"
              >
                Function
              </label>
              {abiFunctions.length > 0 ? (
                <select
                  id="function-select"
                  className="border rounded px-2 py-1 w-full text-black"
                  value={fnName}
                  onChange={(e) => setFnName(e.target.value)}
                >
                  <option value="" disabled>
                    {abiLoading ? "Loading..." : "Choose function"}
                  </option>
                  {abiFunctions.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id="function-select"
                  aria-label="Function name"
                  className="border rounded px-2 py-1 w-full text-black"
                  value={fnName}
                  onChange={(e) => setFnName(e.target.value)}
                  placeholder={abiLoading ? "Loading ABI..." : "Function name"}
                />
              )}
            </div>
          )}
          <div>
            <label
              htmlFor="network"
              className="text-xs block mb-1 text-gray-300"
            >
              Network
            </label>
            <input
              id="network"
              aria-label="Network"
              className="border rounded px-2 py-1 w-full text-black bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              value={AppConfig.network}
              readOnly
            />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label
              htmlFor="template-select"
              className="text-xs block mb-1 text-gray-300"
            >
              Template
            </label>
            <select
              id="template-select"
              aria-label="Template"
              aria-describedby="template-help"
              className="border rounded px-2 py-1 w-full text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              onChange={(e) => applyTemplate(e.target.value)}
              defaultValue=""
            >
              <option value="">None</option>
              <option value="sip10-transfer">SIP-010 transfer</option>
              <option value="sip10-approve">SIP-010 approve</option>
              <option value="sip10-transfer-from">SIP-010 transfer-from</option>
              <option value="pool-add-liquidity">Pool add-liquidity</option>
              <option value="pool-remove-liquidity">
                Pool remove-liquidity
              </option>
              <option value="pool-swap-exact-in">Pool swap-exact-in</option>
              <option value="pool-swap-exact-out">Pool swap-exact-out</option>
            </select>
            <div id="template-help" className="text-xs text-gray-400 mt-1">
              Choose a template to prefill common arguments. Advanced editor is
              available below.
            </div>
          </div>
        </div>

        {mode === "advanced" ? (
          <ClarityArgBuilder
            onChange={onBuild}
            preset={presetRows}
            paramMeta={paramMeta}
          />
        ) : (
          <details>
            <summary className="text-xs cursor-pointer text-blue-400 hover:text-blue-300">
              Show advanced argument editor
            </summary>
            <div className="mt-2">
              <ClarityArgBuilder
                onChange={onBuild}
                preset={presetRows}
                paramMeta={paramMeta}
              />
            </div>
          </details>
        )}

        {/* Transaction preview */}
        <div className="rounded-md border border-gray-700 bg-gray-800 p-3 space-y-2">
          <h3 className="text-sm font-medium text-gray-300">Preview</h3>
          <div className="text-xs text-gray-400">
            Contract: <code className="text-gray-300">{selected}</code>
          </div>
          <div className="text-xs text-gray-400">
            Function: <code className="text-gray-300">{fnName || "-"}</code>
          </div>
          <div className="text-xs text-gray-400">
            Args (hex):{" "}
            {args.hex.length > 0 ? (
              <span className="break-all text-gray-300">
                [
                {args.hex.map((h, i) => (
                  <span key={i} className="inline-block mr-1">
                    {h}
                    {i < args.hex.length - 1 ? "," : ""}
                  </span>
                ))}
                ]
              </span>
            ) : (
              <span>-</span>
            )}
          </div>
          <div>
            <button
              type="button"
              className="text-xs px-2 py-1 rounded border border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-50"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(JSON.stringify(args.hex));
                } catch {
                  // noop
                }
              }}
              disabled={args.hex.length === 0}
            >
              Copy Args (hex)
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={sending || !fnName}
            aria-busy={sending}
            className="text-sm px-3 py-1.5 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {sending ? "Sending..." : "Open Wallet"}
          </button>
          {status && (
            <div
              role="status"
              aria-live="polite"
              className="text-xs text-gray-400"
            >
              {status}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
