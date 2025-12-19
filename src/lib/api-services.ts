import { ContractInteractions } from './contract-interactions';
import { AppConfig } from "@/lib/config";
import { openContractCall, openSTXTransfer } from "@stacks/connect";
import {
  Pc,
  PostConditionMode,
  uintCV,
  standardPrincipalCV,
} from "@stacks/transactions";
import { createNetwork } from "@stacks/network";
import type { StacksNetwork } from "@stacks/network";
import { userSession } from "@/lib/wallet";
import { CoreContracts } from "@/lib/contracts";

// --- Types ---

export type TransactionIntent =
  | { type: "transfer-stx"; recipient: string; amount: number; memo?: string }
  | { type: "invest-pool"; poolId: string; amount: number }
  | { type: "swap"; fromToken: string; toToken: string; amount: number };

export interface BankingResult {
  txId: string;
  status: "pending" | "success" | "failed";
}


/**
 * ApiService
 * A static class abstracting interactions with the blockchain and other services.
 */
export class ApiService {
  // --- DEX ---
  static getPair = ContractInteractions.getPair;
  static createPair = ContractInteractions.createPair;
  static getLiquidityProviderShare = ContractInteractions.getLiquidityProviderShare;
  static getRoute = ContractInteractions.getRoute;
  static deposit = ContractInteractions.deposit;

  // --- Liquidity Pool ---
  static addLiquidity = ContractInteractions.addLiquidity;
  static removeLiquidity = ContractInteractions.removeLiquidity;
  static getPoolDetails = ContractInteractions.getPoolDetails;

  // --- Swaps ---
  static swap = ContractInteractions.swap;
  static estimateSwap = ContractInteractions.estimateSwap;

  // --- Oracle ---
  static getPrice = ContractInteractions.getPrice;

  // --- Tokens ---
  static getTokenInfo = ContractInteractions.getTokenInfo;
  static getBalance = ContractInteractions.getBalance;
  static getDecimals = ContractInteractions.getDecimals;
  static getAllowance = ContractInteractions.getAllowance;
  static setAllowance = ContractInteractions.setAllowance;
  static getTokenBalance = ContractInteractions.getTokenBalance;
  static getTokenTotalSupply = ContractInteractions.getTokenTotalSupply;

  // --- Vault ---
  static getVaultBalance = ContractInteractions.getVaultBalance;

  // --- Bond ---
  static createBond = ContractInteractions.createBond;

  // --- Router ---
  static getRouterInfo = ContractInteractions.getRouterInfo;

  // --- AMM ---
  static getAmmInfo = ContractInteractions.getAmmInfo;

  // --- Flash Loans ---
  static executeFlashLoan = ContractInteractions.executeFlashLoan;

  // --- Security ---
  static getCircuitBreakerStatus = ContractInteractions.getCircuitBreakerStatus;
  static isAudited = ContractInteractions.isAudited;

  // --- Governance ---
  static verifyGovernanceSignature = ContractInteractions.verifyGovernanceSignature;

  // --- Staking ---
  static getStakingInfo = ContractInteractions.getStakingInfo;

  // --- System Health & Metrics ---
  static getSystemHealth = ContractInteractions.getSystemHealth;
  static getAggregatedMetrics = ContractInteractions.getAggregatedMetrics;
  static getFinancialMetrics = ContractInteractions.getFinancialMetrics;
  static getDashboardMetrics = ContractInteractions.getDashboardMetrics; 
  static getDashboardData = ContractInteractions.getDashboardData;
  static getPerformanceRecommendations = ContractInteractions.getPerformanceRecommendations;

  // --- Enterprise & Yield ---
  static getEnterpriseConfig = ContractInteractions.getEnterpriseConfig;
  static getYieldStrategies = ContractInteractions.getYieldStrategies;

  // --- Shielded Wallet ---
  static createNewWallet = ContractInteractions.createShieldedWallet;
  static fetchUserWallets = ContractInteractions.getShieldedWallets;
  static fetchWalletBalance = ContractInteractions.getShieldedWalletBalance;
  static sendFunds = ContractInteractions.sendFromShieldedWallet;
  static receiveFunds = ContractInteractions.receiveToShieldedWallet;

  // --- Banking ---
  static async executeIntent(
    intent: TransactionIntent,
    isSponsored: boolean = false
  ): Promise<BankingResult> {
    if (!userSession.isUserSignedIn()) {
      throw new Error("User must be signed in to execute transactions.");
    }

    const network = this.getNetwork();
    const myAddress = userSession.loadUserData().profile.stxAddress.mainnet; // or testnet based on config

    return new Promise((resolve, reject) => {
      // 1. STX Transfer
      if (intent.type === "transfer-stx") {
        openSTXTransfer({
          network,
          recipient: intent.recipient,
          amount: String(intent.amount * 1_000_000), // Convert to microSTX
          memo: intent.memo,
          sponsored: isSponsored,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onFinish: (data: any) =>
            resolve({ txId: data.txId, status: "pending" }),
          onCancel: () => reject(new Error("User cancelled transaction")),
        });
      }

      // 2. Invest in Pool
      else if (intent.type === "invest-pool") {
        const { address, name } = this.getContractId("concentrated-liquidity-pool");
        
        // Post-Condition Builder Pattern
        const safePostCondition = Pc.principal(myAddress)
          .willSendEq(intent.amount * 1_000_000)
          .ustx();

        openContractCall({
          network,
          contractAddress: address,
          contractName: name,
          functionName: "add-liquidity",
          functionArgs: [
            uintCV(intent.amount * 1_000_000),
            uintCV(0), // min-mint mocked
          ],
          postConditionMode: PostConditionMode.Deny, // STRICT SAFETY
          postConditions: [safePostCondition],
          sponsored: isSponsored,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onFinish: (data: any) =>
            resolve({ txId: data.txId, status: "pending" }),
          onCancel: () => reject(new Error("Transaction cancelled")),
        });
      }

      // 3. Swap
      else if (intent.type === "swap") {
        // Use DEX Router for swaps
        const { address, name } = this.getContractId("dex-router");
        
        // Example: Swapping STX for Token
        const safePostCondition = Pc.principal(myAddress)
          .willSendEq(intent.amount * 1_000_000)
          .ustx();

        openContractCall({
          network,
          contractAddress: address,
          contractName: name,
          functionName: "swap-x-for-y",
          functionArgs: [
            standardPrincipalCV(intent.fromToken),
            standardPrincipalCV(intent.toToken),
            uintCV(intent.amount * 1_000_000),
            uintCV(0), // min-out
          ],
          postConditionMode: PostConditionMode.Deny,
          postConditions: [safePostCondition],
          sponsored: isSponsored,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onFinish: (data: any) =>
            resolve({ txId: data.txId, status: "pending" }),
          onCancel: () => reject(new Error("Swap cancelled")),
        });
      }
    });
  }
  
  // --- Positions ---
  static getPositions = ContractInteractions.getPositions;

  private static getNetwork(): StacksNetwork {
    const name = AppConfig.network as "mainnet" | "testnet" | "devnet";
    if (name === "devnet") {
      return createNetwork({
        network: "devnet",
        client: { baseUrl: AppConfig.coreApiUrl },
      });
    }
    return createNetwork(name);
  }

  private static getContractId(key: string): { address: string; name: string } {
    const contract = CoreContracts.find((c) => c.id.includes(key));
    if (!contract) {
      throw new Error(`Contract containing '${key}' not found in registry.`);
    }
    const [address, name] = contract.id.split(".");
    return { address, name };
  }

}
