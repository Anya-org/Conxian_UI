
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

export default function CoreContracts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Core Contracts</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          Backend integration for contract status is pending.
        </p>
      </CardContent>
    </Card>
  );
}
