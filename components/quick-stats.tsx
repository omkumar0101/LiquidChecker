"use client"

import { ArrowDownIcon, ArrowUpIcon, Coins, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Token {
  symbol: string
  marketCap: { usd: string }
  timeframes: {
    "24h": {
      priceChange: string
    }
  }
}

interface QuickStatsProps {
  tokens?: Token[]
}

export function QuickStats({ tokens = [] }: QuickStatsProps) {
  const totalTokens = tokens.length
  const totalMarketCap = tokens.reduce((sum, token) => sum + parseFloat(token.marketCap.usd), 0)
  
  const topGainer = tokens.length > 0 ? tokens.reduce((max, token) => {
    const priceChange = parseFloat(token.timeframes["24h"].priceChange)
    return priceChange > parseFloat(max.timeframes["24h"].priceChange) ? token : max
  }, tokens[0]) : { symbol: "N/A", timeframes: { "24h": { priceChange: "0" } } }

  const topLoser = tokens.length > 0 ? tokens.reduce((min, token) => {
    const priceChange = parseFloat(token.timeframes["24h"].priceChange)
    return priceChange < parseFloat(min.timeframes["24h"].priceChange) ? token : min
  }, tokens[0]) : { symbol: "N/A", timeframes: { "24h": { priceChange: "0" } } }

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Quick Stats</h2>
          <p className="text-muted-foreground">Key market indicators at a glance</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover glass-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tokens Tracked</CardTitle>
            <Coins className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {totalTokens.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Active tokens in the market</p>
          </CardContent>
        </Card>
        <Card className="card-hover glass-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {formatNumber(totalMarketCap)}
            </div>
            <p className="text-sm text-muted-foreground">Total market value</p>
          </CardContent>
        </Card>
        <Card className="card-hover glass-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Gainer</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {topGainer.symbol}
            </div>
            <p className="text-sm text-green-500 flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4" />
              +{parseFloat(topGainer.timeframes["24h"].priceChange).toFixed(2)}% in 24h
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover glass-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Loser</CardTitle>
            <TrendingDown className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              {topLoser.symbol}
            </div>
            <p className="text-sm text-red-500 flex items-center">
              <ArrowDownIcon className="mr-1 h-4 w-4" />
              {parseFloat(topLoser.timeframes["24h"].priceChange).toFixed(2)}% in 24h
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
