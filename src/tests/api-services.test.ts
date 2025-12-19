import { describe, it, expect, vi, afterEach } from 'vitest';
import { ApiService } from '../lib/api-services';
import { CoreContracts } from '../lib/contracts';
import fetch from 'cross-fetch';

vi.mock('cross-fetch', () => {
  return {
    default: vi.fn(),
  };
});

const mockHexValue = '0x746869732d69732d612d6d6f636b'; // "this-is-a-mock"

describe('API Service', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.mocked(fetch).mockClear();
  });

  it('should expose all contract interaction methods', () => {
    expect(ApiService.getPair).toBeDefined();
    expect(ApiService.getSystemHealth).toBeDefined();
    expect(ApiService.getStakingInfo).toBeDefined();
  });

  describe('Dashboard Metrics', () => {
    it('should fetch all dashboard metrics correctly', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ okay: true, result: mockHexValue }),
      } as Response);

      const metrics = await ApiService.getDashboardMetrics();

      expect(metrics.systemHealth.success).toBe(true);
      expect(metrics.systemHealth.result?.result).toEqual(mockHexValue);
      expect(metrics.aggregatedMetrics.success).toBe(true);
      expect(metrics.financialMetrics.success).toBe(true);
    });

    it('should handle errors in individual metric fetching', async () => {
      const getSystemHealthSpy = vi
        .spyOn(ApiService, 'getSystemHealth')
        .mockResolvedValueOnce({ success: false, error: 'System health check failed' });
      const getAggregatedMetricsSpy = vi.spyOn(ApiService, 'getAggregatedMetrics').mockResolvedValueOnce({
        success: true,
        result: { result: mockHexValue },
      });
      const getFinancialMetricsSpy = vi.spyOn(ApiService, 'getFinancialMetrics').mockResolvedValueOnce({
        success: true,
        result: { result: mockHexValue },
      });

      const metrics = await ApiService.getDashboardMetrics();

      expect(metrics.systemHealth.success).toBe(false);
      expect(metrics.systemHealth.error).toBe('System health check failed');
      expect(metrics.aggregatedMetrics.success).toBe(true);

      getSystemHealthSpy.mockRestore();
      getAggregatedMetricsSpy.mockRestore();
      getFinancialMetricsSpy.mockRestore();
    });
  });

  describe('Service Implementations', () => {
    it('should get system health', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ okay: true, result: mockHexValue }),
      } as Response);

      const result = await ApiService.getSystemHealth();
      expect(result.success).toBe(true);
      expect(result.result?.result).toEqual(mockHexValue);
    });

    it('should get staking info for a user', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ okay: true, result: mockHexValue }),
      } as Response);

      // Use a valid testnet address
      const user = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
      const result = await ApiService.getStakingInfo(user);
      expect(result.success).toBe(true);
      expect(result.result?.result).toEqual(mockHexValue);
    });

    it('should handle fetch errors gracefully', async () => {
      vi.mocked(fetch).mockRejectedValue(new Error('Network request failed'));

      const result = await ApiService.getSystemHealth();
      expect(result.success).toBe(false);
      expect(result.error).toContain('Network request failed');
    });

    it('should handle missing contracts gracefully', async () => {
      const spy = vi.spyOn(CoreContracts, 'find').mockReturnValue(undefined);

      const result = await ApiService.getSystemHealth();
      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');

      spy.mockRestore();
    });
  });
});
