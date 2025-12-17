
"use client";

import { useState, useEffect } from 'react';
import { CreditCardIcon } from '@heroicons/react/24/outline';
import { Card } from '@/components/ui/Card';
import { ContractInteractions } from '@/lib/contract-interactions';
import { CoreContracts } from '@/lib/contracts';
import { useWallet } from '@/lib/wallet';
import { Button } from '@/components/ui/Button';

interface Position {
  tokenA: string;
  tokenB: string;
  share: string;
  pairContract: string;
}

export default function Positions() {
  const [positions, setPositions] = useState<Position[]>([]);
  const { stxAddress } = useWallet();

  const handleRemoveLiquidity = async (pairContract: string) => {
    try {
      // This is a placeholder for the actual remove liquidity logic
      alert(`Removing liquidity from ${pairContract}...`);
      await ContractInteractions.removeLiquidity(pairContract);
      alert('Liquidity removed successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to remove liquidity.');
    }
  };

  useEffect(() => {
    const fetchPositions = async () => {
      if (stxAddress) {
        const fetchedPositions: Position[] = [];
        for (let i = 0; i < CoreContracts.length; i++) {
          for (let j = i + 1; j < CoreContracts.length; j++) {
            const pair = await ContractInteractions.getPair(
              CoreContracts[i].id,
              CoreContracts[j].id
            );
            if (pair.success && pair.result) {
              const shareResult = await ContractInteractions.getLiquidityProviderShare(
                pair.result.toString(),
                stxAddress
              );
              if (shareResult.success && shareResult.result) {
                fetchedPositions.push({
                  tokenA: CoreContracts[i].name,
                  tokenB: CoreContracts[j].name,
                  share: shareResult.result.toString(),
                  pairContract: pair.result.toString(),
                });
              }
            }
          }
        }
        setPositions(fetchedPositions);
      }
    };
    fetchPositions();
  }, [stxAddress]);

  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <CreditCardIcon className="w-8 h-8 mr-2 text-gray-400" />
        <h2 className="text-xl font-semibold text-gray-200">My Positions</h2>
      </div>
      {positions.length > 0 ? (
        <ul className="space-y-4">
          {positions.map((position, index) => (
            <li key={index} className="p-4 bg-gray-800 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-200">
                    {position.tokenA} / {position.tokenB}
                  </p>
                  <p className="text-sm text-gray-500">Share: {position.share}%</p>
                </div>
                <Button
                  onClick={() => handleRemoveLiquidity(position.pairContract)}
                  variant="destructive"
                >
                  Remove Liquidity
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No positions found.</p>
      )}
    </Card>
  );
}
