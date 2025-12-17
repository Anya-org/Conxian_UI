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

// --- Types ---

export type TransactionIntent =
  | { type: "transfer-stx"; recipient: string; amount: number; memo?: string }
  | { type: "invest-pool"; poolId: string; amount: number }
  | { type: "swap"; fromToken: string; toToken: string; amount: number };

export interface BankingResult {
  txId: string;
  status: "pending" | "success" | "failed";
}

// --- Configuration ---

function getNetwork(): StacksNetwork {
  const name = AppConfig.network as "mainnet" | "testnet" | "devnet";
  if (name === "devnet") {
    return createNetwork({
      network: "devnet",
      client: { baseUrl: AppConfig.coreApiUrl },
    });
  }
  return createNetwork(name);
}

// --- The Banking Abstraction Layer ---

export class BankingService {
  /**
   * Execute a high-level user intent as a blockchain transaction.
   * Abstracts away post-conditions, fee estimation (to an extent), and technical parameter encoding.
   */
  static async executeIntent(
    intent: TransactionIntent,
    isSponsored: boolean = false
  ): Promise<BankingResult> {
    if (!userSession.isUserSignedIn()) {
      throw new Error("User must be signed in to execute transactions.");
    }

    const network = getNetwork();
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

      // 2. Invest in Pool (Mock Contract Call)
      else if (intent.type === "invest-pool") {
        // Post-Condition Builder Pattern
        const safePostCondition = Pc.principal(myAddress)
          .willSendEq(intent.amount * 1_000_000)
          .ustx();

        openContractCall({
          network,
          contractAddress: "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5", // Example Contract
          contractName: "arkadiko-swap-v2-1", // Example Pool
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

      // 3. Swap (Mock)
      else if (intent.type === "swap") {
        // Example: Swapping STX for Token
        const safePostCondition = Pc.principal(myAddress)
          .willSendEq(intent.amount * 1_000_000)
          .ustx();

        openContractCall({
          network,
          contractAddress: "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5",
          contractName: "arkadiko-swap-v2-1",
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
}
