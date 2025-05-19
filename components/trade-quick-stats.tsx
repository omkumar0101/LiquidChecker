import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Token {
  address: string
  name: string
  symbol: string
  marketCap: { usd: string }
  timeframes: {
    "24h": {
      trades?: string
      buys?: string
      sells?: string
    }
  }
}

interface TradeQuickStatsProps {
  tokens: Token[]
}

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2).replace(/\.00$/, "") + "B"
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2).replace(/\.00$/, "") + "M"
  if (num >= 1_000 && num < 1_000_000) return (num / 1_000).toFixed(1) + "k"
  return num.toLocaleString()
}

export function TradeQuickStats({ tokens }: TradeQuickStatsProps) {
  // Calculate total trades, buys, and sells
  const totals = tokens.reduce((acc, token) => {
    const buys = Number(token.timeframes?.["24h"]?.buys || 0)
    const sells = Number(token.timeframes?.["24h"]?.sells || 0)
    return {
      totalTrades: acc.totalTrades + buys + sells,
      totalBuys: acc.totalBuys + buys,
      totalSells: acc.totalSells + sells
    }
  }, { totalTrades: 0, totalBuys: 0, totalSells: 0 })

  // Find token with highest trading activity (buys + sells)
  const highestTradeToken = tokens.reduce((max, token) => {
    const buys = Number(token.timeframes?.["24h"]?.buys || 0)
    const sells = Number(token.timeframes?.["24h"]?.sells || 0)
    const totalTrades = buys + sells
    const maxBuys = Number(max.timeframes?.["24h"]?.buys || 0)
    const maxSells = Number(max.timeframes?.["24h"]?.sells || 0)
    const maxTotalTrades = maxBuys + maxSells
    return totalTrades > maxTotalTrades ? token : max
  }, tokens[0])

  // Find token with lowest trading activity (excluding zero trades)
  const lowestTradeToken = tokens.reduce((min, token) => {
    const buys = Number(token.timeframes?.["24h"]?.buys || 0)
    const sells = Number(token.timeframes?.["24h"]?.sells || 0)
    const totalTrades = buys + sells
    if (totalTrades === 0) return min
    const minBuys = Number(min.timeframes?.["24h"]?.buys || 0)
    const minSells = Number(min.timeframes?.["24h"]?.sells || 0)
    const minTotalTrades = minBuys + minSells
    return totalTrades < minTotalTrades ? token : min
  }, tokens[0])

  // Calculate averages
  const averageTrades = totals.totalTrades / tokens.length
  const averageBuys = totals.totalBuys / tokens.length
  const averageSells = totals.totalSells / tokens.length

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Trades (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(totals.totalTrades)}</div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Buys: {formatNumber(totals.totalBuys)}</span>
            <span>Sells: {formatNumber(totals.totalSells)}</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Highest Trading Token</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{highestTradeToken?.symbol || "N/A"}</div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Buys: {formatNumber(Number(highestTradeToken?.timeframes?.["24h"]?.buys || 0))}</span>
            <span>Sells: {formatNumber(Number(highestTradeToken?.timeframes?.["24h"]?.sells || 0))}</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lowest Trading Token</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lowestTradeToken?.symbol || "N/A"}</div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Buys: {formatNumber(Number(lowestTradeToken?.timeframes?.["24h"]?.buys || 0))}</span>
            <span>Sells: {formatNumber(Number(lowestTradeToken?.timeframes?.["24h"]?.sells || 0))}</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Trades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(averageTrades)}</div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Buys: {formatNumber(averageBuys)}</span>
            <span>Sells: {formatNumber(averageSells)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 