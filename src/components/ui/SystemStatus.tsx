
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

export default function SystemStatus() {
  const data = {
    tvl: "1,234,567.89",
    activeVaults: 42,
    apy: "5.25",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-3">
        <div className="flex items-center">
          <CurrencyDollarIcon className="w-8 h-8 text-gray-400" />
          <div className="ml-4">
            <div className="text-sm text-gray-500">TVL</div>
            <div className="text-2xl font-bold text-white">${data.tvl}</div>
          </div>
        </div>
        <div className="flex items-center">
          <ShieldCheckIcon className="w-8 h-8 text-gray-400" />
          <div className="ml-4">
            <div className="text-sm text-gray-500">Active Vaults</div>
            <div className="text-2xl font-bold text-white">
              {data.activeVaults}
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <ArrowTrendingUpIcon className="w-8 h-8 text-gray-400" />
          <div className="ml-4">
            <div className="text-sm text-gray-500">APY (Median)</div>
            <div className="text-2xl font-bold text-white">{data.apy}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
