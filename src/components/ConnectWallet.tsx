
"use client";

import { useWallet } from "@/lib/wallet";

export default function ConnectWallet() {
  const { stxAddress, connectWallet, signOut } = useWallet();

  return (
    <button
      onClick={() => (stxAddress ? signOut() : connectWallet())}
      className="text-sm px-4 py-2 rounded-md border border-gray-700 hover:bg-gray-800 transition-colors font-medium"
    >
      {stxAddress ? `Disconnect ${stxAddress.substring(0, 6)}...` : "Connect Wallet"}
    </button>
  );
}
