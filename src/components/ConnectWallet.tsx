"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@/lib/wallet";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    StacksProvider?: any;
  }
}

export default function ConnectWallet() {
  const { stxAddress, connectWallet, signOut } = useWallet();
  const [isStacksAvailable, setIsStacksAvailable] = useState(false);

  useEffect(() => {
    if (window.StacksProvider) {
      setIsStacksAvailable(true);
    }
  }, []);

  const handleWalletAction = () => {
    if (!isStacksAvailable) {
      alert("Please install a Stacks wallet to connect.");
      return;
    }

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
      disabled={!isStacksAvailable}
    >
      {!isStacksAvailable
        ? "Install Wallet"
        : stxAddress
        ? `Disconnect ${stxAddress.substring(0, 4)}...${stxAddress.substring(
            stxAddress.length - 4
          )}`
        : "Connect Wallet"}
    </button>
  );
}
