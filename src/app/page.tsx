import EnvStatus from "@/components/EnvStatus";
import WalletConnectButton from "@/components/WalletConnectButton";

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="min-h-screen w-full p-6 sm:p-10">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Conxian Unified Dashboard</h1>
        <WalletConnectButton />
      </header>

      <section className="mb-8">
        <EnvStatus />
      </section>

      <section className="grid gap-4 md:grid-cols-3 mb-8">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-medium mb-1">TVL</h3>
          <div className="text-2xl">$0</div>
          <div className="text-xs text-gray-500">Across Conxian protocols</div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-medium mb-1">Active Vaults</h3>
          <div className="text-2xl">0</div>
          <div className="text-xs text-gray-500">Configured & healthy</div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-medium mb-1">APY (Median)</h3>
          <div className="text-2xl">0%</div>
          <div className="text-xs text-gray-500">Benchmarks pending</div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-semibold mb-3">Vaults</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">List of vaults and quick actions will appear here.</p>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-semibold mb-3">Staking</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">Stake, claim rewards, and view positions.</p>
        </div>
      </section>

      <section className="mt-8">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h2 className="text-lg font-semibold mb-3">Benchmarks</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">Compare against top DeFi, CeFi, banks, and enterprise finance. KPIs: APY, spread, slippage, uptime, latency.</p>
        </div>
      </section>
    </div>
  );
}
