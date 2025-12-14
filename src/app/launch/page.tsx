// src/app/launch/page.tsx - Community Self-Launch Dashboard
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LaunchPhase {
  id: string;
  name: string;
  funding: number;
  target: number;
  contributors: number;
  contracts: string[];
  status: 'pending' | 'active' | 'completed';
}

interface Contribution {
  address: string;
  amount: number;
  tokens: number;
  timestamp: number;
  level: string;
}

export default function LaunchPage() {
  const [currentPhase, setCurrentPhase] = useState('bootstrap');
  const [totalFunding, setTotalFunding] = useState(0);
  const [userContribution, setUserContribution] = useState(0);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Mock data - in production, fetch from smart contracts
  const phases: LaunchPhase[] = [
    {
      id: 'bootstrap',
      name: 'Community Bootstrap',
      funding: 100,
      target: 500,
      contributors: 3,
      contracts: ['all-traits', 'utils-encoding', 'utils-utils'],
      status: 'active'
    },
    {
      id: 'micro_core',
      name: 'Micro Core',
      funding: 0,
      target: 1000,
      contributors: 0,
      contracts: ['cxd-price-initializer', 'token-system-coordinator'],
      status: 'pending'
    },
    {
      id: 'token_system',
      name: 'Token System',
      funding: 0,
      target: 2500,
      contributors: 0,
      contracts: ['cxd-token', 'token-emission-controller'],
      status: 'pending'
    }
  ];

  const handleContribute = async (amount: number) => {
    // In production: call smart contract contribution function
    console.log(`Contributing ${amount} STX`);

    // Update UI state
    setUserContribution(prev => prev + amount);
    setTotalFunding(prev => prev + amount);

    // Add to contributions list
    const newContribution: Contribution = {
      address: 'ST1...',
      amount: amount,
      tokens: amount * 100, // Simplified calculation
      timestamp: Date.now(),
      level: amount >= 100 ? 'whale' : amount >= 10 ? 'dolphin' : 'fish'
    };

    setContributions(prev => [newContribution, ...prev]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Conxian Community Launch</h1>
        <p className="text-xl text-muted-foreground">
          Help bootstrap the future of DeFi through community funding
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contribute">Contribute</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="leaderboard">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Current Phase</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Bootstrap</div>
                <p className="text-muted-foreground">Core infrastructure deployment</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Total Raised</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalFunding} STX</div>
                <p className="text-muted-foreground">Community contributions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contributors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{contributions.length}</div>
                <p className="text-muted-foreground">Active community members</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Launch Progress</CardTitle>
              <CardDescription>Track our journey to full decentralization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {phases.map((phase) => (
                <div key={phase.id} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{phase.name}</span>
                    <Badge variant={phase.status === 'completed' ? 'default' :
                                  phase.status === 'active' ? 'secondary' : 'outline'}>
                      {phase.status}
                    </Badge>
                  </div>
                  <Progress
                    value={(phase.funding / phase.target) * 100}
                    className="h-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{phase.funding} / {phase.target} STX</span>
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
              <CardTitle>Make a Contribution</CardTitle>
              <CardDescription>
                Help fund the next phase of Conxian development
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleContribute(1)}
                  variant="outline"
                  className="h-20 flex flex-col"
                >
                  <span className="text-lg font-bold">1 STX</span>
                  <span className="text-sm">Minnow</span>
                </Button>
                <Button
                  onClick={() => handleContribute(10)}
                  variant="outline"
                  className="h-20 flex flex-col"
                >
                  <span className="text-lg font-bold">10 STX</span>
                  <span className="text-sm">Fish</span>
                </Button>
                <Button
                  onClick={() => handleContribute(100)}
                  variant="outline"
                  className="h-20 flex flex-col"
                >
                  <span className="text-lg font-bold">100 STX</span>
                  <span className="text-sm">Dolphin</span>
                </Button>
                <Button
                  onClick={() => handleContribute(1000)}
                  variant="outline"
                  className="h-20 flex flex-col"
                >
                  <span className="text-lg font-bold">1000 STX</span>
                  <span className="text-sm">Whale</span>
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Your contribution will help deploy the next phase contracts
                </p>
                {!isConnected && (
                  <Button>Connect Wallet to Contribute</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Deployment Progress</CardTitle>
              <CardDescription>Contracts deployed in each phase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {phases.map((phase) => (
                  <div key={phase.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">{phase.name}</h3>
                      <Badge>{phase.status}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Contracts:</span>
                        <div className="font-mono text-xs mt-1">
                          {phase.contracts.join(', ')}
                        </div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Progress:</span>
                        <div className="mt-1">
                          <Progress value={(phase.funding / phase.target) * 100} />
                          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                            <span>{phase.funding} STX</span>
                            <span>{phase.target} STX target</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Community Contributors</CardTitle>
              <CardDescription>Top contributors to the Conxian launch</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {contributions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No contributions yet. Be the first!
                  </p>
                ) : (
                  contributions.map((contrib, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <div className="font-medium">
                          {contrib.address.substring(0, 8)}...
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(contrib.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{contrib.amount} STX</div>
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
