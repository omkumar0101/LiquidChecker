"use client"

import { useState } from "react"
import { ArrowUpIcon, ArrowDownIcon, Plus, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for tokens
const mockTokens = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 65432.1, change: 2.5, marketCap: "1.24T", volume: "32.5B" },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    price: 3456.78,
    change: 1.8,
    marketCap: "415.7B",
    volume: "12.3B",
  },
  { id: "solana", name: "Solana", symbol: "SOL", price: 123.45, change: 12.5, marketCap: "53.2B", volume: "4.7B" },
  { id: "cardano", name: "Cardano", symbol: "ADA", price: 0.56, change: -3.2, marketCap: "19.8B", volume: "1.2B" },
  { id: "polkadot", name: "Polkadot", symbol: "DOT", price: 7.89, change: -1.5, marketCap: "10.3B", volume: "0.8B" },
  { id: "avalanche", name: "Avalanche", symbol: "AVAX", price: 34.56, change: 5.6, marketCap: "12.7B", volume: "1.5B" },
]

// Mock chart data
const generateChartData = () => {
  const data = []
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"]

  for (let i = 0; i < months.length; i++) {
    const entry = { date: months[i] }

    entry.BTC = 30000 + Math.random() * 40000
    entry.ETH = 1500 + Math.random() * 2500
    entry.SOL = 50 + Math.random() * 100

    data.push(entry)
  }

  return data
}

const chartData = generateChartData()

export function CompareTokens() {
  const [selectedTokens, setSelectedTokens] = useState(["bitcoin", "ethereum"])
  const [timeframe, setTimeframe] = useState("1m")

  const handleAddToken = (tokenId: string) => {
    if (selectedTokens.length < 3 && !selectedTokens.includes(tokenId)) {
      setSelectedTokens([...selectedTokens, tokenId])
    }
  }

  const handleRemoveToken = (tokenId: string) => {
    setSelectedTokens(selectedTokens.filter((id) => id !== tokenId))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Compare Tokens</h1>
        <p className="text-muted-foreground mt-1">Compare performance and metrics side by side</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="w-full md:w-64">
          <Select onValueChange={handleAddToken}>
            <SelectTrigger>
              <SelectValue placeholder="Add token to compare" />
            </SelectTrigger>
            <SelectContent>
              {mockTokens
                .filter((token) => !selectedTokens.includes(token.id))
                .map((token) => (
                  <SelectItem key={token.id} value={token.id}>
                    {token.name} ({token.symbol})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedTokens.map((tokenId) => {
            const token = mockTokens.find((t) => t.id === tokenId)
            if (!token) return null

            return (
              <div key={token.id} className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
                <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[10px]">
                  {token.symbol.charAt(0)}
                </div>
                <span className="text-sm font-medium">{token.symbol}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 rounded-full"
                  onClick={() => handleRemoveToken(token.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )
          })}

          {selectedTokens.length === 0 && <div className="text-sm text-muted-foreground">Select tokens to compare</div>}
        </div>

        <div className="ml-auto">
          <Tabs defaultValue="1m" onValueChange={setTimeframe}>
            <TabsList>
              <TabsTrigger value="1d">1D</TabsTrigger>
              <TabsTrigger value="1w">1W</TabsTrigger>
              <TabsTrigger value="1m">1M</TabsTrigger>
              <TabsTrigger value="1y">1Y</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {selectedTokens.length > 0 ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Price Comparison</CardTitle>
              <CardDescription>Historical price data for selected tokens</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ChartContainer>
                    <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                          if (active && payload && payload.length) {
                            return (
                              <ChartTooltipContent>
                                <div className="text-sm font-medium">{payload[0].payload.date}</div>
                                {payload.map((entry, index) => (
                                  <div key={index} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                    <span className="text-sm">{entry.name}:</span>
                                    <span className="text-sm font-bold">${Number(entry.value).toLocaleString()}</span>
                                  </div>
                                ))}
                              </ChartTooltipContent>
                            )
                          }
                          return null
                        }}
                      />
                      {selectedTokens.includes("bitcoin") && (
                        <Line
                          type="monotone"
                          dataKey="BTC"
                          name="BTC"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                      )}
                      {selectedTokens.includes("ethereum") && (
                        <Line
                          type="monotone"
                          dataKey="ETH"
                          name="ETH"
                          stroke="#8884d8"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                      )}
                      {selectedTokens.includes("solana") && (
                        <Line
                          type="monotone"
                          dataKey="SOL"
                          name="SOL"
                          stroke="#82ca9d"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                      )}
                      <Legend />
                    </LineChart>
                  </ChartContainer>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Price & Change</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedTokens.map((tokenId) => {
                    const token = mockTokens.find((t) => t.id === tokenId)
                    if (!token) return null

                    return (
                      <div
                        key={token.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            {token.symbol.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{token.name}</div>
                            <div className="text-sm text-muted-foreground">{token.symbol}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">${token.price.toLocaleString()}</div>
                          <div
                            className={`text-sm flex items-center justify-end ${token.change > 0 ? "text-green-500" : "text-red-500"}`}
                          >
                            {token.change > 0 ? (
                              <ArrowUpIcon className="mr-1 h-3 w-3" />
                            ) : (
                              <ArrowDownIcon className="mr-1 h-3 w-3" />
                            )}
                            {Math.abs(token.change)}%
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedTokens.map((tokenId) => {
                    const token = mockTokens.find((t) => t.id === tokenId)
                    if (!token) return null

                    return (
                      <div
                        key={token.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            {token.symbol.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{token.name}</div>
                            <div className="text-sm text-muted-foreground">{token.symbol}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-right">
                          <div className="text-sm text-muted-foreground">Market Cap:</div>
                          <div className="font-medium">${token.marketCap}</div>
                          <div className="text-sm text-muted-foreground">Volume (24h):</div>
                          <div className="font-medium">${token.volume}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <Plus className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Add tokens to compare</h3>
            <p className="text-muted-foreground mb-6">
              Select up to 3 tokens to compare their performance and metrics side by side.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
