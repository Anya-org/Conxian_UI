
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import ConnectWallet from '@/components/ConnectWallet';
import LaunchPage from '@/app/launch/page';
import { WalletProvider } from '@/lib/wallet';

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
    expect(screen.getByText('Connect Wallet to Contribute')).toBeInTheDocument();
  });
});
