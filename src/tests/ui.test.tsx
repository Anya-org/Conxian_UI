
import { render, screen, act, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ConnectWallet from '@/components/ConnectWallet';
import LaunchPage from '@/app/launch/page';
import { WalletProvider } from '@/lib/wallet';
import { ApiService } from '@/lib/api-services';

// Mock the ApiService
vi.mock('@/lib/api-services', () => ({
  ApiService: {
    getDashboardMetrics: vi.fn().mockResolvedValue({
      systemHealth: { success: true, result: 'OK' },
    }),
  },
}));

// Mock the useWallet hook
const mockAddToast = vi.hoisted(() => vi.fn());
vi.mock('@/lib/wallet', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/wallet')>();
  return {
    ...actual,
    useWallet: vi.fn().mockReturnValue({
      stxAddress: null,
      connectWallet: vi.fn(),
      addToast: mockAddToast,
      hasConfirmedAddress: true, // Simulate wallet is installed
    }),
  };
});

// Mock the useSelfLaunch hook
vi.mock('@/lib/hooks/use-self-launch', () => ({
  useSelfLaunch: vi.fn().mockReturnValue({
    currentPhase: {
      id: '1',
      name: 'Phase 1',
      minFunding: 0,
      maxFunding: 10000,
      status: 'active',
      requiredContracts: [],
      communitySupport: 0,
    },
    fundingProgress: { current: 5000, target: 10000, percentage: 50 },
    communityStats: {
      totalContributors: 10,
      totalFunding: 5000,
      averageContribution: 500,
      topContributors: [{ address: 'SP2Z...W8L', amount: 1000, level: 'Gold' }],
    },
    userContribution: { total: 100, level: 'new' },
    isLoading: false,
    error: null,
    contribute: vi.fn().mockResolvedValue({ success: true }),
    getUserContribution: vi.fn(),
  }),
}));

describe('UI Components', () => {
  it('should render the ConnectWallet button', () => {
    render(
      <WalletProvider>
        <ConnectWallet />
      </WalletProvider>
    );
    expect(screen.getByTestId('connect-wallet-button')).toBeInTheDocument();
  });

  it('should render the LaunchPage and show a toast when contributing without a wallet', async () => {
    render(
      <WalletProvider>
        <LaunchPage />
      </WalletProvider>
    );

    // Find the "Contribute" tab
    const contributeTab = screen.getByRole('tab', { name: /contribute/i });
    
    await act(async () => {
      await userEvent.click(contributeTab);
    });

    // Find the tab panel. There should be only one visible at a time.
    const tabPanel = screen.getByRole('tabpanel');

    // Within the tab panel, find and click the "Contribute" button
    const contributeButton = within(tabPanel).getByRole('button', { name: /contribute/i });
    await act(async () => {
      await userEvent.click(contributeButton);
    });

    // Check for the toast message
    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith(
        expect.stringContaining('Please connect your wallet to contribute'),
        'info'
      );
    });
  });

  it('should call the API when a button is clicked', async () => {
    render(
      <WalletProvider>
        <button onClick={() => ApiService.getDashboardMetrics()}>
          Refresh Metrics
        </button>
      </WalletProvider>
    );
    await act(async () => {
      await userEvent.click(screen.getByText('Refresh Metrics'));
    });
    expect(ApiService.getDashboardMetrics).toHaveBeenCalled();
  });
});
