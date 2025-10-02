"use client";

import React from "react";

export default function WalletConnectButton() {
  const [connected, setConnected] = React.useState(false);

  const onClick = () => {
    // TODO: Integrate @stacks/connect wallet flow
    setConnected((v: boolean) => !v);
  };

  return (
    <button
      onClick={onClick}
      className="text-sm px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
      aria-pressed={connected ? 'true' : 'false'}
    >
      {connected ? "Wallet Connected" : "Connect Wallet"}
    </button>
  );
}
