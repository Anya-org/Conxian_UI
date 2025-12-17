
"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppConfig, UserSession, showConnect, AuthOptions } from '@stacks/connect';
import { useToasts } from '@/hooks/useToasts';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

interface WalletContextType {
  stxAddress: string | null;
  connectWallet: () => void;
  signOut: () => void;
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [stxAddress, setStxAddress] = useState<string | null>(null);
  const { addToast, ToastContainer } = useToasts();

  useEffect(() => {
    if (userSession.isUserSignedIn()) {
      setStxAddress(userSession.loadUserData().profile.stxAddress.mainnet);
    }
  }, []);

  const connectWallet = () => {
    const authOptions: AuthOptions = {
      appDetails: {
        name: 'Conxian Unified Dashboard',
        icon: '/favicon.ico',
      },
      redirectTo: '/',
      onFinish: () => {
        window.location.reload();
        addToast('Wallet connected successfully!', 'success');
      },
      userSession,
    };
    showConnect(authOptions);
  };

  const signOut = () => {
    userSession.signUserOut('/');
    addToast('Signed out successfully.', 'info');
  };

  return (
    <WalletContext.Provider value={{ stxAddress, connectWallet, signOut, addToast }}>
      {children}
      <ToastContainer />
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
