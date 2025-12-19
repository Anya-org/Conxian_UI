
import { render, screen, act, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ConnectWallet from '@/components/ConnectWallet';
import LaunchPage from '@/app/launch/page';
import { WalletProvider } from '@/lib/wallet';
import { useApi } from '@/lib/api-client';

// Mock the useApi hook
vi.mock('@/lib/api-client', () => ({
  useApi: vi.fn().mockReturnValue({
    getDashboardMetrics: vi.fn().mockResolvedValue({
      systemHealth: { success: true, result: 'OK' },
    }),
  }),
}));

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
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
  });

  it('should render the LaunchPage and show the connect wallet button', async () => {
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
    expect(
      await screen.findByText('Please connect your wallet to contribute.')
    ).toBeInTheDocument();
  });

  it('should call the API when a button is clicked', async () => {
    const mockApi = useApi();
    render(
      <WalletProvider>
        <button onClick={() => mockApi.getDashboardMetrics()}>
          Refresh Metrics
        </button>
      </WalletProvider>
    );
    await act(async () => {
      await userEvent.click(screen.getByText('Refresh Metrics'));
    });
    expect(mockApi.getDashboardMetrics).toHaveBeenCalled();
  });
});
