
import { ContractInteractions, ContractCallResult } from './contract-interactions';

export class ShieldedWalletService {
  static async createNewWallet(): Promise<void> {
    return ContractInteractions.createShieldedWallet();
  }

  static async fetchUserWallets(user: string): Promise<ContractCallResult> {
    return ContractInteractions.getShieldedWallets(user);
  }

  static async fetchWalletBalance(walletId: string): Promise<ContractCallResult> {
    return ContractInteractions.getShieldedWalletBalance(walletId);
  }

  static async sendFunds(walletId: string, recipient: string, amount: number): Promise<void> {
    return ContractInteractions.sendFromShieldedWallet(walletId, recipient, amount);
  }

  static async receiveFunds(walletId: string, amount: number): Promise<void> {
    return ContractInteractions.receiveToShieldedWallet(walletId, amount);
  }
}
