"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface Token {
  symbol: string
  marketCap: { usd: string }
  timeframes: {
    "24h": {
      priceChange: string
      volume?: string
      buys?: string
      sells?: string
    }
  }
  holderCount?: string
  progress?: string
  liquidity?: { usd: string }
  tokenReserves?: string
  hypeReserves?: string
}

export default function Home() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(
          "https://liquidlaunch.app/api/tokens?page=1&limit=1500&search=&sortKey=marketCap&sortOrder=desc&timeframe=24h&view=in_progress&marketCapMin=0&marketCapMax=1000000&progressMin=0&progressMax=100&filterByHolderCount=false"
        )
        const data = await response.json()
        setTokens(data.tokens)
        if (data.tokens && data.tokens.length > 0) {
          // Debug log for the first token
          // eslint-disable-next-line no-console
          console.log("Sample token from API:", data.tokens[0])
        }
      } catch (error) {
        console.error("Error fetching tokens:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTokens()
  }, [])

  // Calculate global stats
  const globalStats = useMemo(() => {
    let totalMarketCap = 0
    let totalVolume = 0
    let totalLiquidity = 0
    let totalTrades = 0
    let totalTokens = 0
    let totalHolders = 0
    let totalProgressTokens = 0
    let totalSupply = 0
    let priceChangeSum = 0
    let priceChangeCount = 0

    tokens.forEach((token: any) => {
      totalTokens++
      totalMarketCap += Number(token.marketCap?.usd || 0)
      totalVolume += Number(token.timeframes?.["24h"]?.volume || 0) * 1000000
      totalLiquidity += Number(token.liquidity?.usd || 0)
      totalTrades += Number(token.timeframes?.["24h"]?.buys || 0) + Number(token.timeframes?.["24h"]?.sells || 0)
      totalHolders += Number(token.holderCount || 0)
      if (Number(token.progress) === 100) totalProgressTokens++
      totalSupply += Number(token.tokenReserves || 0) + Number(token.hypeReserves || 0)
      if (token.timeframes?.["24h"]?.priceChange !== undefined) {
        priceChangeSum += Number(token.timeframes["24h"].priceChange)
        priceChangeCount++
      }
    })

    return {
      totalMarketCap,
      totalVolume,
      totalLiquidity,
      totalTrades,
      totalTokens,
      totalHolders,
      totalProgressTokens,
      totalSupply,
      avgPriceChange: priceChangeCount ? priceChangeSum / priceChangeCount : 0
    }
  }, [tokens])

  const formatNumber = (num: number): string => {
    if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2).replace(/\.00$/, "") + "B"
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2).replace(/\.00$/, "") + "M"
    if (num >= 1_000) return (num / 1_000).toFixed(2).replace(/\.00$/, "") + "k"
    return num.toLocaleString()
  }

  // Prepare data for Quick Stats Graph
  const quickStatsGraphData = [
    {
      name: "Market Cap",
      value: globalStats.totalMarketCap,
    },
    {
      name: "Volume",
      value: globalStats.totalVolume,
    },
    {
      name: "Liquidity",
      value: globalStats.totalLiquidity,
    },
    {
      name: "Trades",
      value: globalStats.totalTrades,
    },
  ]

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Global Stats Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-1">Global Stats in 24 hours</h2>
          <p className="text-muted-foreground mb-6 text-base">Key aggregated metrics for all tokens in the last 24 hours. Includes market cap, volume, liquidity, trades, holders, supply, and more.</p>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div className="bg-muted rounded-lg p-6 flex flex-col items-center">
                <span className="text-muted-foreground text-sm mb-1">Total Market Cap</span>
                <span className="text-2xl font-bold">${formatNumber(globalStats.totalMarketCap)}</span>
              </div>
              <div className="bg-muted rounded-lg p-6 flex flex-col items-center">
                <span className="text-muted-foreground text-sm mb-1">Total Volume</span>
                <span className="text-2xl font-bold">${formatNumber(globalStats.totalVolume)}</span>
              </div>
              <div className="bg-muted rounded-lg p-6 flex flex-col items-center">
                <span className="text-muted-foreground text-sm mb-1">Total Liquidity</span>
                <span className="text-2xl font-bold">${formatNumber(globalStats.totalLiquidity)}</span>
              </div>
              <div className="bg-muted rounded-lg p-6 flex flex-col items-center">
                <span className="text-muted-foreground text-sm mb-1">Total Trades</span>
                <span className="text-2xl font-bold">{formatNumber(globalStats.totalTrades)}</span>
              </div>
              <div className="bg-muted rounded-lg p-6 flex flex-col items-center">
                <span className="text-muted-foreground text-sm mb-1">Total Tokens Created</span>
                <span className="text-2xl font-bold">{formatNumber(globalStats.totalTokens)}</span>
              </div>
              <div className="bg-muted rounded-lg p-6 flex flex-col items-center">
                <span className="text-muted-foreground text-sm mb-1">Total Holders</span>
                <span className="text-2xl font-bold">{formatNumber(globalStats.totalHolders)}</span>
              </div>
              <div className="bg-muted rounded-lg p-6 flex flex-col items-center">
                <span className="text-muted-foreground text-sm mb-1">Total Progress Tokens (100%)</span>
                <span className="text-2xl font-bold">{formatNumber(globalStats.totalProgressTokens)}</span>
              </div>
              <div className="bg-muted rounded-lg p-6 flex flex-col items-center">
                <span className="text-muted-foreground text-sm mb-1">Total Supply Data</span>
                <span className="text-2xl font-bold">{formatNumber(globalStats.totalSupply)}</span>
              </div>
              <div className="bg-muted rounded-lg p-6 flex flex-col items-center">
                <span className="text-muted-foreground text-sm mb-1">Avg. Price Change (24h)</span>
                <span className="text-2xl font-bold">{globalStats.avgPriceChange.toFixed(2)}%</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats Graph Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4">Quick Stats Graph</h2>
          <div className="bg-muted rounded-lg p-6">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={quickStatsGraphData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={formatNumber} />
                <Tooltip formatter={(value: number) => formatNumber(value)} />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
