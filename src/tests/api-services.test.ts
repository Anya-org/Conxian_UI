
import { describe, it, expect, vi } from 'vitest';
import { ApiService } from '../lib/api-services';
import { CoreContracts } from '../lib/contracts';

// --- Mocks and Setup ---

// Mock the fetchCallReadOnlyFunction to avoid actual network calls
vi.mock('@stacks/transactions', () => {
  // Define the mock value inside the factory to avoid hoisting issues
  const mockClarityValueInMock = {
    type: 'SomeClarityType',
    value: 'mock_value',
  };
  return {
    fetchCallReadOnlyFunction: vi.fn().mockResolvedValue(mockClarityValueInMock),
    Cl: {
      standardPrincipal: (p) => p,
      uint: (u) => u,
    },
  };
});

// This value is for assertion checking and must match the one inside the mock
const mockClarityValue = {
  type: 'SomeClarityType',
  value: 'mock_value',
};

describe('API Service', () => {
  it('should expose all contract interaction methods', () => {
    // --- DEX ---
    expect(ApiService.getPair).toBeDefined();
    expect(ApiService.createPair).toBeDefined();
    expect(ApiService.getLiquidityProviderShare).toBeDefined();
    expect(ApiService.removeLiquidity).toBeDefined();
    expect(ApiService.getRoute).toBeDefined();
    expect(ApiService.deposit).toBeDefined();

    // --- Oracle ---
    expect(ApiService.getPrice).toBeDefined();

    // --- Token ---
    expect(ApiService.getTokenBalance).toBeDefined();
    expect(ApiService.getTokenTotalSupply).toBeDefined();

    // --- Vault ---
    expect(ApiService.getVaultBalance).toBeDefined();
    expect(ApiService.mintSbtc).toBeDefined();

    // --- Bond ---
    expect(ApiService.createBond).toBeDefined();

    // --- Flash Loan ---
    expect(ApiService.executeFlashLoan).toBeDefined();

    // --- Security ---
    expect(ApiService.getCircuitBreakerStatus).toBeDefined();
    expect(ApiService.isAudited).toBeDefined();

    // --- Governance ---
    expect(ApiService.verifyGovernanceSignature).toBeDefined();

    // --- Staking ---
    expect(ApiService.getStakingInfo).toBeDefined();

    // --- Monitoring ---
    expect(ApiService.getSystemHealth).toBeDefined();
    expect(ApiService.getAggregatedMetrics).toBeDefined();
    expect(ApiService.getFinancialMetrics).toBeDefined();
    expect(ApiService.getDashboardData).toBeDefined();
    expect(ApiService.getPerformanceRecommendations).toBeDefined();

    // --- Enterprise ---
    expect(ApiService.getEnterpriseConfig).toBeDefined();

    // --- Yield Optimizer ---
    expect(ApiService.getYieldStrategies).toBeDefined();

    // --- Shielded Wallet ---
    expect(ApiService.createShieldedWallet).toBeDefined();
    expect(ApiService.getShieldedWallets).toBeDefined();
    expect(ApiService.getShieldedWalletBalance).toBeDefined();
    expect(ApiService.sendFromShieldedWallet).toBeDefined();
    expect(ApiService.receiveToShieldedWallet).toBeDefined();
  });

  describe('Dashboard Metrics', () => {
    it('should fetch all dashboard metrics correctly', async () => {
      const metrics = await ApiService.getDashboardMetrics();

      expect(metrics.systemHealth).toBeDefined();
      expect(metrics.systemHealth.success).toBe(true);

      expect(metrics.aggregatedMetrics).toBeDefined();
      expect(metrics.aggregatedMetrics.success).toBe(true);

      expect(metrics.financialMetrics).toBeDefined();
      expect(metrics.financialMetrics.success).toBe(true);

      expect(metrics.dashboardData).toBeDefined();
      expect(metrics.dashboardData.success).toBe(true);

      expect(metrics.performanceRecommendations).toBeDefined();
      expect(metrics.performanceRecommendations.success).toBe(true);
    });

    it('should handle errors in individual metric fetching', async () => {
      // Mock one of the functions to simulate an error
      const originalGetSystemHealth = ApiService.getSystemHealth;
      ApiService.getSystemHealth = vi.fn().mockResolvedValue({
        success: false,
        error: 'System health check failed',
      });

      const metrics = await ApiService.getDashboardMetrics();

      expect(metrics.systemHealth).toBeDefined();
      expect(metrics.systemHealth.success).toBe(false);
      expect(metrics.systemHealth.error).toBe('System health check failed');

      // Check that other metrics were still fetched
      expect(metrics.aggregatedMetrics.success).toBe(true);

      // Restore the original function
      ApiService.getSystemHealth = originalGetSystemHealth;
    });
  });

  describe('Service Implementations', () => {
    // This section can be expanded with more detailed tests for each service.
    // For now, we'll just test a few to demonstrate the pattern.

    it('should get system health', async () => {
      const result = await ApiService.getSystemHealth();
      expect(result.success).toBe(true);
      expect(result.result).toEqual(mockClarityValue);
    });

    it('should get staking info for a user', async () => {
      const user = 'ST1234567890ABCDEF';
      const result = await ApiService.getStakingInfo(user);
      expect(result.success).toBe(true);
      expect(result.result).toEqual(mockClarityValue);
    });

    it('should handle missing contracts gracefully', async () => {
      const spy = vi
        .spyOn(CoreContracts, 'find')
        .mockReturnValue(undefined);

      const result = await ApiService.getSystemHealth();
      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');

      spy.mockRestore();
    });
  });
});
