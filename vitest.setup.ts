import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

process.env.VITEST = 'true';

vi.mock('@/lib/wallet', () => ({
  userSession: {
    isUserSignedIn: vi.fn().mockReturnValue(true),
    loadUserData: vi.fn().mockReturnValue({
      profile: {
        stxAddress: {
          mainnet: 'SP3FBR2AGK5H9QPNVFJWC7636X22Y620S00000000',
        },
      },
    }),
  },
}));
