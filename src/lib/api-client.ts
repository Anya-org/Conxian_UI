
import { ApiService } from './api-services';

// --- API Client ---

export const apiClient = {
  // --- DEX ---
  getPair: (...args: any[]) => ApiService.getPair(...args),
  createPair: (...args: any[]) => ApiService.createPair(...args),
  getLiquidityProviderShare: (...args: any[]) => ApiService.getLiquidityProviderShare(...args),
  removeLiquidity: (...args: any[]) => ApiService.removeLiquidity(...args),
  getRoute: (...args: any[]) => ApiService.getRoute(...args),
  deposit: (...args: any[]) => ApiService.deposit(...args),

  // --- Oracle ---
  getPrice: (...args: any[]) => ApiService.getPrice(...args),

  // --- Token ---
  getTokenBalance: (...args: any[]) => ApiService.getTokenBalance(...args),
  getTokenTotalSupply: (...args: any[]) => ApiService.getTokenTotalSupply(...args),

  // --- Vault ---
  getVaultBalance: (...args: any[]) => ApiService.getVaultBalance(...args),

  // --- Bond ---
  createBond: (...args: any[]) => ApiService.createBond(...args),

  // --- Flash Loan ---
  executeFlashLoan: (...args: any[]) => ApiService.executeFlashLoan(...args),

  // --- Security ---
  getCircuitBreakerStatus: (...args: any[]) => ApiService.getCircuitBreakerStatus(...args),
  isAudited: (...args: any[]) => ApiService.isAudited(...args),

  // --- Governance ---
  verifyGovernanceSignature: (...args: any[]) => ApiService.verifyGovernanceSignature(...args),

  // --- Staking ---
  getStakingInfo: (...args: any[]) => ApiService.getStakingInfo(...args),

  // --- Monitoring ---
  getSystemHealth: (...args: any[]) => ApiService.getSystemHealth(...args),
  getAggregatedMetrics: (...args: any[]) => ApiService.getAggregatedMetrics(...args),
  getFinancialMetrics: (...args: any[]) => ApiService.getFinancialMetrics(...args),
  getDashboardData: (...args: any[]) => ApiService.getDashboardData(...args),
  getPerformanceRecommendations: (...args: any[]) => ApiService.getPerformanceRecommendations(...args),
  getDashboardMetrics: (...args: any[]) => ApiService.getDashboardMetrics(...args),

  // --- Enterprise ---
  getEnterpriseConfig: (...args: any[]) => ApiService.getEnterpriseConfig(...args),

  // --- Yield Optimizer ---
  getYieldStrategies: (...args: any[]) => ApiService.getYieldStrategies(...args),

  // --- Shielded Wallet ---
  createNewWallet: (...args: any[]) => ApiService.createNewWallet(...args),
  fetchUserWallets: (...args: any[]) => ApiService.fetchUserWallets(...args),
  fetchWalletBalance: (...args: any[]) => ApiService.fetchWalletBalance(...args),
  sendFunds: (...args: any[]) => ApiService.sendFunds(...args),
  receiveFunds: (...args: any[]) => ApiService.receiveFunds(...args),

  // --- Banking ---
  executeIntent: (...args: any[]) => ApiService.executeIntent(...args),

  // --- Positions ---
  getPositions: (...args: any[]) => ApiService.getPositions(...args),
};

// --- Data Fetching Hooks (for use in UI components) ---

export const useApi = () => {
  return apiClient;
};
