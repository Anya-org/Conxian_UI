import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
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
    <div className="min-h-screen w-full p-6 sm:p-10">
      <header className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold text-neutral-light">Dashboard</h1>
        <WalletConnectButton />
      </header>

      <main className="space-y-10">
        <section>
          <EnvStatus />
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-light">
                TVL
              </CardTitle>
              <DollarSignIcon className="w-4 h-4 text-neutral-medium" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$0</div>
              <p className="text-xs text-neutral-medium">
                Across Conxian protocols
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-light">
                Active Vaults
              </CardTitle>
              <ShieldCheckIcon className="w-4 h-4 text-neutral-medium" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-neutral-medium">
                Configured & healthy
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-neutral-light">
                APY (Median)
              </CardTitle>
              <TrendingUpIcon className="w-4 h-4 text-neutral-medium" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0%</div>
              <p className="text-xs text-neutral-medium">Benchmarks pending</p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Vaults</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm text-neutral-medium font-medium">
                <div>Name</div>
                <div>Asset</div>
                <div className="text-right">APY</div>
              </div>
              <div className="mt-4 text-sm text-neutral-medium">
                No vaults available yet.
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Staking</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-6">
              <div className="rounded-lg bg-neutral-dark p-4">
                <div className="text-sm text-neutral-medium mb-2">
                  Total Staked
                </div>
                <div className="text-xl font-bold">$0</div>
              </div>
              <div className="rounded-lg bg-neutral-dark p-4">
                <div className="text-sm text-neutral-medium mb-2">
                  My Staked
                </div>
                <div className="text-xl font-bold">$0</div>
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
              <p className="text-sm text-neutral-medium">
                Compare against top DeFi, CeFi, banks, and enterprise finance.
                KPIs: APY, spread, slippage, uptime, latency.
              </p>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
