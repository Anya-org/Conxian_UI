import { callReadOnlyFunction, callPublicFunction, Cl, ClarityValue, ContractCallOptions, ReadOnlyFunctionOptions } from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';
import { AppConfig } from './config';
import { CoreContracts, Tokens } from './contracts';

// Network configuration
const getNetwork = (): StacksNetwork => {
  const network = AppConfig.network;
  return network === 'mainnet'
    ? new StacksNetwork({ url: 'https://api.hiro.so' })
    : new StacksNetwork({ url: AppConfig.coreApiUrl });
};

export type ContractCallResult = {
  success: boolean;
  result?: ClarityValue;
  error?: string;
};

// Helper to create contract call options
const createCallOptions = (contractId: string, functionName: string, functionArgs: ClarityValue[]): Omit<ContractCallOptions, 'contractAddress' | 'contractName' | 'functionName' | 'functionArgs'> => {
  const [address, name] = contractId.split('.');
  return {
    network: getNetwork(),
    functionArgs,
  };
};

// Read-only function calls
export async function callReadOnlyContractFunction(
  contractId: string,
  functionName: string,
  functionArgs: ClarityValue[] = []
): Promise<ContractCallResult> {
  try {
    const options = createCallOptions(contractId, functionName, functionArgs) as ReadOnlyFunctionOptions;
    options.contractAddress = contractId.split('.')[0];
    options.contractName = contractId.split('.')[1];
    options.functionName = functionName;

    const result = await callReadOnlyFunction(options);
    return {
      success: true,
      result: result,
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
  functionArgs: ClarityValue[] = [],
  options?: {
    senderKey?: string;
    nonce?: number;
    fee?: number;
  }
): Promise<ContractCallResult> {
  try {
    const callOptions = createCallOptions(contractId, functionName, functionArgs) as ContractCallOptions;
    callOptions.contractAddress = contractId.split('.')[0];
    callOptions.contractName = contractId.split('.')[1];
    callOptions.functionName = functionName;

    if (options?.senderKey) callOptions.senderKey = options.senderKey;
    if (options?.nonce !== undefined) callOptions.nonce = options.nonce;
    if (options?.fee !== undefined) callOptions.fee = options.fee;

    const transaction = await callPublicFunction(callOptions);
    return {
      success: true,
      result: transaction,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Specific contract functions for common operations
export class ContractInteractions {
  // DEX Factory functions
  static async getPair(tokenA: string, tokenB: string): Promise<ContractCallResult> {
    const factoryContract = CoreContracts.find(c => c.id.includes('dex-factory-v2'));
    if (!factoryContract) {
      return { success: false, error: 'DEX Factory contract not found' };
    }

    return callReadOnlyContractFunction(
      factoryContract.id,
      'get-pair',
      [Cl.standardPrincipal(tokenA), Cl.standardPrincipal(tokenB)]
    );
  }

  static async createPair(tokenA: string, tokenB: string, senderKey: string): Promise<ContractCallResult> {
    const factoryContract = CoreContracts.find(c => c.id.includes('dex-factory-v2'));
    if (!factoryContract) {
      return { success: false, error: 'DEX Factory contract not found' };
    }

    return callPublicContractFunction(
      factoryContract.id,
      'create-pair',
      [Cl.standardPrincipal(tokenA), Cl.standardPrincipal(tokenB)],
      { senderKey }
    );
  }

  // Oracle functions
  static async getPrice(token: string): Promise<ContractCallResult> {
    const oracleContract = CoreContracts.find(c => c.id.includes('oracle-aggregator'));
    if (!oracleContract) {
      return { success: false, error: 'Oracle contract not found' };
    }

    return callReadOnlyContractFunction(
      oracleContract.id,
      'get-price',
      [Cl.standardPrincipal(token)]
    );
  }

  // Token functions
  static async getTokenBalance(tokenContract: string, owner: string): Promise<ContractCallResult> {
    return callReadOnlyContractFunction(
      tokenContract,
      'get-balance',
      [Cl.standardPrincipal(owner)]
    );
  }

  static async getTokenTotalSupply(tokenContract: string): Promise<ContractCallResult> {
    return callReadOnlyContractFunction(
      tokenContract,
      'get-total-supply'
    );
  }

  // Vault functions
  static async getVaultBalance(): Promise<ContractCallResult> {
    const vaultContract = CoreContracts.find(c => c.id.includes('vault'));
    if (!vaultContract) {
      return { success: false, error: 'Vault contract not found' };
    }

    return callReadOnlyContractFunction(
      vaultContract.id,
      'get-total-balance'
    );
  }
}
