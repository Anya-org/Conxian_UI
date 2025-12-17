
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

  // --- New Contract Interactions for Additional Services ---

  // DEX Router V3
  static async getRoute(tokenIn: string, tokenOut: string): Promise<ContractCallResult> {
    const routerContract = CoreContracts.find((c) => c.id.includes('multi-hop-router-v3'));
    if (!routerContract) return { success: false, error: 'Router V3 not found' };
    return callReadOnlyContractFunction(routerContract.id, 'get-route', [
      Cl.standardPrincipal(tokenIn),
      Cl.standardPrincipal(tokenOut)
    ]);
  }

  // Vault
  static async deposit(token: string, amount: number): Promise<void> {
    const vaultContract = CoreContracts.find((c) => c.id.includes('vault'));
    if (!vaultContract) throw new Error('Vault contract not found');
    return callPublicContractFunction(vaultContract.id, 'deposit', [Cl.standardPrincipal(token), Cl.uint(amount)]);
  }

  // Bond Factory
  static async createBond(collateralToken: string, maturityDate: number): Promise<void> {
    const bondFactory = CoreContracts.find((c) => c.id.includes('bond-factory'));
    if (!bondFactory) throw new Error('Bond Factory not found');
    return callPublicContractFunction(bondFactory.id, 'create-bond', [
      Cl.standardPrincipal(collateralToken),
      Cl.uint(maturityDate)
    ]);
  }

  // Flash Loan Vault
  static async executeFlashLoan(loanToken: string, loanAmount: number): Promise<void> {
    const flashLoanVault = CoreContracts.find((c) => c.id.includes('flash-loan-vault'));
    if (!flashLoanVault) throw new Error('Flash Loan Vault not found');
    // NOTE: Flash loan execution often requires a callback contract. This is a simplified call.
    return callPublicContractFunction(flashLoanVault.id, 'request-flash-loan', [
      Cl.standardPrincipal(loanToken),
      Cl.uint(loanAmount),
    ]);
  }

  // sBTC Vault
  static async mintSbtc(btcAmount: number): Promise<void> {
    const sbtcVault = CoreContracts.find((c) => c.id.includes('sbtc-vault'));
    if (!sbtcVault) throw new Error('sBTC Vault not found');
    return callPublicContractFunction(sbtcVault.id, 'mint-sbtc', [Cl.uint(btcAmount)]);
  }

  // Audit Registry
  static async isAudited(contractId: string): Promise<ContractCallResult> {
    const auditRegistry = CoreContracts.find((c) => c.id.includes('audit-registry'));
    if (!auditRegistry) return { success: false, error: 'Audit Registry not found' };
    return callReadOnlyContractFunction(auditRegistry.id, 'is-audited', [Cl.standardPrincipal(contractId)]);
  }

  // Governance Verifier
  static async verifyGovernanceSignature(message: string, signature: string): Promise<ContractCallResult> {
    const govVerifier = CoreContracts.find((c) => c.id.includes('governance-signature-verifier'));
    if (!govVerifier) return { success: false, error: 'Governance Verifier not found' };
    return callReadOnlyContractFunction(govVerifier.id, 'verify-signature', [Cl.stringUtf8(message), Cl.buffer(Buffer.from(signature, 'hex'))]);
  }

  // Finance Metrics
  static async getFinancialMetrics(): Promise<ContractCallResult> {
    const financeMetrics = CoreContracts.find((c) => c.id.includes('finance-metrics'));
    if (!financeMetrics) return { success: false, error: 'Finance Metrics contract not found' };
    return callReadOnlyContractFunction(financeMetrics.id, 'get-metrics');
  }

  // Monitoring Dashboard
  static async getDashboardData(): Promise<ContractCallResult> {
    const monitorDashboard = CoreContracts.find((c) => c.id.includes('monitoring-dashboard'));
    if (!monitorDashboard) return { success: false, error: 'Monitoring Dashboard contract not found' };
    return callReadOnlyContractFunction(monitorDashboard.id, 'get-dashboard-data');
  }

  // Performance Optimizer
  static async getPerformanceRecommendations(): Promise<ContractCallResult> {
    const perfOptimizer = CoreContracts.find((c) => c.id.includes('performance-optimizer'));
    if (!perfOptimizer) return { success: false, error: 'Performance Optimizer contract not found' };
    return callReadOnlyContractFunction(perfOptimizer.id, 'get-recommendations');
  }
}
