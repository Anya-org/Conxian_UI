
import { render, screen, act, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ConnectWallet from '@/components/ConnectWallet';
import LaunchPage from '@/app/launch/page';
import { WalletProvider, useWallet } from '@/lib/wallet';
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
const mockAddToast = vi.fn();
vi.mock('@/lib/wallet', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as any),
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
      status: 'active',
      requiredContracts: [],
    },
    fundingProgress: { current: 5000, target: 10000 },
    communityStats: { contributors: 10, topContributors: [{ address: 'SP2Z...W8L', amount: 1000, level: 'Gold' }] },
    userContribution: 100,
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
      expect(mockAddToast).toHaveBeenCalledWith(expect.stringContaining('Please connect your wallet to contribute'));
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
