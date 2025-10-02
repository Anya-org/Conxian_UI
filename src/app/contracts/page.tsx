"use client";

import React from "react";
import { AppConfig } from "@/lib/config";
import { CoreContracts, Tokens, explorerContractUrl } from "@/lib/contracts";
import { getContractInterface, callReadOnly } from "@/lib/coreApi";

export default function ContractsPage() {
  const [principal, setPrincipal] = React.useState<string>("ST3PPMPR7SAY4CAKQ4ZMYC2Q9FAVBE813YWNJ4JE6");
  const [name, setName] = React.useState<string>("dex-factory");
  const [iface, setIface] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(false);

  const [fnName, setFnName] = React.useState<string>("");
  const [args, setArgs] = React.useState<string>("");
  const [sender, setSender] = React.useState<string>("ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5");
  const [callRes, setCallRes] = React.useState<any | null>(null);

  const loadInterface = React.useCallback(async () => {
    if (!principal || !name) return;
    setLoading(true);
    const i = await getContractInterface(principal, name);
    setIface(i);
    setLoading(false);
  }, [principal, name]);

  React.useEffect(() => { loadInterface(); }, [loadInterface]);

  const onSelect = (id: string) => {
    const [p, n] = id.split('.');
    setPrincipal(p);
    setName(n);
    setIface(null);
  };

  const makeReadOnly = async () => {
    if (!fnName) return;
    setCallRes(null);
    const argsHex = args.split('\n').map(s => s.trim()).filter(Boolean);
    const res = await callReadOnly(principal, name, fnName, sender, argsHex);
    setCallRes(res);
  };

  const all = [...Tokens, ...CoreContracts];

  return (
    <div className="min-h-screen w-full p-6 sm:p-10 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Contracts</h1>
        <div className="text-sm text-gray-600">Network: {AppConfig.network}</div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-semibold mb-2">Select Contract</h2>
          <div className="text-sm space-y-2">
            <select aria-label="Select contract" className="border rounded px-2 py-1 w-full" value={`${principal}.${name}`} onChange={e => onSelect(e.target.value)}>
              {all.map(c => (
                <option key={c.id} value={c.id}>{c.label} — {c.id}</option>
              ))}
            </select>
            <div>
              <span className="font-medium">Explorer:</span>{' '}
              <a className="text-blue-600 hover:underline" href={explorerContractUrl(`${principal}.${name}`, AppConfig.network as any)} target="_blank" rel="noreferrer">Open</a>
            </div>
            <button onClick={loadInterface} disabled={loading} className="text-sm px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600">
              {loading ? 'Loading...' : 'Fetch Interface'}
            </button>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-semibold mb-2">Interface</h2>
          <pre className="text-xs overflow-auto">{iface ? JSON.stringify(iface, null, 2) : 'No interface loaded'}</pre>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-lg font-semibold mb-2">Read-Only Call</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-xs block mb-1">Function Name</label>
            <input value={fnName} onChange={e => setFnName(e.target.value)} className="border rounded px-2 py-1 w-full" placeholder="get-balance-of" />
          </div>
          <div>
            <label className="text-xs block mb-1">Sender</label>
            <input value={sender} onChange={e => setSender(e.target.value)} className="border rounded px-2 py-1 w-full" placeholder="ST..." />
          </div>
          <div>
            <label className="text-xs block mb-1">Arguments (hex, one per line)</label>
            <textarea value={args} onChange={e => setArgs(e.target.value)} className="border rounded px-2 py-1 w-full h-24" placeholder="0x0000000000000000000000000000000000000000\n0x0000000000000000000000000000000000000001" />
          </div>
        </div>
        <div className="mt-3">
          <button onClick={makeReadOnly} className="text-sm px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600">Call</button>
        </div>
        <div className="mt-3">
          <pre className="text-xs overflow-auto">{callRes ? JSON.stringify(callRes, null, 2) : 'No call yet'}</pre>
        </div>
      </div>
    </div>
  );
}
