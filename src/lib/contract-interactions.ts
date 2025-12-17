
import {
  Cl,
  ClarityValue,
  ContractCallOptions,
  ReadOnlyFunctionOptions,
  fetchCallReadOnlyFunction,
} from '@stacks/transactions';
import { StacksNetwork, STACKS_MAINNET, STACKS_TESTNET } from '@stacks/network';
import { request } from '@stacks/connect';
import { AppConfig } from './config';
import { CoreContracts } from './contracts';

// Network configuration
const getNetwork = (): StacksNetwork => {
  const network = AppConfig.network === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET;
  const customNetwork = { ...network };
  customNetwork.client.baseUrl = AppConfig.coreApiUrl;
  return customNetwork;
};

export type ContractCallResult = {
  success: boolean;
  result?: ClarityValue;
  error?: string;
};

// Helper to create contract call options
const createCallOptions = (
  _contractId: string,
  _functionName: string,
  _functionArgs: ClarityValue[]
): Omit<
  ContractCallOptions,
  'contractAddress' | 'contractName' | 'functionName' | 'functionArgs'
> => {
  return {
    network: getNetwork(),
  };
};

// Read-only function calls
export async function callReadOnlyContractFunction(
  contractId: string,
  functionName: string,
  functionArgs: ClarityValue[] = []
): Promise<ContractCallResult> {
  try {
    const [contractAddress, contractName] = contractId.split('.');
    const options: ReadOnlyFunctionOptions = {
      ...createCallOptions(contractId, functionName, functionArgs),
      contractAddress,
      contractName,
      functionName,
      functionArgs,
      senderAddress: contractAddress, // arbitrary for read-only
    };
    const result = await fetchCallReadOnlyFunction(options);
    return {
      success: true,
      result,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Public function calls (transactions)
export async function callPublicContractFunction(
  contractId: string,
  functionName: string,
  functionArgs: ClarityValue[] = []
): Promise<void> {
  try {
    const result = await request('stx_callContract', {
      network: getNetwork(),
      contract: contractId as `${string}.${string}`,
      functionName,
      functionArgs,
    });
    console.log('Transaction finished:', result);
  } catch (error) {
    console.log('Transaction cancelled or failed:', error);
  }
}

// Specific contract functions for common operations
export class ContractInteractions {
  // DEX Factory functions
  static async getPair(tokenA: string, tokenB: string): Promise<ContractCallResult> {
    const factoryContract = CoreContracts.find((c) => c.id.includes('dex-factory-v2'));
    if (!factoryContract) {
      return { success: false, error: 'DEX Factory contract not found' };
    }
    return callReadOnlyContractFunction(factoryContract.id, 'get-pair', [
      Cl.standardPrincipal(tokenA),
      Cl.standardPrincipal(tokenB),
    ]);
  }

  static async createPair(tokenA: string, tokenB: string): Promise<void> {
    const factoryContract = CoreContracts.find((c) => c.id.includes('dex-factory-v2'));
    if (!factoryContract) {
      throw new Error('DEX Factory contract not found');
    }
    return callPublicContractFunction(factoryContract.id, 'create-pair', [
      Cl.standardPrincipal(tokenA),
      Cl.standardPrincipal(tokenB),
    ]);
  }

  static async getLiquidityProviderShare(
    pairContractId: string,
    user: string
  ): Promise<ContractCallResult> {
    return callReadOnlyContractFunction(pairContractId, 'get-liquidity-provider-share', [
      Cl.standardPrincipal(user),
    ]);
  }

  static async removeLiquidity(pairContractId: string): Promise<void> {
    // Assuming the contract function takes a percentage of liquidity to remove (u100 for 100%)
    return callPublicContractFunction(pairContractId, 'remove-liquidity', [Cl.uint(100)]);
  }


  // Oracle functions
  static async getPrice(token: string): Promise<ContractCallResult> {
    const oracleContract = CoreContracts.find((c) => c.id.includes('oracle-aggregator-v2'));
    if (!oracleContract) {
      return { success: false, error: 'Oracle contract not found' };
    }
    return callReadOnlyContractFunction(oracleContract.id, 'get-price', [
      Cl.standardPrincipal(token),
    ]);
  }

  // Token functions
  static async getTokenBalance(
    tokenContract: string,
    owner: string
  ): Promise<ContractCallResult> {
    return callReadOnlyContractFunction(tokenContract, 'get-balance', [
      Cl.standardPrincipal(owner),
    ]);
  }

  static async getTokenTotalSupply(tokenContract: string): Promise<ContractCallResult> {
    return callReadOnlyContractFunction(tokenContract, 'get-total-supply');
  }

  // Vault functions
  static async getVaultBalance(): Promise<ContractCallResult> {
    const vaultContract = CoreContracts.find((c) => c.id.includes('vault'));
    if (!vaultContract) {
      return { success: false, error: 'Vault contract not found' };
    }
    return callReadOnlyContractFunction(vaultContract.id, 'get-total-balance');
  }

  // --- New Services aligned with contracts.ts ---

  // Security - Circuit Breaker
  static async getCircuitBreakerStatus(): Promise<ContractCallResult> {
    const breakerContract = CoreContracts.find((c) => c.id.includes('circuit-breaker'));
    if (!breakerContract) {
        return { success: false, error: 'Circuit Breaker contract not found' };
    }
    return callReadOnlyContractFunction(breakerContract.id, 'get-status');
  }

  // Rewards - Staking
  static async getStakingInfo(user: string): Promise<ContractCallResult> {
      const stakingContract = CoreContracts.find((c) => c.id.includes('cxd-staking'));
      if (!stakingContract) {
          return { success: false, error: 'Staking contract not found' };
      }
      return callReadOnlyContractFunction(stakingContract.id, 'get-staker-info', [
          Cl.standardPrincipal(user)
      ]);
  }

  // Monitoring - System Monitor
  static async getSystemHealth(): Promise<ContractCallResult> {
      const monitorContract = CoreContracts.find((c) => c.id.includes('system-monitor'));
      if (!monitorContract) {
          return { success: false, error: 'System Monitor contract not found' };
      }
      return callReadOnlyContractFunction(monitorContract.id, 'get-system-health');
  }

  // Enterprise - Enterprise API
  static async getEnterpriseConfig(): Promise<ContractCallResult> {
      const entContract = CoreContracts.find((c) => c.id.includes('enterprise-api'));
      if (!entContract) {
          return { success: false, error: 'Enterprise API contract not found' };
      }
      return callReadOnlyContractFunction(entContract.id, 'get-config');
  }

  // Yield Optimizer
  static async getYieldStrategies(): Promise<ContractCallResult> {
      const yieldContract = CoreContracts.find((c) => c.id.includes('yield-optimizer'));
      if (!yieldContract) {
          return { success: false, error: 'Yield Optimizer contract not found' };
      }
      return callReadOnlyContractFunction(yieldContract.id, 'get-strategies');
  }

    // Analytics Aggregator
    static async getAggregatedMetrics(): Promise<ContractCallResult> {
        const analyticsContract = CoreContracts.find((c) => c.id.includes('analytics-aggregator'));
        if (!analyticsContract) {
            return { success: false, error: 'Analytics Aggregator contract not found' };
        }
        return callReadOnlyContractFunction(analyticsContract.id, 'get-metrics');
    }

  // Shielded Wallet functions
  static async createShieldedWallet(): Promise<void> {
    const walletManager = CoreContracts.find((c) => c.id.includes('shielded-wallet-manager'));
    if (!walletManager) {
      throw new Error('Shielded Wallet Manager contract not found');
    }
    return callPublicContractFunction(walletManager.id, 'create-wallet');
  }

  static async getShieldedWallets(user: string): Promise<ContractCallResult> {
    const walletManager = CoreContracts.find((c) => c.id.includes('shielded-wallet-manager'));
    if (!walletManager) {
      return { success: false, error: 'Shielded Wallet Manager contract not found' };
    }
    return callReadOnlyContractFunction(walletManager.id, 'get-wallets', [Cl.standardPrincipal(user)]);
  }

  static async getShieldedWalletBalance(walletId: string): Promise<ContractCallResult> {
    return callReadOnlyContractFunction(walletId, 'get-balance');
  }

  static async sendFromShieldedWallet(walletId: string, recipient: string, amount: number): Promise<void> {
    return callPublicContractFunction(walletId, 'send-funds', [Cl.standardPrincipal(recipient), Cl.uint(amount)]);
  }

  static async receiveToShieldedWallet(walletId: string, amount: number): Promise<void> {
    return callPublicContractFunction(walletId, 'receive-funds', [Cl.uint(amount)]);
  }
}
