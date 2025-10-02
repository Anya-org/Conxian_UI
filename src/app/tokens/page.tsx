"use client";

import React from "react";
import WalletConnectButton from "@/components/WalletConnectButton";
import { userSession } from "@/lib/wallet";
import { getAddressBalances, getFungibleTokenBalances } from "@/lib/coreApi";

export default function TokensPage() {
  const [address, setAddress] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [stx, setStx] = React.useState<{ balance?: string } | null>(null);
  const [fts, setFts] = React.useState<any[]>([]);

  const refresh = React.useCallback(async () => {
    if (!address) return;
    setLoading(true);
    const balances = await getAddressBalances(address);
    const fungibles = await getFungibleTokenBalances(address);
    setStx(balances?.stx);
    setFts(fungibles || []);
    setLoading(false);
  }, [address]);

  React.useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const data = userSession.loadUserData();
      const addr = (data?.profile?.stxAddress?.testnet || data?.profile?.stxAddress?.mainnet || "");
      setAddress(addr);
    } else {
      setAddress("");
    }
  }, []);

  React.useEffect(() => { if (address) refresh(); }, [address, refresh]);

  return (
    <div className="min-h-screen w-full p-6 sm:p-10 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tokens</h1>
        <WalletConnectButton />
      </header>

      {!address && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm">Connect your wallet to view balances.</p>
        </div>
      )}

      {address && (
        <>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Wallet</h2>
              <button onClick={refresh} disabled={loading} className="text-sm px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600">
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
            <div className="text-sm space-y-1">
              <div><span className="font-medium">Address:</span> {address}</div>
              <div><span className="font-medium">STX:</span> {stx?.balance ?? '—'}</div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="text-lg font-semibold mb-3">Fungible Tokens</h2>
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-200 dark:border-gray-700">
                    <th className="py-2 pr-4">Asset</th>
                    <th className="py-2 pr-4">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {fts.map((t: any) => (
                    <tr key={t.asset_identifier} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-2 pr-4 break-all">{t.asset_identifier}</td>
                      <td className="py-2 pr-4">{t.balance}</td>
                    </tr>
                  ))}
                  {fts.length === 0 && (
                    <tr><td className="py-2" colSpan={2}>No fungible tokens found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
