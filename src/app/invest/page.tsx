
"use client";

import { useState } from 'react';
import { useApi } from '@/lib/api-client';
import { useToasts } from '@/hooks/useToasts';

export default function InvestPage() {
  const [amount, setAmount] = useState('');
  const api = useApi();
  const { addToast, ToastContainer } = useToasts();

  const handleInvest = async () => {
    if (!amount) {
      addToast('Please enter an amount to invest.', 'error');
      return;
    }

    try {
      const result = await api.executeIntent({
        type: 'invest-pool',
        poolId: 'your-pool-id', // Replace with the actual pool ID
        amount: Number(amount),
      });

      if (result.status === 'success' || result.status === 'pending') {
        addToast(`Investment Initiated. Transaction ID: ${result.txId}`, 'success');
      } else {
        addToast('Investment Failed. An error occurred while processing your investment.', 'error');
      }
    } catch (_error) {
      addToast('Error. An unexpected error occurred.', 'error');
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Invest in Liquidity Pool</h1>
      <p className="mb-4">
        Invest your tokens in our liquidity pools to earn rewards.
      </p>
      <div className="flex flex-col space-y-4">
        <input
          type="number"
          placeholder="Amount to invest"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={handleInvest}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Invest
        </button>
      </div>
    </div>
  );
}
