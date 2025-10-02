"use client";

import React from "react";
import { AppConfig } from "@/lib/config";
import { getStatus } from "@/lib/coreApi";

export default function EnvStatus() {
  const [status, setStatus] = React.useState<{
    ok: boolean;
    chain_id?: number;
    network_id?: string;
    error?: string;
  } | null>(null);
  const [loading, setLoading] = React.useState(false);

  const refresh = React.useCallback(async () => {
    setLoading(true);
    const s = await getStatus();
    setStatus(s);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const indicator = status?.ok ? "bg-green-500" : "bg-red-500";

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 w-full max-w-xl">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Environment</h2>
        <span className={`inline-block h-2 w-2 rounded-full ${indicator}`} />
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
        <div>
          <span className="font-medium">Core API:</span> {AppConfig.coreApiUrl}
        </div>
        <div>
          <span className="font-medium">Network:</span> {AppConfig.network}
        </div>
        {status && (
          <div>
            <span className="font-medium">Status:</span>{" "}
            {status.ok
              ? `OK (chain_id=${status.chain_id}, network=${status.network_id})`
              : `Error ${status.error || "unknown"}`}
          </div>
        )}
      </div>
      <div className="mt-3">
        <button
          onClick={refresh}
          disabled={loading}
          className="text-sm px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>
    </div>
  );
}
