"use client";

import React from "react";
import ConnectWallet from "@/components/ConnectWallet";
import { userSession } from "@/lib/wallet";
import {
  getAddressBalances,
  getFungibleTokenBalances,
  AddressBalances,
  FungibleTokenBalance,
} from "@/lib/coreApi";

export default function TokensPage() {
  const [address, setAddress] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [stx, setStx] = React.useState<AddressBalances["stx"] | null>(null);
  const [fts, setFts] = React.useState<FungibleTokenBalance[]>([]);

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
      const addr =
        data?.profile?.stxAddress?.testnet ||
        data?.profile?.stxAddress?.mainnet ||
        "";
      setAddress(addr);
    } else {
      setAddress("");
    }
  }, []);

  React.useEffect(() => {
    if (address) refresh();
  }, [address, refresh]);

  return (
    <div className="min-h-screen w-full p-6 sm:p-10 space-y-8">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-light">Tokens</h1>
        <div className="lg:hidden">
          <ConnectWallet />
        </div>
      </header>

      {!address && (
        <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
          <p className="text-sm text-gray-400">
            Connect your wallet to view balances.
          </p>
        </div>
      )}

      {address && (
        <>
          <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-neutral-light">
                Wallet
              </h2>
              <button
                onClick={refresh}
                disabled={loading}
                className="text-sm px-3 py-1.5 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
            <div className="text-sm space-y-1 text-gray-400">
              <div className="break-all">
                <span className="font-medium text-gray-300">Address:</span>{" "}
                {address}
              </div>
              <div>
                <span className="font-medium text-gray-300">STX:</span>{" "}
                {stx?.balance ?? "—"}
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
            <h2 className="text-lg font-semibold mb-3 text-neutral-light">
              Fungible Tokens
            </h2>
            <div className="overflow-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-gray-700 text-gray-300">
                    <th className="py-2 pr-4">Asset</th>
                    <th className="py-2 pr-4">Balance</th>
                  </tr>
                </thead>
                <tbody className="text-gray-400">
                  {fts.map((t: FungibleTokenBalance) => (
                    <tr
                      key={t.asset_identifier}
                      className="border-b border-gray-800 hover:bg-gray-800"
                    >
                      <td className="py-2 pr-4 break-all">
                        {t.asset_identifier}
                      </td>
                      <td className="py-2 pr-4">{t.balance}</td>
                    </tr>
                  ))}
                  {fts.length === 0 && (
                    <tr>
                      <td className="py-4 text-center" colSpan={2}>
                        No fungible tokens found.
                      </td>
                    </tr>
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
