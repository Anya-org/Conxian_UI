'use client';

import React from 'react';
import { openContractCall } from "@stacks/connect";
import { 
  uintCV, 
  cvToHex, 
  contractPrincipalCV, 
  PostConditionMode
} from "@stacks/transactions";
import { Tokens, CoreContracts } from '@/lib/contracts';
import { callReadOnly } from "@/lib/coreApi";
import { decodeResultHex, getTupleField } from "@/lib/clarity";
import { useWallet } from '@/lib/wallet';
import ConnectWallet from '@/components/ConnectWallet';
// import { IntentManager } from '@/lib/intent-manager'; // Unused

// Re-styled components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// const intentManager = new IntentManager(); // Unused

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function getPrincipalValue(json: unknown): string | null {
  if (!isRecord(json)) return null;
  if (json["type"] !== "principal") return null;
  return typeof json["value"] === "string" ? json["value"] : null;
}

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
    setStatus('Resolving pool...');

    try {
        // 1. Find Pool via Factory
        const factory = CoreContracts.find((c) => c.id.endsWith(".dex-factory-v2"));
        if (!factory) throw new Error("DEX Factory not found");
        
        const [factoryAddress, factoryName] = factory.id.split(".") as [string, string];
        const [tokenAAddress, tokenAName] = tokenA.split(".") as [string, string];
        const [tokenBAddress, tokenBName] = tokenB.split(".") as [string, string];
        const getPoolArgs = [
            cvToHex(contractPrincipalCV(tokenAAddress, tokenAName)),
            cvToHex(contractPrincipalCV(tokenBAddress, tokenBName)),
        ];

        const poolRes = await callReadOnly(
            factoryAddress,
            factoryName,
            "get-pool",
            factoryAddress,
            getPoolArgs
        );

        let poolPrincipal = "";
        if (poolRes.ok && poolRes.result) {
            const decoded = decodeResultHex(poolRes.result);
            if (decoded && decoded.ok) {
              const poolField = getTupleField(decoded.value, "pool");
              const principal = getPrincipalValue(poolField);
              if (principal) poolPrincipal = principal;
            }
        }

        if (!poolPrincipal) {
            setStatus("Pool not found. You may need to create it first.");
            setSending(false);
            return;
        }

        // 2. Fetch Reserves/Token Order from Pool (to map A/B to 0/1)
        // Actually, we can check contract calls or just read the `token0` `token1` vars if exposed.
        // Or assume the user provided TokenA and TokenB might be in either order.
        // The `add-liquidity` function requires `token0-inst` and `token1-inst`.
        // These MUST match the pool's definition.
        // We need to know which is which.
        // A common convention is sorting by principal.
        // Let's verify by checking the pool's token0/token1.
        
        // Since we can't easily read individual vars without a custom read-only call or map-get,
        // we can try to infer from sort order.
        // Contracts typically sort.
        // Let's perform a lightweight sort here.
        
        const sorted = [tokenA, tokenB].sort();
        const t0 = sorted[0];
        const t1 = sorted[1];
        
        // Map amounts
        const amt0 = t0 === tokenA ? amountA : amountB;
        const amt1 = t1 === tokenB ? amountB : amountA;

        // Amounts need to be integers (scaled). Assuming decimals are handled or inputs are raw.
        // Using inputs as raw integers for now as simplified example, but should use parseAmount.
        // Re-using logic:
        // const t0Decimals = Tokens.find(t => t.id === t0)?.decimals || 6;
        // const t1Decimals = Tokens.find(t => t.id === t1)?.decimals || 6;
        // const amt0Int = BigInt(parseFloat(amt0) * (10 ** t0Decimals)); // Rough
        
        // Let's assume input is raw for simplicity or apply simple scaling
        const amt0Int = BigInt(Math.floor(parseFloat(amt0) * 1000000)); // Default 6 decimals
        const amt1Int = BigInt(Math.floor(parseFloat(amt1) * 1000000));

        const [poolAddr, poolName] = poolPrincipal.split(".");

        await openContractCall({
            contractAddress: poolAddr,
            contractName: poolName,
            functionName: "add-liquidity",
            functionArgs: [
                uintCV(amt0Int),
                uintCV(amt1Int),
                contractPrincipalCV(...(t0.split(".") as [string, string])),
                contractPrincipalCV(...(t1.split(".") as [string, string]))
            ],
            postConditionMode: PostConditionMode.Allow,
            postConditions: [],
            onFinish: (data) => {
                setStatus(`Liquidity added. Tx ID: ${data.txId}`);
                setSending(false);
            },
            onCancel: () => {
                setStatus("Transaction canceled");
                setSending(false);
            }
        });

    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatus(`Error: ${msg}`);
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

      <Card className="w-full max-w-md mx-auto bg-background-paper">
        <CardHeader>
          <CardTitle className="text-text-primary">Add Liquidity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Token A */}
          <div className="space-y-2">
            <label htmlFor="token-a" className="text-sm text-text-secondary">Token A</label>
            <div className="flex items-center gap-2">
              <select
                id="token-a"
                value={tokenA}
                onChange={(e) => setTokenA(e.target.value)}
                className="w-full rounded-md border-gray-600 bg-background-paper text-text-primary py-2 px-3"
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
            <label htmlFor="token-b" className="text-sm text-text-secondary">Token B</label>
            <div className="flex items-center gap-2">
              <select
                id="token-b"
                value={tokenB}
                onChange={(e) => setTokenB(e.target.value)}
                className="w-full rounded-md border-gray-600 bg-background-paper text-text-primary py-2 px-3"
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
