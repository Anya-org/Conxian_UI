
import { ContractInteractions } from './contract-interactions';

// A proxy to lazy-load contract interactions to avoid race conditions in tests
const contractInteractionsPromise = import('./contract-interactions').then(module => module.ContractInteractions);

const createApiHandler = (prop: keyof typeof ContractInteractions) => {
  return async (...args: unknown[]): Promise<unknown> => {
    try {
      const ContractInteractions = await contractInteractionsPromise;
      const fn = ContractInteractions[prop] as (...inner: unknown[]) => unknown;
      return await fn(...args);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  };
};

export const ApiService = new Proxy({} as typeof ContractInteractions, {
  get: (target, prop: keyof typeof ContractInteractions) => createApiHandler(prop),
});
