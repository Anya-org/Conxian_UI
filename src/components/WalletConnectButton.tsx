"use client";

import React from "react";
import { connectWallet, userSession, signOut } from "@/lib/wallet";

export default function WalletConnectButton() {
  const [connected, setConnected] = React.useState<boolean>(userSession.isUserSignedIn());
  const [address, setAddress] = React.useState<string>("");

  React.useEffect(() => {
    if (userSession.isUserSignedIn()) {
      const data = userSession.loadUserData();
      const addr = (data?.profile?.stxAddress?.testnet || data?.profile?.stxAddress?.mainnet || "");
      setAddress(addr);
      setConnected(true);
    } else {
      setAddress("");
      setConnected(false);
    }
  }, []);

  const onClick = () => {
    if (!userSession.isUserSignedIn()) {
      connectWallet();
    } else {
      signOut();
      setConnected(false);
      setAddress("");
    }
  };

  return (
    <button
      onClick={onClick}
      className="text-sm px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
      aria-pressed={connected ? 'true' : 'false'}
    >
      {connected ? (address ? `Connected: ${address.slice(0,6)}...${address.slice(-4)}` : "Wallet Connected") : "Connect Wallet"}
    </button>
  );
}
