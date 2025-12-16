
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import EnvStatus from "@/components/EnvStatus";
import {
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-400">
          An overview of the Conxian ecosystem.
        </p>
      </div>

      <div className="mt-8 space-y-10">
        <section>
          <EnvStatus />
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">TVL</CardTitle>
              <CurrencyDollarIcon className="w-5 h-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">$0</div>
              <p className="text-xs text-gray-500">Across Conxian protocols</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Active Vaults
              </CardTitle>
              <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">0</div>
              <p className="text-xs text-gray-500">Configured & healthy</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">APY (Median)</CardTitle>
              <ArrowTrendingUpIcon className="w-5 h-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">0%</div>
              <p className="text-xs text-gray-500">Benchmarks pending</p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Vaults</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-500 font-medium">
                <div>Name</div>
                <div>Asset</div>
                <div className="text-right">APY</div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                No vaults available yet.
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Staking</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <div className="rounded-lg bg-gray-800 p-4">
                <div className="text-sm text-gray-500 mb-2">Total Staked</div>
                <div className="text-xl font-bold text-white">$0</div>
              </div>
              <div className="rounded-lg bg-gray-800 p-4">
                <div className="text-sm text-gray-500 mb-2">My Staked</div>
                <div className="text-xl font-bold text-white">$0</div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Benchmarks</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Compare against top DeFi, CeFi, banks, and enterprise finance.
                KPIs: APY, spread, slippage, uptime, latency.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
