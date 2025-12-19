import { describe, it, expect, vi } from 'vitest';
import { ContractInteractions } from '../lib/contract-interactions';
import { CoreContracts } from '../lib/contracts';

// --- Mocks and Setup ---

vi.mock('@stacks/network', () => ({
  StacksTestnet: class {},
}));

vi.mock('@stacks/transactions', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    callReadOnlyFunction: vi.fn().mockImplementation(({ functionName, contractAddress }) => {
      if (functionName === 'get-price' && contractAddress === 'ST456') {
        return Promise.reject(new Error('Network error')); // Mock failure
      }
      return Promise.resolve({ value: 'mock_clarity_value' });
    }),
    standardPrincipalCV: (p) => p,
    uintCV: (u) => u,
  };
});

describe('Contract Interactions', () => {
  it('should export ContractInteractions class', () => {
    expect(ContractInteractions).toBeDefined();
  });

  it('should have static methods for common operations', () => {
    expect(ContractInteractions.getPair).toBeInstanceOf(Function);
    expect(ContractInteractions.createPair).toBeInstanceOf(Function);
    expect(ContractInteractions.addLiquidity).toBeInstanceOf(Function);
    expect(ContractInteractions.removeLiquidity).toBeInstanceOf(Function);
    expect(ContractInteractions.swap).toBeInstanceOf(Function);
    expect(ContractInteractions.getPrice).toBeInstanceOf(Function);
    expect(ContractInteractions.getTokenBalance).toBeInstanceOf(Function);
  });

  it('should have all required contracts configured', () => {
    const requiredContracts = ['health-check', 'oracle-aggregator-v2', 'dex-factory'];
    requiredContracts.forEach((idPart) => {
      const contract = CoreContracts.find((c) => c.id.includes(idPart));
      expect(contract, `${idPart} not found`).toBeDefined();
    });
  });

  it('should have correct contract address format', () => {
    CoreContracts.forEach((contract) => {
      expect(contract.id).toMatch(/^ST[0-9A-Z]+\.[a-zA-Z0-9-]+$/);
    });
  });

  it('should have proper contract kinds', () => {
    const validKinds = ['dex', 'oracle', 'token', 'vault', 'governance', 'monitoring', 'security', 'rewards'];
    CoreContracts.forEach((contract) => {
      expect(validKinds).toContain(contract.kind);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing contracts gracefully', async () => {
      const spy = vi.spyOn(CoreContracts, 'find').mockReturnValue(undefined);

      const result = await ContractInteractions.getPair('ST123.token-a', 'ST123.token-b');

      expect(result.success).toBe(false);
      expect(result.error).toBe('dex-factory contract not found');

      spy.mockRestore();
    });

    it('should handle network errors gracefully', async () => {
      const oracleContract = { id: 'ST456.oracle', kind: 'oracle' };
      const spy = vi.spyOn(CoreContracts, 'find').mockReturnValue(oracleContract);

      const result = await ContractInteractions.getPrice('ST-TOKEN');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unable to serialize. Invalid Clarity Value.');

      spy.mockRestore();
    });
  });
});
