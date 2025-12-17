"use client";

import React from "react";
import { Tokens, CoreContracts } from "@/lib/contracts";
import {
  callReadOnly,
  getFungibleTokenBalances,
  FungibleTokenBalance,
} from "@/lib/coreApi";
import { decodeResultHex, getUint } from "@/lib/clarity";
import { standardPrincipalCV, uintCV, cvToHex } from "@stacks/transactions";
import { userSession, connectWallet } from "@/lib/wallet";
import ConnectWallet from "@/components/ConnectWallet";
import { BankingService } from "@/lib/banking-api";

function formatAmount(amount: string, decimals = 6): string {
  if (!amount) return "0";
  try {
    const padded = amount.padStart(decimals + 1, "0");
    const integerPart = padded.slice(0, -decimals);
    const fractionalPart = padded.slice(-decimals);
    return `${integerPart}.${fractionalPart}`;
  } catch {
    return "0";
  }
}

function parseAmount(amount: string, decimals = 6): string {
  if (!amount) return "0";
  try {
    const [integerPart, fractionalPart = ""] = amount.split(".");
    const paddedFractional = fractionalPart
      .substring(0, decimals)
      .padEnd(decimals, "0");
    return BigInt(integerPart + paddedFractional).toString();
  } catch {
    return "0";
  }
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/Tabs";

export default function SwapPage() {
  const [fromToken, setFromToken] = React.useState(Tokens[0].id);
  const [toToken, setToToken] = React.useState(Tokens[1].id);
  const [fromAmount, setFromAmount] = React.useState("1000000");
  const debouncedFromAmount = useDebounce(fromAmount, 500);
  const [toAmount, setToAmount] = React.useState("");
  const [slippage, setSlippage] = React.useState(0.5);
  const [balances, setBalances] = React.useState<FungibleTokenBalance[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [status, setStatus] = React.useState<string>("");
  const [isSignedIn, setIsSignedIn] = React.useState(false);

  const fromTokenInfo = Tokens.find((t) => t.id === fromToken);
  const toTokenInfo = Tokens.find((t) => t.id === toToken);
  const fromTokenBalance = balances.find(
    (b) => b.asset_identifier === fromToken
  );
  const isSameToken = fromToken === toToken;

  const getEstimate = React.useCallback(async () => {
    if (!fromToken || !toToken || !debouncedFromAmount || isSameToken) return;

    const router = CoreContracts.find((c) =>
      c.id.endsWith(".multi-hop-router-v3")
    );
    if (!router) {
      console.error("Router contract not found");
      return;
    }

    const [contractAddress, contractName] = router.id.split(".") as [
      string,
      string,
    ];
    const functionName = "estimate-output";

    const fromTokenCV = standardPrincipalCV(fromToken);
    const toTokenCV = standardPrincipalCV(toToken);
    const fromAmountCV = uintCV(debouncedFromAmount);

    const argsHex = [
      cvToHex(fromTokenCV),
      cvToHex(toTokenCV),
      cvToHex(fromAmountCV),
    ];

    setLoading(true);
    try {
      const res = await callReadOnly(
        contractAddress,
        contractName,
        functionName,
        contractAddress,
        argsHex
      );
      if (res.ok && res.result) {
        const decoded = decodeResultHex(res.result);
        if (decoded && decoded.ok) {
          const uint = getUint(decoded.value);
          if (uint !== null) {
            setToAmount(String(uint));
          }
        }
      }
    } finally {
      setLoading(false);
    }
  }, [fromToken, toToken, debouncedFromAmount, isSameToken]);

  const handleSwap = async () => {
    if (!fromToken || !toToken || !fromAmount || !toAmount || isSameToken)
      return;
    if (!userSession.isUserSignedIn()) {
      setStatus("Please connect wallet to swap");
      return;
    }

    setSending(true);
    setStatus("");
    try {
      // Use the new BankingService abstraction
      const result = await BankingService.executeIntent({
        type: 'swap',
        fromToken: fromToken,
        toToken: toToken,
        amount: Number(fromAmount) / 1_000_000, // Convert back to STX units as API expects number
      });
      
      setStatus(`Submitted. Tx ID: ${result.txId}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setStatus(`Error: ${msg}`);
    } finally {
      setSending(false);
    }
  };

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setFromAmount(parseAmount(value, fromTokenInfo?.decimals));
    }
  };

  const handleFromTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFromToken(e.target.value);
    setToAmount("");
  };

  const handleToTokenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setToToken(e.target.value);
    setToAmount("");
  };

  const invertTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount("");
  };

  React.useEffect(() => {
    getEstimate();
  }, [getEstimate]);

  React.useEffect(() => {
    const session = userSession.isUserSignedIn();
    if (session) {
      setIsSignedIn(true);
      const { address } = userSession.loadUserData().profile.stxAddress;
      getFungibleTokenBalances(address).then(setBalances);
    } else {
      setIsSignedIn(false);
    }
  }, []);

  return (
    <div className="min-h-screen w-full p-6 sm:p-10 space-y-8">
      <header className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold text-neutral-light">Swap</h1>
        <div className="lg:hidden">
          <ConnectWallet />
        </div>
      </header>
      <Tabs defaultValue="simple" className="w-full max-w-md mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simple">Simple</TabsTrigger>
          <TabsTrigger value="optimized">Optimized</TabsTrigger>
        </TabsList>
        <TabsContent value="simple">
          <Card>
            <CardHeader>
              <CardTitle>Simple Swap</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <label>From</label>
                    <span>
                      Balance:{" "}
                      {fromTokenBalance
                        ? formatAmount(
                            fromTokenBalance.balance,
                            fromTokenInfo?.decimals
                          )
                        : 0}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <select
                      aria-label="From token"
                      className="border rounded px-2 py-1 w-full text-black"
                      value={fromToken}
                      onChange={handleFromTokenChange}
                    >
                      {Tokens.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <input
                      aria-label="From amount"
                      className="border rounded px-2 py-1 w-full text-black"
                      value={formatAmount(fromAmount, fromTokenInfo?.decimals)}
                      onChange={handleFromAmountChange}
                    />
                    <button
                      onClick={() =>
                        setFromAmount(fromTokenBalance?.balance || "0")
                      }
                      className="text-xs px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600"
                    >
                      Max
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <button
                    onClick={invertTokens}
                    className="p-1 rounded-full border border-gray-300 dark:border-gray-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16V4m0 12l-4-4m4 4l4-4m6 8v-12m0 12l4-4m-4 4l-4-4"
                      />
                    </svg>
                  </button>
                </div>
                <div>
                  <label className="text-xs block mb-1">To</label>
                  <div className="flex gap-2">
                    <select
                      aria-label="To token"
                      className="border rounded px-2 py-1 w-full text-black"
                      value={toToken}
                      onChange={handleToTokenChange}
                    >
                      {Tokens.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                    <input
                      aria-label="To amount"
                      className="border rounded px-2 py-1 w-full text-black"
                      value={formatAmount(toAmount, toTokenInfo?.decimals)}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label>Slippage tolerance</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={slippage}
                    onChange={(e) => setSlippage(parseFloat(e.target.value))}
                    className="border rounded px-2 py-1 w-20 text-right text-black"
                  />
                  <span>%</span>
                </div>
              </div>

              <div className="flex items-center justify-center">
                {isSignedIn ? (
                  <button
                    onClick={handleSwap}
                    disabled={loading || sending || isSameToken}
                    className="text-sm px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 flex items-center gap-2"
                  >
                    {loading && <Spinner />}
                    {sending
                      ? "Sending..."
                      : loading
                      ? "Getting estimate..."
                      : isSameToken
                      ? "Select different tokens"
                      : "Swap"}
                  </button>
                ) : (
                  <button
                    onClick={connectWallet}
                    className="text-sm px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600"
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
              {status && (
                <div
                  role="status"
                  aria-live="polite"
                  className="text-xs text-gray-600 text-center"
                >
                  {status}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="optimized">
          <Card>
            <CardHeader>
              <CardTitle>Optimized Swap</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Optimized swap form coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}
