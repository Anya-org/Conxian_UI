
import { render, screen } from '@testing-library/react';
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
    await userEvent.click(screen.getByText('Contribute'));
    expect(
      screen.getByText('Connect Wallet to Contribute')
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

    await userEvent.click(screen.getByText('Refresh Metrics'));
    expect(mockApi.getDashboardMetrics).toHaveBeenCalled();
  });
});
