// src/app/launch/page.tsx - Community Self-Launch Dashboard
"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useWallet } from "@/lib/wallet";
import { useSelfLaunch } from "@/lib/hooks/use-self-launch";
import { Input } from "@/components/ui/Input";

export default function LaunchPage() {
  const { stxAddress, connectWallet, addToast } = useWallet();
  const {
    currentPhase,
    fundingProgress,
    communityStats,
    userContribution,
    isLoading,
    error,
    contribute,
    getUserContribution,
  } = useSelfLaunch('testnet');

  const [contributionAmount, setContributionAmount] = useState("100");

  useEffect(() => {
    if (stxAddress) {
      getUserContribution(stxAddress);
    }
  }, [stxAddress, getUserContribution]);

  const handleContribute = async (amount: number) => {
    if (!stxAddress) {
      addToast("Please connect your wallet to contribute.", "info");
      return;
    }

    const result = await contribute(stxAddress, amount);

    if (result.success) {
      addToast(`Successfully contributed ${amount} STX!`, "success");
    } else {
      addToast(result.error || "Contribution failed.", "error");
    }
  };

  const phases = currentPhase ? [{
    id: currentPhase.id,
    name: currentPhase.name,
    funding: fundingProgress.current,
    target: fundingProgress.target,
    contributors: communityStats?.totalContributors || 0,
    contracts: currentPhase.requiredContracts,
    status: currentPhase.status as "pending" | "active" | "completed",
  }] : [];

  if (isLoading && !currentPhase) {
    return <div className="text-center p-8">Loading launch data...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 text-neutral-light">
          Conxian Community Launch
        </h1>
        <p className="text-xl text-gray-400">
          Help bootstrap the future of DeFi through community funding
        </p>
      </div>

      {!stxAddress && (
        <div className="text-center">
          <Button onClick={connectWallet}>Connect Wallet</Button>
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-gray-900 border border-gray-700">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contribute">Contribute</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Phase</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-neutral-light">
                  {currentPhase?.name || 'N/A'}
                </div>
                <p className="text-gray-400">Core infrastructure deployment</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Raised</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-neutral-light">
                  {fundingProgress.current} STX
                </div>
                <p className="text-gray-400">Community contributions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contributors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-neutral-light">
                  {communityStats?.totalContributors || 0}
                </div>
                <p className="text-gray-400">Active community members</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Launch Progress</CardTitle>
              <CardDescription>
                Track our journey to full decentralization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {phases.map((phase) => (
                <div key={phase.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-300">
                      {phase.name}
                    </span>
                    <Badge
                      variant={
                        phase.status === "completed"
                          ? "default"
                          : phase.status === "active"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {phase.status}
                    </Badge>
                  </div>
                  <Progress
                    value={(phase.funding / phase.target) * 100}
                    className="h-2 bg-gray-700"
                  />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>
                      {phase.funding} / {phase.target} STX
                    </span>
                    <span>{phase.contributors} contributors</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contribute" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contribute to the Launch</CardTitle>
              <CardDescription>
                Support the Conxian network and earn rewards.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  placeholder="STX Amount"
                  className="max-w-xs"
                />
                <Button onClick={() => handleContribute(Number(contributionAmount))}>
                  Contribute
                </Button>
              </div>
              <div className="text-sm text-gray-400">
                Your contribution: {userContribution.total || 0} STX
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Contributors</CardTitle>
              <CardDescription>
                Top contributors to the Conxian launch
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {!communityStats?.topContributors || communityStats.topContributors.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">
                    No contributions yet. Be the first!
                  </p>
                ) : (
                  communityStats.topContributors.map((contrib, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 border border-gray-700 rounded bg-gray-800"
                    >
                      <div>
                        <div className="font-medium text-gray-300">
                          {contrib.address.substring(0, 8)}...
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-gray-300">
                          {contrib.amount} STX
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {contrib.level}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
