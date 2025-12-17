
import {
  ContractInteractions,
  ContractCallResult,
} from './contract-interactions';

export class ApiService {
  // --- DEX Services ---
  static getPair = ContractInteractions.getPair;
  static createPair = ContractInteractions.createPair;
  static getLiquidityProviderShare =
    ContractInteractions.getLiquidityProviderShare;
  static removeLiquidity = ContractInteractions.removeLiquidity;
  static getRoute = ContractInteractions.getRoute;
  static deposit = ContractInteractions.deposit;

  // --- Oracle Services ---
  static getPrice = ContractInteractions.getPrice;

  // --- Token Services ---
  static getTokenBalance = ContractInteractions.getTokenBalance;
  static getTokenTotalSupply = ContractInteractions.getTokenTotalSupply;

  // --- Vault Services ---
  static getVaultBalance = ContractInteractions.getVaultBalance;
  static mintSbtc = ContractInteractions.mintSbtc;

  // --- Bond Services ---
  static createBond = ContractInteractions.createBond;

  // --- Flash Loan Services ---
  static executeFlashLoan = ContractInteractions.executeFlashLoan;

  // --- Security Services ---
  static getCircuitBreakerStatus = ContractInteractions.getCircuitBreakerStatus;
  static isAudited = ContractInteractions.isAudited;

  // --- Governance Services ---
  static verifyGovernanceSignature =
    ContractInteractions.verifyGovernanceSignature;

  // --- Staking Services ---
  static getStakingInfo = ContractInteractions.getStakingInfo;

  // --- Monitoring Services ---
  static getSystemHealth = ContractInteractions.getSystemHealth;
  static getAggregatedMetrics = ContractInteractions.getAggregatedMetrics;
  static getFinancialMetrics = ContractInteractions.getFinancialMetrics;
  static getDashboardData = ContractInteractions.getDashboardData;
  static getPerformanceRecommendations =
    ContractInteractions.getPerformanceRecommendations;

  // --- Enterprise Services ---
  static getEnterpriseConfig = ContractInteractions.getEnterpriseConfig;

  // --- Yield Optimizer Services ---
  static getYieldStrategies = ContractInteractions.getYieldStrategies;

  // --- Shielded Wallet Services ---
  static createShieldedWallet = ContractInteractions.createShieldedWallet;
  static getShieldedWallets = ContractInteractions.getShieldedWallets;
  static getShieldedWalletBalance =
    ContractInteractions.getShieldedWalletBalance;
  static sendFromShieldedWallet = ContractInteractions.sendFromShieldedWallet;
  static receiveToShieldedWallet = ContractInteractions.receiveToShieldedWallet;

  // --- Helper to fetch all data for a dashboard ---
  static async getDashboardMetrics(): Promise<Record<string, ContractCallResult>> {
    const metrics: Record<string, ContractCallResult> = {};
    const promises = [
      this.getSystemHealth().then((res) => (metrics.systemHealth = res)),
      this.getAggregatedMetrics().then(
        (res) => (metrics.aggregatedMetrics = res)
      ),
      this.getFinancialMetrics().then(
        (res) => (metrics.financialMetrics = res)
      ),
      this.getDashboardData().then((res) => (metrics.dashboardData = res)),
      this.getPerformanceRecommendations().then(
        (res) => (metrics.performanceRecommendations = res)
      ),
    ];
    await Promise.all(promises);
    return metrics;
  }
}
