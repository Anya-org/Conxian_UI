import { AppConfig, UserSession } from '@stacks/auth';
import { showConnect, AuthOptions } from '@stacks/connect';

const appConfig = new AppConfig(['store_write', 'publish_data']);
export const userSession = new UserSession({ appConfig });

export function getAuthOptions(): AuthOptions {
  return {
    appDetails: {
      name: 'Conxian Unified Dashboard',
      icon: '/favicon.ico',
    },
    redirectTo: '/',
    onFinish: () => {
      // no-op; page components can react to userSession state
      window.location.reload();
    },
    userSession,
  };
}

export async function connectWallet() {
  if (!userSession.isUserSignedIn()) {
    const opts = getAuthOptions();
    showConnect(opts);
  }
}

export function signOut() {
  if (userSession.isUserSignedIn()) {
    userSession.signUserOut('/');
  }
}
