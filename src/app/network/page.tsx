"use client";

import React from "react";
import { AppConfig } from "@/lib/config";
import {
  getStatus,
  getNetworkBlockTimes,
  getMempool,
  CoreStatus,
  MempoolTx,
} from "@/lib/coreApi";

export default function NetworkPage() {
  const [status, setStatus] = React.useState<CoreStatus | null>(null);
  const [blocks, setBlocks] = React.useState<unknown | null>(null);
  const [mempool, setMempool] = React.useState<MempoolTx[]>([]);
  const [loading, setLoading] = React.useState(false);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    const [s, b, m] = await Promise.all([
      getStatus(),
      getNetworkBlockTimes(),
      getMempool(15),
    ]);
    setStatus(s);
    setBlocks(b);
    setMempool(m || []);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div className="min-h-screen w-full p-6 sm:p-10 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-light">Network</h1>
        <button
          onClick={refresh}
          disabled={loading}
          className="text-sm px-3 py-1.5 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-800"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
          <h2 className="text-lg font-semibold mb-2 text-neutral-light">
            Environment
          </h2>
          <div className="text-sm space-y-1 text-gray-400">
            <div>
              <span className="font-medium text-gray-300">Core API:</span>{" "}
              {AppConfig.coreApiUrl}
            </div>
            <div>
              <span className="font-medium text-gray-300">Network:</span>{" "}
              {AppConfig.network}
            </div>
            <div>
              <span className="font-medium text-gray-300">Status:</span>{" "}
              {status?.ok
                ? `OK (chain_id=${status.chain_id}, network=${status.network_id})`
                : `Error ${status?.error || "unknown"}`}
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
          <h2 className="text-lg font-semibold mb-2 text-neutral-light">
            Block Times
          </h2>
          <pre className="text-xs overflow-auto text-gray-300">
            {blocks ? JSON.stringify(blocks, null, 2) : "No data"}
          </pre>
        </div>
      </div>

      <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
        <h2 className="text-lg font-semibold mb-3 text-neutral-light">
          Mempool (latest)
        </h2>
        <div className="overflow-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-700 text-gray-300">
                <th className="py-2 pr-4">Tx ID</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Sender</th>
                <th className="py-2 pr-4">Nonce</th>
              </tr>
            </thead>
            <tbody className="text-gray-400">
              {mempool.map((tx: MempoolTx) => (
                <tr
                  key={tx.tx_id}
                  className="border-b border-gray-800 hover:bg-gray-800"
                >
                  <td className="py-2 pr-4 break-all">{tx.tx_id}</td>
                  <td className="py-2 pr-4">{tx.tx_type}</td>
                  <td className="py-2 pr-4 break-all">{tx.sender_address}</td>
                  <td className="py-2 pr-4">{tx.nonce}</td>
                </tr>
              ))}
              {mempool.length === 0 && (
                <tr>
                  <td className="py-4 text-center" colSpan={4}>
                    No transactions in mempool.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
