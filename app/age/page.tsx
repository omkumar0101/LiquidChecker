"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2).replace(/\.00$/, "") + "B"
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2).replace(/\.00$/, "") + "M"
  if (num >= 1_000 && num < 1_000_000) return (num / 1_000).toFixed(1) + "k"
  return num.toLocaleString()
}

function shortAddress(addr: string): string {
  if (!addr) return ""
  return addr.slice(0, 3) + "..." + addr.slice(-4)
}

function timeAgo(timestamp: number): string {
  const now = Math.floor(Date.now() / 1000)
  const diff = now - timestamp
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

interface Token {
  address: string
  name: string
  symbol: string
  marketCap: { usd: string }
  liquidity?: { usd: string }
  metadata: {
    image_uri: string
    description?: string
    website?: string
    twitter?: string
    discord?: string
    telegram?: string
  }
  creationTimestamp: number
  creator?: string
  progress?: number
  timeframes?: {
    "24h"?: {
      priceChange?: string
      volume?: string
    }
  }
  holderCount?: string
}

export default function AgePage() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchTokens = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `https://liquidlaunch.app/api/tokens?page=${page}&limit=15&search=&sortKey=age&sortOrder=desc&timeframe=24h&view=in_progress&marketCapMin=0&marketCapMax=1000000&progressMin=0&progressMax=100&filterByHolderCount=false`
        )
        const data = await response.json()
        setTokens(data.tokens)
        setTotalPages(data.pagination?.totalPages || 1)
      } catch (error) {
        console.error("Error fetching tokens:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTokens()
  }, [page])

  // Prepare chart data for the graph section using tokens as-is from the API (already sorted by newest)
  const chartData = tokens.map(token => ({
    name: token.name,
    symbol: token.symbol,
    marketCap: Number(token.marketCap?.usd || 0),
    volume: Number(token.timeframes?.["24h"]?.volume || 0) * 1000000,
    image: token.metadata?.image_uri || "/default-token.png"
  }))

  // Get max values for Y-axis domains
  const maxMarketCap = Math.max(...chartData.map(d => d.marketCap))
  const maxVolume = Math.max(...chartData.map(d => d.volume))

  // Helper to generate Y-axis ticks in custom increments
  function getTicks(max: number, interval: number) {
    const ticks = [0]
    let tick = interval
    while (tick < max * 1.1) {
      ticks.push(tick)
      tick += interval
    }
    return ticks
  }

  // Custom Bar shape to show logo at the top of each bar, always circular and centered
  const CustomBarWithLogo = (props: any) => {
    const { x, y, width, height, index } = props;
    const entry = chartData[index];
    const logoSize = 36;
    const logoX = x + width / 2 - logoSize / 2;
    const logoY = y - logoSize - 6;
    const clipId = `bar-logo-clip-age-${index}`;
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
            style={{ shapeRendering: 'geometricPrecision' }}
            preserveAspectRatio="xMidYMid slice"
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

  // Custom dot for LineChart to show token logo as a circle
  const CustomLogoDot = (props: any) => {
    const { cx, cy, index } = props;
    const entry = chartData[index];
    const logoSize = 32;
    const clipId = `line-logo-clip-age-${index}`;
    return (
      <g key={(entry?.symbol || 'dot') + '-' + index}>
        <defs>
          <clipPath id={clipId}>
            <circle cx={cx} cy={cy} r={logoSize / 2} />
          </clipPath>
        </defs>
        {entry && (
          <image
            href={entry.image}
            x={cx - logoSize / 2}
            y={cy - logoSize / 2}
            width={logoSize}
            height={logoSize}
            clipPath={`url(#${clipId})`}
            style={{ shapeRendering: 'geometricPrecision' }}
            preserveAspectRatio="xMidYMid slice"
          />
        )}
      </g>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Graph Section */}
        <Card>
          <CardHeader>
            <p className="text-muted-foreground text-sm mt-1">
              This chart shows the market cap and 24h volume of the most recently created tokens.
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 44, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="symbol"
                    tick={({ x, y, payload }) => (
                      <g transform={`translate(${x},${y})`}>
                        <text
                          x={0}
                          y={16}
                          textAnchor="middle"
                          fill="#666"
                          fontSize={12}
                        >
                          {payload.value}
                        </text>
                      </g>
                    )}
                    interval={0}
                  />
                  <YAxis 
                    yAxisId="left"
                    tickFormatter={(value) => formatNumber(value)}
                    domain={[0, maxMarketCap * 1.1]}
                    ticks={getTicks(maxMarketCap, 5000)}
                  />
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(value) => formatNumber(value)}
                    domain={[0, maxVolume > 0 ? maxVolume * 1.1 : 1]}
                    ticks={getTicks(maxVolume, 100)}
                  />
                  <Tooltip content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const marketCap = typeof payload[0].value === 'number' ? payload[0].value : 0;
                      const volume = typeof payload[1].value === 'number' ? payload[1].value : 0;
                      return (
                        <div className="bg-background border rounded-lg p-3 shadow-lg">
                          <p className="font-bold">{label}</p>
                          <p className="text-primary">Market Cap: {formatNumber(marketCap)}</p>
                          <p className="text-blue-500">Volume: {formatNumber(volume)}</p>
                        </div>
                      )
                    }
                    return null
                  }} />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="marketCap" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3} 
                    dot={CustomLogoDot} 
                    activeDot={CustomLogoDot} 
                    name="Market Cap"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#007bff"
                    strokeWidth={3} 
                    dot={false}
                    name="Volume"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Latest Tokens (by Age)</CardTitle>
            <p className="text-muted-foreground text-sm mt-1">
              This page shows the most recently created tokens.
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {tokens.map((token) => {
                    const creatorShort = token.creator ? token.creator.slice(-6) : ""
                    const website = token.metadata?.website
                    const description = token.metadata?.description || ""
                    const progress = Math.round(token.progress || 0)
                    const priceChange = token.timeframes?.["24h"]?.priceChange
                    const priceChangeNum = Number(priceChange)
                    const priceChangeColor = priceChangeNum > 0 ? "text-green-400" : priceChangeNum < 0 ? "text-red-400" : "text-green-400"
                    return (
                      <div
                        key={token.address}
                        onClick={() => window.open(`https://liquidlaunch.app/token/${token.address}`, '_blank')}
                        className="rounded-xl border border-border bg-gradient-to-br from-background via-primary/5 to-muted/40 p-3 shadow-md flex flex-col gap-2 relative min-h-[220px] group hover:border-primary/50 transition-colors cursor-pointer"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            window.open(`https://liquidlaunch.app/token/${token.address}`, '_blank')
                          }
                        }}
                      >
                        {/* Top row: logo, symbol, creator, website, socials */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {token.metadata?.image_uri ? (
                              <img src={token.metadata.image_uri || '/default-token.png'} alt={token.symbol} className="w-10 h-10 rounded-full object-cover border border-primary/30" />
                            ) : (
                              <img src="/default-token.png" alt={token.symbol} className="w-10 h-10 rounded-full object-cover border border-primary/30" />
                            )}
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-bold text-foreground">{token.symbol}</span>
                                {token.creator && (
                                  <a
                                    href={`https://liquidlaunch.app/portfolio/${token.creator}`}
                                    className="text-xs font-mono text-primary bg-primary/10 rounded px-1 py-0.5 cursor-pointer focus:outline-none hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="View creator portfolio"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {creatorShort}
                                  </a>
                                )}
                              </div>
                              <span className="text-base text-muted-foreground font-semibold leading-tight">{token.name}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {token.metadata?.website && (
                              <a href={token.metadata.website} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" title="Website" onClick={(e) => e.stopPropagation()}>
                                <i className="fa-solid fa-globe h-5 w-5"></i>
                              </a>
                            )}
                            {token.metadata?.twitter && (
                              <a href={token.metadata.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" title="Twitter/X" onClick={(e) => e.stopPropagation()}>
                                <i className="fa-brands fa-x-twitter h-5 w-5"></i>
                              </a>
                            )}
                            {token.metadata?.discord && (
                              <a href={token.metadata.discord} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" title="Discord" onClick={(e) => e.stopPropagation()}>
                                <i className="fa-brands fa-discord h-5 w-5"></i>
                              </a>
                            )}
                            {token.metadata?.telegram && (
                              <a href={token.metadata.telegram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary" title="Telegram" onClick={(e) => e.stopPropagation()}>
                                <i className="fa-brands fa-telegram h-5 w-5"></i>
                              </a>
                            )}
                          </div>
                        </div>
                        {/* Description */}
                        <div className="text-sm text-muted-foreground truncate max-w-full font-medium leading-snug">{description}</div>
                        {/* Contract address row */}
                        <div className="flex items-center gap-2 text-xs mt-1">
                          <span className="font-semibold">Address:</span>
                          <span className="font-mono break-all select-all text-primary">
                            {shortAddress(token.address)}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="p-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(token.address);
                              setCopied(token.address);
                              setTimeout(() => setCopied(null), 1200);
                            }}
                            title="Copy address"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          {copied === token.address && <span className="text-green-600 text-xs ml-1">Copied!</span>}
                        </div>
                        {/* Stats row */}
                        <div className="flex justify-between items-center bg-primary/5 rounded-lg px-2 py-1 mt-2 mb-1">
                          <div className="flex flex-col items-center">
                            <span className="text-xs text-muted-foreground">MC</span>
                            <span className="text-lg font-bold text-foreground">${formatNumber(Number(token.marketCap?.usd || 0))}</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-xs text-muted-foreground">Vol</span>
                            <span className="text-lg font-bold text-foreground">{formatNumber(Number(token.timeframes?.["24h"]?.volume || 0) * 1000000)}</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-xs text-muted-foreground">Chg</span>
                            <span className={`text-lg font-bold ${priceChangeColor}`}>{priceChangeNum > 0 ? "+" : ""}{priceChangeNum?.toFixed(2) || "0.00"}%</span>
                          </div>
                        </div>
                        {/* Bonding progress */}
                        <div className="mt-2">
                          <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                            <span>Bonding</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                        {/* Bottom row: time ago, holders */}
                        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <span>🕒</span>
                            <span>{timeAgo(token.creationTimestamp)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span><i className="fa-solid fa-users"></i></span>
                            <span>{token.holderCount || 0} holders</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {/* Pagination controls */}
                <div className="flex justify-center items-center gap-4 mt-8">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
} 