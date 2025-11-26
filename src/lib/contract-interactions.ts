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
import { CoreContracts, Tokens } from './contracts';

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
  contractId: string,
  functionName: string,
  functionArgs: ClarityValue[]
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

// Oracle functions
  static async getPrice(token: string): Promise<ContractCallResult> {
    const oracleContract = CoreContracts.find((c) => c.id.includes('oracle-aggregator'));
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
}
