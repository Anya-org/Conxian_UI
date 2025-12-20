'use client';

import React from 'react';
import { Tokens } from '@/lib/contracts';
import { useWallet } from '@/lib/wallet';
import ConnectWallet from '@/components/ConnectWallet';
import { IntentManager } from '@/lib/intent-manager';

// Re-styled components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const intentManager = new IntentManager();

export default function AddLiquidityPage() {
  const [tokenA, setTokenA] = React.useState(Tokens[0].id);
  const [tokenB, setTokenB] = React.useState(Tokens[1].id);
  const [amountA, setAmountA] = React.useState('100');
  const [amountB, setAmountB] = React.useState('200');
  const [status, setStatus] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const { connectWallet, stxAddress } = useWallet();

  const handleAddLiquidity = async () => {
    if (!stxAddress) {
      setStatus('Please connect wallet to add liquidity');
      return;
    }
    if (!tokenA || !tokenB || !amountA || !amountB) {
      setStatus('Please fill in all fields');
      return;
    }

    setSending(true);
    setStatus('');

    try {
      const result = await intentManager.execute({
        type: 'invest-pool',
        tokenA: tokenA,
        tokenB: tokenB,
        amountA: parseFloat(amountA),
        amountB: parseFloat(amountB),
      });
      setStatus(`Liquidity added. Tx ID: ${result.txId}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatus(`Error: ${msg}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen w-full p-6 sm:p-10 space-y-8 bg-background">
      <header className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold text-text">Add Liquidity</h1>
        <div className="lg:hidden">
          <ConnectWallet />
        </div>
      </header>

      <Card className="w-full max-w-md mx-auto bg-paper">
        <CardHeader>
          <CardTitle className="text-text">Add Liquidity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Token A */}
          <div className="space-y-2">
            <label htmlFor="token-a" className="text-sm text-text/80">Token A</label>
            <div className="flex items-center gap-2">
              <select
                id="token-a"
                value={tokenA}
                onChange={(e) => setTokenA(e.target.value)}
                className="w-full rounded-md border-accent/20 bg-paper text-text py-2 px-3"
              >
                {Tokens.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
              <Input
                type="number"
                id="amount-a"
                value={amountA}
                onChange={(e) => setAmountA(e.target.value)}
                className="w-full text-right"
                placeholder="0.0"
              />
            </div>
          </div>

          {/* Token B */}
          <div className="space-y-2">
            <label htmlFor="token-b" className="text-sm text-text/80">Token B</label>
            <div className="flex items-center gap-2">
              <select
                id="token-b"
                value={tokenB}
                onChange={(e) => setTokenB(e.target.value)}
                className="w-full rounded-md border-accent/20 bg-paper text-text py-2 px-3"
              >
                {Tokens.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
              <Input
                type="number"
                id="amount-b"
                value={amountB}
                onChange={(e) => setAmountB(e.target.value)}
                className="w-full text-right"
                placeholder="0.0"
              />
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            {stxAddress ? (
              <Button
                onClick={handleAddLiquidity}
                disabled={sending}
                className="w-full bg-primary hover:bg-primary/90 text-light"
              >
                {sending ? 'Adding...' : 'Add Liquidity'}
              </Button>
            ) : (
              <Button onClick={connectWallet} className="w-full bg-primary hover:bg-primary/90 text-light">
                Connect Wallet
              </Button>
            )}
          </div>
          
          {status && <p className="text-center text-sm text-text/80 mt-4">{status}</p>}

        </CardContent>
      </Card>
    </div>
  );
}
