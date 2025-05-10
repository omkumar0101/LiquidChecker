"use client"

import { useState } from "react"
import { ArrowUpIcon, ArrowDownIcon, Star, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer } from "recharts"

// Mock data for tokens
const mockTokens = {
  bitcoin: {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    price: 65432.1,
    change: 2.5,
    marketCap: "1.24T",
    volume: "32.5B",
    liquidity: "8.7B",
    description:
      "Bitcoin is a decentralized digital currency, without a central bank or single administrator, that can be sent from user to user on the peer-to-peer bitcoin network without the need for intermediaries.",
    website: "https://bitcoin.org",
    twitter: "https://twitter.com/bitcoin",
    github: "https://github.com/bitcoin",
  },
  ethereum: {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    price: 3456.78,
    change: 1.8,
    marketCap: "415.7B",
    volume: "12.3B",
    liquidity: "5.2B",
    description:
      "Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether is the native cryptocurrency of the platform. Amongst cryptocurrencies, Ether is second only to Bitcoin in market capitalization.",
    website: "https://ethereum.org",
    twitter: "https://twitter.com/ethereum",
    github: "https://github.com/ethereum",
  },
  solana: {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    price: 123.45,
    change: 12.5,
    marketCap: "53.2B",
    volume: "4.7B",
    liquidity: "2.1B",
    description:
      "Solana is a high-performance blockchain supporting builders around the world creating crypto apps that scale today. Solana is known for its fast transaction speeds and low fees.",
    website: "https://solana.com",
    twitter: "https://twitter.com/solana",
    github: "https://github.com/solana-labs",
  },
}

// Mock data for chart
const mockChartData = [
  { date: "Jan", price: 42000 },
  { date: "Feb", price: 47000 },
  { date: "Mar", price: 53000 },
  { date: "Apr", price: 58000 },
  { date: "May", price: 51000 },
  { date: "Jun", price: 59000 },
  { date: "Jul", price: 62000 },
  { date: "Aug", price: 65432 },
]

export function TokenDetails({ id }: { id: string }) {
  const [timeframe, setTimeframe] = useState("1d")
  const [inWatchlist, setInWatchlist] = useState(false)
  const { toast } = useToast()

  // Get token data based on ID, default to Bitcoin if not found
  const token = mockTokens[id as keyof typeof mockTokens] || mockTokens.bitcoin

  const handleAddToWatchlist = () => {
    setInWatchlist(!inWatchlist)
    toast({
      title: inWatchlist ? "Removed from watchlist" : "Added to watchlist",
      description: inWatchlist
        ? `${token.name} has been removed from your watchlist.`
        : `${token.name} has been added to your watchlist.`,
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary/20 mr-3 flex items-center justify-center">
              {token.symbol.charAt(0)}
            </div>
            {token.name} ({token.symbol})
          </h1>
          <div className="flex items-center mt-2">
            <span className="text-2xl font-bold mr-2">${token.price.toLocaleString()}</span>
            <span className={`text-sm flex items-center ${token.change > 0 ? "text-green-500" : "text-red-500"}`}>
              {token.change > 0 ? <ArrowUpIcon className="mr-1 h-4 w-4" /> : <ArrowDownIcon className="mr-1 h-4 w-4" />}
              {Math.abs(token.change)}% (24h)
            </span>
          </div>
        </div>
        <Button variant={inWatchlist ? "default" : "outline"} className="gap-2" onClick={handleAddToWatchlist}>
          <Star className={`h-4 w-4 ${inWatchlist ? "fill-primary-foreground" : ""}`} />
          {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Price Chart</CardTitle>
            <Tabs defaultValue="1d" onValueChange={setTimeframe}>
              <TabsList>
                <TabsTrigger value="1d">1D</TabsTrigger>
                <TabsTrigger value="1w">1W</TabsTrigger>
                <TabsTrigger value="1m">1M</TabsTrigger>
                <TabsTrigger value="1y">1Y</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ChartContainer>
                <AreaChart data={mockChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length > 0 && payload[0]?.payload) {
                        return (
                          <ChartTooltipContent>
                            <div className="text-sm font-medium">{payload[0].payload.date}</div>
                            <div className="text-sm font-bold">${payload[0].value?.toLocaleString()}</div>
                          </ChartTooltipContent>
                        )
                      }
                      return null
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorPrice)"
                  />
                </AreaChart>
              </ChartContainer>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${token.price.toLocaleString()}</div>
            <p className={`text-xs flex items-center ${token.change > 0 ? "text-green-500" : "text-red-500"}`}>
              {token.change > 0 ? <ArrowUpIcon className="mr-1 h-3 w-3" /> : <ArrowDownIcon className="mr-1 h-3 w-3" />}
              {Math.abs(token.change)}% in 24h
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${token.marketCap}</div>
            <p className="text-xs text-muted-foreground">
              Rank #{token.id === "bitcoin" ? "1" : token.id === "ethereum" ? "2" : "3"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${token.volume}</div>
            <p className="text-xs text-muted-foreground">23,456 {token.symbol}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Liquidity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${token.liquidity}</div>
            <p className="text-xs text-muted-foreground">Across all pools</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About {token.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{token.description}</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href={token.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center py-2 border rounded-md hover:bg-muted transition-colors gap-2"
            >
              Website
              <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href={token.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center py-2 border rounded-md hover:bg-muted transition-colors gap-2"
            >
              Twitter
              <ExternalLink className="h-4 w-4" />
            </a>
            <a
              href={token.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center py-2 border rounded-md hover:bg-muted transition-colors gap-2"
            >
              GitHub
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
