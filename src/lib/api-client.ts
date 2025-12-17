
import { ApiService } from './api-services';

// --- API Client ---

export const apiClient = {
  // --- DEX ---
  getPair: ApiService.getPair,
  createPair: ApiService.createPair,
  getLiquidityProviderShare: ApiService.getLiquidityProviderShare,
  removeLiquidity: ApiService.removeLiquidity,
  getRoute: ApiService.getRoute,
  deposit: ApiService.deposit,

  // --- Oracle ---
  getPrice: ApiService.getPrice,

  // --- Token ---
  getTokenBalance: ApiService.getTokenBalance,
  getTokenTotalSupply: ApiService.getTokenTotalSupply,

  // --- Vault ---
  getVaultBalance: ApiService.getVaultBalance,
  mintSbtc: ApiService.mintSbtc,

  // --- Bond ---
  createBond: ApiService.createBond,

  // --- Flash Loan ---
  executeFlashLoan: ApiService.executeFlashLoan,

  // --- Security ---
  getCircuitBreakerStatus: ApiService.getCircuitBreakerStatus,
  isAudited: ApiService.isAudited,

  // --- Governance ---
  verifyGovernanceSignature: ApiService.verifyGovernanceSignature,

  // --- Staking ---
  getStakingInfo: ApiService.getStakingInfo,

  // --- Monitoring ---
  getSystemHealth: ApiService.getSystemHealth,
  getAggregatedMetrics: ApiService.getAggregatedMetrics,
  getFinancialMetrics: ApiService.getFinancialMetrics,
  getDashboardData: ApiService.getDashboardData,
  getPerformanceRecommendations: ApiService.getPerformanceRecommendations,
  getDashboardMetrics: ApiService.getDashboardMetrics,

  // --- Enterprise ---
  getEnterpriseConfig: ApiService.getEnterpriseConfig,

  // --- Yield Optimizer ---
  getYieldStrategies: ApiService.getYieldStrategies,

  // --- Shielded Wallet ---
  createShieldedWallet: ApiService.createShieldedWallet,
  getShieldedWallets: ApiService.getShieldedWallets,
  getShieldedWalletBalance: ApiService.getShieldedWalletBalance,
  sendFromShieldedWallet: ApiService.sendFromShieldedWallet,
  receiveToShieldedWallet: ApiService.receiveToShieldedWallet,
};

// --- Data Fetching Hooks (for use in UI components) ---

export const useApi = () => {
  return apiClient;
};
