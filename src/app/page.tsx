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
import { StatCard } from "@/components/ui/StatCard";
import { VStack } from "@/components/ui/VStack";

export default function Home() {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-400">
          An overview of the Conxian ecosystem.
        </p>
      </div>

      <VStack className="mt-8">
        <section>
          <EnvStatus />
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <StatCard
            title="TVL"
            value="$0"
            icon={<CurrencyDollarIcon className="w-5 h-5 text-gray-400" />}
            subtext="Across Conxian protocols"
          />
          <StatCard
            title="Active Vaults"
            value="0"
            icon={<ShieldCheckIcon className="w-5 h-5 text-gray-400" />}
            subtext="Configured & healthy"
          />
          <StatCard
            title="APY (Median)"
            value="0%"
            icon={<ArrowTrendingUpIcon className="w-5 h-5 text-gray-400" />}
            subtext="Benchmarks pending"
          />
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
      </VStack>
    </>
  );
}
