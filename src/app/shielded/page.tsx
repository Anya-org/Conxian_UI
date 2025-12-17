"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function ShieldedPage() {
  return (
    <div className="min-h-screen w-full p-6 sm:p-10 space-y-8">
      <header className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold text-neutral-light">Shielded Wallets</h1>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Shielded Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400">Shielded wallet integration coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
