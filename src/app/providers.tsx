
"use client";

import { useToasts } from "@/hooks/useToasts";
import { WalletProvider } from "@/lib/wallet";

export function Providers({ children }: { children: React.ReactNode }) {
  const { ToastContainer } = useToasts();

  return (
    <WalletProvider>
      {children}
      <ToastContainer />
    </WalletProvider>
  );
}
