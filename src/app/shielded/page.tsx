'use client';

import { useState, useEffect, useCallback } from 'react';
import { ShieldCheckIcon, PlusCircleIcon, ArrowUpCircleIcon, ArrowDownCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useApi } from '@/lib/api-client';
import { useWallet } from '@/lib/wallet';
import { Input } from '@/components/ui/Input';

interface ShieldedWallet {
  id: string;
  balance: string;
}

export default function Shielded() {
  const [wallets, setWallets] = useState<ShieldedWallet[]>([]);
  const [sendAmount, setSendAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('');
  const { stxAddress, addToast } = useWallet();
  const api = useApi();

  const fetchWallets = useCallback(async () => {
    if (stxAddress) {
      const result = await api.fetchUserWallets(stxAddress);
      if (result.success && result.result) {
        // Assuming result.result is a Clarity list value
        const walletIds = (result.result as { value: { value: string }[] }).value.map(
          (v) => v.value
        );
        const walletDetails = await Promise.all(
          walletIds.map(async (id: string) => {
            const balanceResult = await api.fetchWalletBalance(id);
            return {
              id,
              balance: balanceResult.success && balanceResult.result ? balanceResult.result.toString() : '0',
            };
          })
        );
        setWallets(walletDetails);
      }
    }
  }, [stxAddress, api]);

  const handleCreateWallet = async () => {
    if (!stxAddress) return;
    try {
      await api.createNewWallet();
      addToast('New shielded wallet created! Fetching updated list...', 'success');
      fetchWallets();
    } catch (error) {
      console.error(error);
      addToast('Failed to create shielded wallet.', 'error');
    }
  };

  const handleSendFunds = async (walletId: string) => {
    if (!recipient || !sendAmount) {
      addToast('Please provide a recipient and amount.', 'info');
      return;
    }
    try {
      await api.sendFunds(walletId, recipient, parseInt(sendAmount, 10));
      addToast('Funds sent successfully!', 'success');
      fetchWallets(); // Refresh balances
    } catch (error) {
      console.error(error);
      addToast('Failed to send funds.', 'error');
    }
  };

  const handleReceiveFunds = async (walletId: string) => {
    if (!receiveAmount) {
      addToast('Please provide an amount to receive.', 'info');
      return;
    }
    try {
      await api.receiveFunds(walletId, parseInt(receiveAmount, 10));
      addToast('Funds received successfully!', 'success');
      fetchWallets(); // Refresh balances
    } catch (error) {
      console.error(error);
      addToast('Failed to receive funds.', 'error');
    }
  };


  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <ShieldCheckIcon className="w-8 h-8 mr-2 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-200">Shielded Wallets</h2>
        </div>
        <Button onClick={handleCreateWallet} variant="outline">
          <PlusCircleIcon className="w-5 h-5 mr-2" />
          Create Wallet
        </Button>
      </div>
      {wallets.length > 0 ? (
        <ul className="space-y-4">
          {wallets.map((wallet) => (
            <li key={wallet.id} className="p-4 bg-gray-800 rounded-md">
              <p className="font-medium text-gray-200">{wallet.id}</p>
              <p className="text-sm text-gray-500">Balance: {wallet.balance}</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Recipient Address"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                  <Input
                    type="text"
                    placeholder="Amount to Send"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                  />
                  <Button onClick={() => handleSendFunds(wallet.id)} size="sm">
                    <ArrowUpCircleIcon className="w-5 h-5 mr-1" />
                    Send
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Amount to Receive"
                    value={receiveAmount}
                    onChange={(e) => setReceiveAmount(e.target.value)}
                  />
                  <Button onClick={() => handleReceiveFunds(wallet.id)} size="sm">
                    <ArrowDownCircleIcon className="w-5 h-5 mr-1" />
                    Receive
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No shielded wallets found.</p>
      )}
    </Card>
  );
}
