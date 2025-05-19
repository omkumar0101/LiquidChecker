"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { QuickStats } from "@/components/quick-stats"
import { PaginatedActivityTokenList } from "@/components/PaginatedActivityTokenList"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import Image from "next/image"

interface Token {
  symbol: string
  name: string
  marketCap: { usd: string }
  metadata: {
    image_uri: string
  }
  timeframes: {
    "24h": {
      volume: string
      priceChange: string
    }
  }
  address: string
}

interface ChartData {
  name: string
  symbol: string
  value: number
  image: string
  address: string
}

export default function ActivityPage() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState<ChartData[]>([])

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(
          "https://liquidlaunch.app/api/tokens?page=1&limit=1000&search=&sortKey=latestActivity&sortOrder=desc&timeframe=24h&view=in_progress&marketCapMin=0&marketCapMax=1000000&progressMin=0&progressMax=100&filterByHolderCount=false"
        )
        const data = await response.json()
        setTokens(data.tokens)

        // Process data for chart
        const processedData = data.tokens
          .map((token: Token) => ({
            name: token.name,
            symbol: token.symbol,
            value: (parseFloat(token.marketCap.usd) + parseFloat(token.timeframes["24h"].volume)) / 2,
            image: token.metadata.image_uri || "/default-token.png",
            address: token.address
          }))
          .sort((a: ChartData, b: ChartData) => b.value - a.value)
          .slice(0, 10)

        setChartData(processedData)
      } catch (error) {
        console.error("Error fetching tokens:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTokens()
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`
    return `$${num.toFixed(2)}`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-lg">
          <p className="font-bold">{label}</p>
          <p className="text-primary">Average: {formatNumber(payload[0].value)}</p>
        </div>
      )
    }
    return null
  }

  // Custom XAxis tick to show only the symbol (no logo)
  const CustomXAxisTick = (props: any) => {
    const { x, y, payload, index } = props;
    const entry = chartData[index];
    return (
      <g transform={`translate(${x},${y})`}>
        {entry && (
          <text
            x={0}
            y={16}
            textAnchor="middle"
            fill="#666"
            fontSize={12}
          >
            {entry.symbol}
          </text>
        )}
      </g>
    );
  };

  // Custom Bar shape to show logo at the top of each bar, always circular and centered
  const CustomBarWithLogo = (props: any) => {
    const { x, y, width, height, index } = props;
    const entry = chartData[index];
    const logoSize = 36; // slightly larger for clarity
    const logoX = x + width / 2 - logoSize / 2;
    const logoY = y - logoSize - 6; // 6px gap above the bar
    const clipId = `bar-logo-clip-${index}`;
    return (
      <g>
        <defs>
          <clipPath id={clipId}>
            <circle cx={logoX + logoSize / 2} cy={logoY + logoSize / 2} r={logoSize / 2} />
          </clipPath>
        </defs>
        {/* Logo above the bar, always circular and centered */}
        {entry && (
          <image
            href={entry.image}
            x={logoX}
            y={logoY}
            width={logoSize}
            height={logoSize}
            clipPath={`url(#${clipId})`}
            style={{ shapeRendering: 'geometricPrecision', cursor: 'pointer' }}
            preserveAspectRatio="xMidYMid slice"
            onClick={() => window.open(`https://liquidlaunch.app/token/${entry.address}`, '_blank')}
          />
        )}
        {/* The bar itself */}
        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          fill="hsl(var(--primary))"
          rx={4}
          ry={4}
        />
      </g>
    );
  };

  // Helper to generate Y-axis ticks in 5k increments starting from 1k
  const getYAxisTicks = () => {
    if (!chartData.length) return [];
    const max = Math.max(...chartData.map(d => d.value));
    const ticks = [];
    let tick = 1000;
    while (tick < max + 5000) {
      ticks.push(tick);
      tick += 5000;
    }
    return [0, ...ticks];
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Graph Section */}
        <Card>
          <CardHeader>
            <CardTitle>Token Activity (Market Cap + Volume) Overview</CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              This chart shows the average of each token's 24h volume and market cap.
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 44, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="symbol"
                    tick={CustomXAxisTick}
                    interval={0}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatNumber(value)}
                    domain={[0, 'dataMax']}
                    ticks={getYAxisTicks()}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" shape={CustomBarWithLogo} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Section */}
        {!loading && <QuickStats tokens={tokens} />}

        {/* Token List Section */}
        <PaginatedActivityTokenList selectedToken="" />
      </div>
    </DashboardLayout>
  )
} 