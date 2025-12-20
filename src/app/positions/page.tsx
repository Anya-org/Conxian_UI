'use client';

import React from 'react';
import { useWallet } from '@/lib/wallet';
import { useApi } from '@/lib/api-client';
import ConnectWallet from '@/components/ConnectWallet';

// Re-styled components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Position {
  pair: string;
  liquidity: number;
  balance: number;
}

export default function PositionsPage() {
  const [positions, setPositions] = React.useState<Position[]>([]);
  const [status, setStatus] = React.useState('');
  const { stxAddress } = useWallet();
  const api = useApi();

  React.useEffect(() => {
    if (stxAddress) {
      api.getPositions(stxAddress)
        .then(setPositions)
        .catch(err => {
          console.error('Error fetching positions:', err);
          setStatus('Failed to load positions.');
        });
    }
  }, [stxAddress, api]);

  return (
    <div className="min-h-screen w-full p-6 sm:p-10 space-y-8 bg-background">
      <header className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold text-text">My Positions</h1>
        <div className="lg:hidden">
          <ConnectWallet />
        </div>
      </header>

      {stxAddress ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {positions.length > 0 ? (
            positions.map((pos, index) => (
              <Card key={index} className="bg-paper">
                <CardHeader>
                  <CardTitle className="text-text">{pos.pair}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-text/80">Liquidity</p>
                    <p className="text-lg font-semibold text-text">${pos.liquidity.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text/80">My Balance</p>
                    <p className="text-lg font-semibold text-text">${pos.balance.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <Button variant="outline" className="w-full">Add</Button>
                    <Button variant="outline" className="w-full">Remove</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-text/80">No positions found.</p>
          )}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-text/80 mb-4">Connect your wallet to see your positions.</p>
          <ConnectWallet />
        </div>
      )}

      {status && <p className="text-center text-sm text-text/80 mt-6">{status}</p>}
    </div>
  );
}
