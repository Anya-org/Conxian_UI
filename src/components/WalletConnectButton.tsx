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
      className="text-sm px-4 py-2 rounded-md border border-gray-700 hover:bg-gray-800 transition-colors font-medium"
      aria-pressed={connected ? "true" : "false"}
    >
      {connected
        ? address
          ? `Disconnect`
          : "Wallet Connected"
        : "Connect Wallet"}
    </button>
  );
}
