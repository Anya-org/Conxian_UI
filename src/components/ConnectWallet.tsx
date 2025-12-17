
"use client";

import React from "react";
import { useWallet } from "@/lib/wallet";

export default function ConnectWallet() {
  const { stxAddress, connectWallet, signOut } = useWallet();

  const handleWalletAction = () => {
    if (stxAddress) {
      signOut();
    } else {
      connectWallet();
    }
  };

  return (
    <button
      onClick={handleWalletAction}
      className="text-sm px-4 py-2 rounded-md border border-gray-700 hover:bg-gray-800 transition-colors font-medium"
      aria-pressed={stxAddress ? "true" : "false"}
      data-testid="connect-wallet-button"
    >
      {stxAddress
        ? `Disconnect ${stxAddress.substring(0, 4)}...${stxAddress.substring(
            stxAddress.length - 4
          )}`
        : "Connect Wallet"}
    </button>
  );
}
