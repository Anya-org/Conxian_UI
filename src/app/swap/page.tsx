import { openContractCall } from "@stacks/connect";
import { 
  standardPrincipalCV, 
  uintCV, 
  cvToHex, 
  contractPrincipalCV, 
  PostConditionMode,
  FungibleConditionCode,
  createFungiblePostCondition,
  createSTXPostCondition
} from "@stacks/transactions";
import { useWallet } from "@/lib/wallet";
import ConnectWallet from "@/components/ConnectWallet";
// Removed useApi import as we are using direct contract calls
// import { useApi } from "@/lib/api-client"; 

// Re-styled components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";


// --- Helper Functions ---
// No change in helper functions, keeping them as is.

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

// --- Main Swap Page Component ---

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
  const { connectWallet, stxAddress } = useWallet();
  // const api = useApi(); // Unused

  const fromTokenInfo = Tokens.find((t) => t.id === fromToken);
  const toTokenInfo = Tokens.find((t) => t.id === toToken);
  const fromTokenBalance = balances.find(
    (b) => b.asset_identifier === fromToken
  );
  const isSameToken = fromToken === toToken;

  // Store the resolved pool principal for the transaction
  const [poolPrincipal, setPoolPrincipal] = React.useState<string>("");

  const getEstimate = React.useCallback(async () => {
    if (!fromToken || !toToken || !debouncedFromAmount || isSameToken) return;

    const factory = CoreContracts.find((c) =>
      c.id.endsWith(".dex-factory-v2")
    );
    if (!factory) {
      console.error("DEX Factory contract not found");
      return;
    }

    const [factoryAddress, factoryName] = factory.id.split(".") as [
      string,
      string,
    ];

    setLoading(true);
    setPoolPrincipal(""); // Reset pool principal
    try {
      // 1. Get Pool Address from Factory
      const getPoolArgs = [
        cvToHex(standardPrincipalCV(fromToken)),
        cvToHex(standardPrincipalCV(toToken)),
      ];

      const poolRes = await callReadOnly(
        factoryAddress,
        factoryName,
        "get-pool",
        factoryAddress,
        getPoolArgs
      );

      let foundPool = "";
      
      if (poolRes.okay && poolRes.result) {
        const decoded = decodeResultHex(poolRes.result);
        if (decoded && decoded.ok && decoded.value) {
             const val = decoded.value as any;
             if (val && val.type === 'optional' && val.value) {
                 const poolField = val.value.value?.pool; 
                 if (poolField && poolField.type === 'principal') {
                     foundPool = poolField.value;
                 }
             }
        }
      }

      if (!foundPool) {
          console.warn("No pool found for pair");
          setToAmount("0");
          return;
      }

      setPoolPrincipal(foundPool);

      // 2. Get Quote from Pool
      const [poolAddress, poolName] = foundPool.split(".") as [string, string];
      
      const quoteArgs = [
          cvToHex(uintCV(debouncedFromAmount)),
          cvToHex(standardPrincipalCV(fromToken)),
          cvToHex(standardPrincipalCV(toToken))
      ];

      const quoteRes = await callReadOnly(
          poolAddress,
          poolName,
          "get-quote",
          poolAddress, 
          quoteArgs
      );

      if (quoteRes.okay && quoteRes.result) {
        const decoded = decodeResultHex(quoteRes.result);
        if (decoded && decoded.ok) {
          const uint = getUint(decoded.value);
          if (uint !== null) {
            setToAmount(String(uint));
          }
        }
      }
    } catch (e) {
      console.error("Estimation failed", e);
      setToAmount("");
    } finally {
      setLoading(false);
    }
  }, [fromToken, toToken, debouncedFromAmount, isSameToken]);

  const handleSwap = async () => {
    if (!fromToken || !toToken || !fromAmount || !toAmount || isSameToken) return;
    if (!stxAddress) {
      setStatus("Please connect wallet to swap");
      return;
    }
    if (!poolPrincipal) {
        setStatus("No liquidity pool available for this pair");
        return;
    }

    const router = CoreContracts.find((c) => c.id.endsWith(".multi-hop-router-v3"));
    if (!router) {
        setStatus("Router configuration missing");
        return;
    }
    const [routerAddress, routerName] = router.id.split(".") as [string, string];

    setSending(true);
    setStatus("");

    try {
      const amountIn = BigInt(fromAmount);
      // minAmountOut = output * (1 - slippage/100)
      // We calculate this approximately. slippage is in percentage e.g. 0.5
      // factor = (10000 - slippage * 100) / 10000
      const amountOut = BigInt(toAmount || "0");
      const slippageBps = Math.floor(slippage * 100);
      const minAmountOut = amountOut * BigInt(10000 - slippageBps) / BigInt(10000);

      // Construct PostConditions
      // Sending fromToken (fungible)
      // For MVP we can use PostConditionMode.Allow to avoid complex PC construction errors,
      // but ideally we construct them.
      // Assuming SIP-010 traits.
      
      const [poolAddress, poolName] = poolPrincipal.split(".");

      const functionArgs = [
          uintCV(amountIn),
          uintCV(minAmountOut),
          contractPrincipalCV(poolAddress, poolName),
          standardPrincipalCV(fromToken),
          standardPrincipalCV(toToken)
      ];

      await openContractCall({
          contractAddress: routerAddress,
          contractName: routerName,
          functionName: "swap-direct",
          functionArgs,
          postConditionMode: PostConditionMode.Allow, // Using Allow for ease of testing
          postConditions: [],
          onFinish: (data) => {
              setStatus(`Submitted. Tx ID: ${data.txId}`);
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
    if (stxAddress) {
      getFungibleTokenBalances(stxAddress).then(setBalances);
    }
  }, [stxAddress]);

  return (
    <div className="min-h-screen w-full p-6 sm:p-10 space-y-8 bg-background-light dark:bg-background-DEFAULT">
      <header className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold text-text-primary">Swap</h1>
        <div className="lg:hidden">
          <ConnectWallet />
        </div>
      </header>
      <Tabs defaultValue="simple" className="w-full max-w-md mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="simple">Simple</TabsTrigger>
          <TabsTrigger value="optimized" disabled>Optimized</TabsTrigger>
        </TabsList>
        <TabsContent value="simple">
          <Card className="bg-background-paper">
            <CardHeader>
              <CardTitle className="text-text-primary">Simple Swap</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* From Token */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label htmlFor="from-token" className="text-text-secondary">From</label>
                  <span className="text-text-muted">
                    Balance: {fromTokenBalance ? formatAmount(fromTokenBalance.balance, fromTokenInfo?.decimals) : 0}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    id="from-token"
                    value={fromToken}
                    onChange={handleFromTokenChange}
                    className="w-full rounded-md border-gray-600 bg-background-paper text-text-primary py-2 px-3"
                  >
                    {Tokens.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                  <Input
                    type="text"
                    id="from-amount"
                    value={formatAmount(fromAmount, fromTokenInfo?.decimals)}
                    onChange={handleFromAmountChange}
                    className="w-full text-right"
                  />
                </div>
              </div>

              {/* Invert Button */}
              <div className="flex justify-center">
                <Button onClick={invertTokens} variant="outline" size="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 12l-4-4m4 4l4-4m6 8v-12m0 12l4-4m-4 4l-4-4" />
                  </svg>
                </Button>
              </div>

              {/* To Token */}
              <div className="space-y-2">
                <label htmlFor="to-token" className="text-sm text-text-secondary">To</label>
                <div className="flex items-center gap-2">
                  <select
                    id="to-token"
                    value={toToken}
                    onChange={handleToTokenChange}
                    className="w-full rounded-md border-gray-600 bg-background-paper text-text-primary py-2 px-3"
                  >
                    {Tokens.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                  <Input
                    type="text"
                    id="to-amount"
                    value={formatAmount(toAmount, toTokenInfo?.decimals)}
                    readOnly
                    className="w-full text-right"
                    placeholder="0.0"
                  />
                </div>
              </div>

              {/* Slippage */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary">Slippage Tolerance</span>
                <div className="flex items-center gap-2">
                  {[0.1, 0.5, 1.0].map(val => (
                    <Badge
                      key={val}
                      onClick={() => setSlippage(val)}
                      className={`cursor-pointer ${slippage === val ? 'bg-primary-dark' : 'bg-gray-700'}`}
                    >
                      {val}%
                    </Badge>
                  ))}
                  <Input
                    type="number"
                    value={slippage}
                    onChange={e => setSlippage(parseFloat(e.target.value))}
                    className="w-20 text-right"
                  />
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4">
                {stxAddress ? (
                  <Button
                    onClick={handleSwap}
                    disabled={loading || sending || isSameToken}
                    className="w-full bg-primary-DEFAULT hover:bg-primary-dark text-white"
                  >
                    {sending ? "Sending..." : loading ? "Getting estimate..." : "Swap"}
                  </Button>
                ) : (
                  <Button onClick={connectWallet} className="w-full bg-primary-DEFAULT hover:bg-primary-dark">
                    Connect Wallet
                  </Button>
                )}
              </div>
              
              {status && <p className="text-center text-sm text-text-muted mt-4">{status}</p>}

            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="optimized">
          <Card className="bg-background-paper">
            <CardHeader>
              <CardTitle className="text-text-primary">Optimized Swap</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">Optimized swap form coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
