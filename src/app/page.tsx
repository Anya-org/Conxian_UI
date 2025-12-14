import EnvStatus from "@/components/EnvStatus";
import WalletConnectButton from "@/components/WalletConnectButton";

export const dynamic = "force-dynamic";

const DollarSignIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const ShieldCheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const TrendingUpIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-gray-950 text-white p-6 sm:p-10">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold">Conxian Unified Dashboard</h1>
        <WalletConnectButton />
      </header>

      <section className="mb-8">
        <EnvStatus />
      </section>

      <section className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-400">TVL</h3>
            <DollarSignIcon className="h-6 w-6 text-gray-500" />
          </div>
          <div className="text-3xl font-bold">$0</div>
          <div className="text-sm text-gray-500">Across Conxian protocols</div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-400">Active Vaults</h3>
            <ShieldCheckIcon className="h-6 w-6 text-gray-500" />
          </div>
          <div className="text-3xl font-bold">0</div>
          <div className="text-sm text-gray-500">Configured & healthy</div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-400">APY (Median)</h3>
            <TrendingUpIcon className="h-6 w-6 text-gray-500" />
          </div>
          <div className="text-3xl font-bold">0%</div>
          <div className="text-sm text-gray-500">Benchmarks pending</div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-lg font-semibold mb-4">Vaults</h2>
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-400 font-medium">
            <div>Name</div>
            <div>Asset</div>
            <div className="text-right">APY</div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            No vaults available yet.
          </div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-lg font-semibold mb-4">Staking</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-lg bg-gray-800 p-4">
              <div className="text-sm text-gray-400 mb-2">Total Staked</div>
              <div className="text-xl font-bold">$0</div>
            </div>
            <div className="rounded-lg bg-gray-800 p-4">
              <div className="text-sm text-gray-400 mb-2">My Staked</div>
              <div className="text-xl font-bold">$0</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-lg font-semibold mb-4">Benchmarks</h2>
          <div className="text-sm text-gray-400">
            Compare against top DeFi, CeFi, banks, and enterprise finance. KPIs:
            APY, spread, slippage, uptime, latency.
          </div>
        </div>
      </section>
    </div>
  );
}
