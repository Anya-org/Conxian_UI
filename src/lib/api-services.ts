
import { ContractInteractions } from './contract-interactions';

// A proxy to lazy-load contract interactions to avoid race conditions in tests
const contractInteractionsPromise = import('./contract-interactions').then(module => module.ContractInteractions);

const createApiHandler = (prop: keyof typeof ContractInteractions) => {
  return async (...args: any[]) => {
    const ContractInteractions = await contractInteractionsPromise;
    return (ContractInteractions[prop] as Function)(...args);
  };
};

export const ApiService = new Proxy({} as typeof ContractInteractions, {
  get: (target, prop: keyof typeof ContractInteractions) => createApiHandler(prop),
});
