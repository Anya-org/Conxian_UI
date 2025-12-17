"use client";

import React from "react";
import { connectWallet, userSession, signOut } from "@/lib/wallet";

export default function WalletConnectButton() {
  const [address, setAddress] = React.useState<string>(() => {
    if (userSession.isUserSignedIn()) {
      const data = userSession.loadUserData();
      return (data?.profile?.stxAddress?.testnet || data?.profile?.stxAddress?.mainnet || "");
    }
    return "";
  });

  const [connected, setConnected] = React.useState<boolean>(!!address);

  React.useEffect(() => {
    const handleWalletChange = () => {
      if (userSession.isUserSignedIn()) {
        const data = userSession.loadUserData();
        const addr = (data?.profile?.stxAddress?.testnet || data?.profile?.stxAddress?.mainnet || "");
        setAddress(addr);
        setConnected(true);
      } else {
        setAddress("");
        setConnected(false);
      }
    };
    window.addEventListener('wallet-changed', handleWalletChange);
    return () => {
      window.removeEventListener('wallet-changed', handleWalletChange);
    };
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
      data-testid="connect-wallet-button"
    >
      {connected ? `Disconnect ${address.substring(0, 4)}...${address.substring(address.length - 4)}` : "Connect Wallet"}
    </button>
  );
}
