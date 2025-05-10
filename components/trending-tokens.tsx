"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpIcon, ArrowDownIcon, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

// Mock data for trending tokens
const mockTrendingTokens = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 65432.1, change: 2.5 },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3456.78, change: 1.8 },
  { id: "solana", name: "Solana", symbol: "SOL", price: 123.45, change: 12.5 },
  { id: "cardano", name: "Cardano", symbol: "ADA", price: 0.56, change: -3.2 },
  { id: "polkadot", name: "Polkadot", symbol: "DOT", price: 7.89, change: -1.5 },
  { id: "avalanche", name: "Avalanche", symbol: "AVAX", price: 34.56, change: 5.6 },
]

export function TrendingTokens() {
  const [tab, setTab] = useState("all")

  const filteredTokens =
    tab === "gainers"
      ? mockTrendingTokens.filter((token) => token.change > 0)
      : tab === "losers"
        ? mockTrendingTokens.filter((token) => token.change < 0)
        : mockTrendingTokens

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Trending Tokens</h2>
          <p className="text-muted-foreground">Real-time price movements and market trends</p>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <TrendingDown className="h-5 w-5 text-primary" />
        </div>
      </div>
      <Tabs defaultValue="all" className="w-full" onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-secondary/50">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            All
          </TabsTrigger>
          <TabsTrigger value="gainers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Top Gainers
          </TabsTrigger>
          <TabsTrigger value="losers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Top Losers
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTokens.map((token) => (
              <TokenCard key={token.id} token={token} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="gainers" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTokens.map((token) => (
              <TokenCard key={token.id} token={token} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="losers" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTokens.map((token) => (
              <TokenCard key={token.id} token={token} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TokenCard({ token }: { token: any }) {
  const isPositive = token.change > 0

  return (
    <Card className="card-hover glass-effect">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 mr-3 flex items-center justify-center">
            <span className="text-lg font-semibold text-primary">{token.symbol.charAt(0)}</span>
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{token.name}</CardTitle>
            <CardDescription className="text-sm">{token.symbol}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              ${token.price.toLocaleString()}
            </div>
            <p className={`text-sm flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}>
              {isPositive ? (
                <ArrowUpIcon className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDownIcon className="mr-1 h-4 w-4" />
              )}
              {Math.abs(token.change)}% in 24h
            </p>
          </div>
          <Link href={`/tokens/${token.id}`}>
            <Button variant="outline" size="sm" className="hover-scale">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
