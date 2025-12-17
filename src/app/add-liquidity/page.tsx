"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function AddLiquidityPage() {
  return (
    <div className="min-h-screen w-full p-6 sm:p-10 space-y-8">
      <header className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold text-neutral-light">Add Liquidity</h1>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Pool Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">Liquidity pools loading...</p>
        </CardContent>
      </Card>
    </div>
  );
}
