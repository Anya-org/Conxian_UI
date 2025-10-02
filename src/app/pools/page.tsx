"use client";

import React from "react";
import { AppConfig } from "@/lib/config";
import { CoreContracts } from "@/lib/contracts";
import { callReadOnly, ReadOnlyResponse } from "@/lib/coreApi";
import { decodeResultHex, getTupleField, getUint } from "@/lib/clarity";

const DEFAULT_SENDER = "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5";

export default function PoolsPage() {
  const dexPools = CoreContracts.filter(c => c.kind === 'dex');
  const [selected, setSelected] = React.useState<string>(dexPools[0]?.id || "");
  const [loading, setLoading] = React.useState(false);

  const [reserves, setReserves] = React.useState<ReadOnlyResponse | null>(null);
  const [totalSupply, setTotalSupply] = React.useState<ReadOnlyResponse | null>(null);
  const [price, setPrice] = React.useState<ReadOnlyResponse | null>(null);
  const [feeInfo, setFeeInfo] = React.useState<ReadOnlyResponse | null>(null);

  const refresh = React.useCallback(async () => {
    if (!selected) return;
    const [contractAddress, contractName] = selected.split('.') as [string, string];
    setLoading(true);
    try {
      const [r1, r2, r3, r4] = await Promise.all([
        callReadOnly(contractAddress, contractName, 'get-reserves', DEFAULT_SENDER, []),
        callReadOnly(contractAddress, contractName, 'get-total-supply', DEFAULT_SENDER, []),
        callReadOnly(contractAddress, contractName, 'get-price', DEFAULT_SENDER, []),
        callReadOnly(contractAddress, contractName, 'get-fee-info', DEFAULT_SENDER, []),
      ]);
      setReserves(r1);
      setTotalSupply(r2);
      setPrice(r3);
      setFeeInfo(r4);
    } finally {
      setLoading(false);
    }
  }, [selected]);

  React.useEffect(() => { refresh(); }, [refresh]);

  return (
    <div className="min-h-screen w-full p-6 sm:p-10 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pools</h1>
        <div className="text-sm text-gray-600">Network: {AppConfig.network}</div>
      </header>

      <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-xs block mb-1">Pool Contract</label>
            <select aria-label="Pool contract" className="border rounded px-2 py-1 w-full" value={selected} onChange={e => setSelected(e.target.value)}>
              {dexPools.map(c => (
                <option key={c.id} value={c.id}>{c.label} — {c.id}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={refresh} disabled={loading || !selected} className="text-sm px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600">
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded border border-gray-200 dark:border-gray-700 p-3">
            <div className="font-medium mb-1">Reserves</div>
            <pre className="text-xs overflow-auto">{reserves ? JSON.stringify(reserves, null, 2) : '—'}</pre>
          </div>
          <div className="rounded border border-gray-200 dark:border-gray-700 p-3">
            <div className="font-medium mb-1">Total Supply</div>
            <pre className="text-xs overflow-auto">{totalSupply ? JSON.stringify(totalSupply, null, 2) : '—'}</pre>
          </div>
          <div className="rounded border border-gray-200 dark:border-gray-700 p-3">
            <div className="font-medium mb-1">Price</div>
            <pre className="text-xs overflow-auto">{price ? JSON.stringify(price, null, 2) : '—'}</pre>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 mt-4">
          <div className="rounded border border-gray-200 dark:border-gray-700 p-3">
            <div className="font-medium mb-1">Fee Info</div>
            <pre className="text-xs overflow-auto">{feeInfo ? JSON.stringify(feeInfo, null, 2) : '—'}</pre>
          </div>
          <div className="rounded border border-gray-200 dark:border-gray-700 p-3">
            <div className="font-medium mb-1">Derived KPIs</div>
            <DerivedKPIs reserves={reserves} price={price} feeInfo={feeInfo} />
          </div>
        </div>
      </div>
    </div>
  );
}

function DerivedKPIs({ reserves, price, feeInfo }: { reserves: ReadOnlyResponse | null; price: ReadOnlyResponse | null; feeInfo: ReadOnlyResponse | null }) {
  const r = (reserves && 'result' in reserves) ? decodeResultHex(reserves.result) : null;
  const p = (price && 'result' in price) ? decodeResultHex(price.result) : null;
  const f = (feeInfo && 'result' in feeInfo) ? decodeResultHex(feeInfo.result) : null;

  const reserveAU = getUint(getTupleField(r?.value ?? null, 'reserve-a'));
  const reserveBU = getUint(getTupleField(r?.value ?? null, 'reserve-b'));
  const priceXYU = getUint(getTupleField(p?.value ?? null, 'price-x-y'));
  const priceYXU = getUint(getTupleField(p?.value ?? null, 'price-y-x'));
  const lpFeeBpsU = getUint(getTupleField(f?.value ?? null, 'lp-fee-bps'));
  const protocolFeeBpsU = getUint(getTupleField(f?.value ?? null, 'protocol-fee-bps'));

  const lpFeeBps = lpFeeBpsU !== null ? Number(lpFeeBpsU) : null;
  const protocolFeeBps = protocolFeeBpsU !== null ? Number(protocolFeeBpsU) : null;
  const totalFeeBps = (lpFeeBps ?? 0) + (protocolFeeBps ?? 0);
  const inventorySkew = reserveAU !== null && reserveBU !== null ? Number(reserveAU) / Math.max(1, Number(reserveBU)) : null;

  return (
    <div className="text-xs space-y-1">
      <div><span className="font-medium">LP Fee (bps):</span> {lpFeeBps ?? '—'}</div>
      <div><span className="font-medium">Protocol Fee (bps):</span> {protocolFeeBps ?? '—'}</div>
      <div><span className="font-medium">Total Fee (bps):</span> {Number.isFinite(totalFeeBps) ? totalFeeBps : '—'}</div>
      <div><span className="font-medium">Price X/Y:</span> {priceXYU !== null ? Number(priceXYU) : '—'}</div>
      <div><span className="font-medium">Price Y/X:</span> {priceYXU !== null ? Number(priceYXU) : '—'}</div>
      <div><span className="font-medium">Inventory Skew (A/B):</span> {inventorySkew !== null ? inventorySkew.toFixed(4) : '—'}</div>
    </div>
  );
}
