
"use client";

import { useState, useEffect } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ContractInteractions } from '@/lib/contract-interactions';
import { CoreContracts } from '@/lib/contracts';
import { useWallet } from '@/lib/wallet';

export default function AddLiquidity() {
  const [tokenA, setTokenA] = useState('');
  const [tokenB, setTokenB] = useState('');
  const [amountA, setAmountA] = useState('');
  const [amountB, setAmountB] = useState('');
  const [balanceA, setBalanceA] = useState<string | null>(null);
  const [balanceB, setBalanceB] = useState<string | null>(null);
  const { stxAddress } = useWallet();

  const handleAddLiquidity = async () => {
    if (!tokenA || !tokenB) {
      alert('Please select two tokens.');
      return;
    }
    try {
      await ContractInteractions.createPair(tokenA, tokenB);
      alert('Liquidity added successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to add liquidity.');
    }
  };

  useEffect(() => {
    const fetchBalances = async () => {
      if (stxAddress && tokenA) {
        const balance = await ContractInteractions.getTokenBalance(tokenA, stxAddress);
        setBalanceA(balance.result?.toString() ?? '0');
      }
      if (stxAddress && tokenB) {
        const balance = await ContractInteractions.getTokenBalance(tokenB, stxAddress);
        setBalanceB(balance.result?.toString() ?? '0');
      }
    };
    fetchBalances();
  }, [stxAddress, tokenA, tokenB]);


  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <PlusCircleIcon className="w-8 h-8 mr-2 text-gray-400" />
        <h2 className="text-xl font-semibold text-gray-200">Add Liquidity</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="tokenA" className="block text-sm font-medium text-gray-300">
            Token A
          </label>
          <select
            id="tokenA"
            value={tokenA}
            onChange={(e) => setTokenA(e.target.value)}
            className="block w-full px-3 py-2 mt-1 text-gray-200 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select Token</option>
            {CoreContracts.map((contract) => (
              <option key={contract.id} value={contract.id}>
                {contract.name}
              </option>
            ))}
          </select>
          {balanceA && <p className="mt-1 text-sm text-gray-500">Balance: {balanceA}</p>}
        </div>
        <div>
          <label htmlFor="amountA" className="block text-sm font-medium text-gray-300">
            Amount A
          </label>
          <input
            type="text"
            id="amountA"
            value={amountA}
            onChange={(e) => setAmountA(e.target.value)}
            className="block w-full px-3 py-2 mt-1 text-gray-200 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="tokenB" className="block text-sm font-medium text-gray-300">
            Token B
          </label>
          <select
            id="tokenB"
            value={tokenB}
            onChange={(e) => setTokenB(e.target.value)}
            className="block w-full px-3 py-2 mt-1 text-gray-200 bg-gray-800 border border-gray-700 rounded-.md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select Token</option>
            {CoreContracts.map((contract) => (
              <option key={contract.id} value={contract.id}>
                {contract.name}
              </option>
            ))}
          </select>
          {balanceB && <p className="mt-1 text-sm text-gray-500">Balance: {balanceB}</p>}
        </div>
        <div>
          <label htmlFor="amountB" className="block text-sm font-medium text-gray-300">
            Amount B
          </label>
          <input
            type="text"
            id="amountB"
            value={amountB}
            onChange={(e) => setAmountB(e.target.value)}
            className="block w-full px-3 py-2 mt-1 text-gray-200 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <Button onClick={handleAddLiquidity} className="w-full mt-6">
        Add Liquidity
      </Button>
    </Card>
  );
}
