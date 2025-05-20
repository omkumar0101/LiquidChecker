"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts"
import { Copy, ArrowDownIcon, ArrowUpIcon, Coins, TrendingUp, TrendingDown, DollarSign, Star, Share2 } from "lucide-react"
import Image from "next/image"

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2).replace(/\.00$/, "") + "B"
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2).replace(/\.00$/, "") + "M"
  if (num >= 1_000) return (num / 1_000).toFixed(2).replace(/\.00$/, "") + "k"
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

const VolumePage: React.FC = () => {
  const [tokens, setTokens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [watchlist, setWatchlist] = useState<string[]>([])
  const PAGE_SIZE = 18

  useEffect(() => {
    const fetchTokens = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          "https://liquidlaunch.app/api/tokens?page=1&limit=2000&search=&sortKey=volume&sortOrder=desc&timeframe=24h&view=in_progress&marketCapMin=0&marketCapMax=1000000&progressMin=0&progressMax=100&filterByHolderCount=false"
        )
        const data = await response.json()
        setTokens(data.tokens || [])
      } catch (error) {
        setTokens([])
      } finally {
        setLoading(false)
      }
    }
    fetchTokens()
  }, [])

  useEffect(() => {
    // Load watchlist from localStorage
    const savedWatchlist = JSON.parse(localStorage.getItem("watchlist") || "[]")
    setWatchlist(savedWatchlist)
  }, [])

  const toggleWatchlist = (address: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    const newWatchlist = watchlist.includes(address)
      ? watchlist.filter(addr => addr !== address)
      : [...watchlist, address]
    localStorage.setItem("watchlist", JSON.stringify(newWatchlist))
    setWatchlist(newWatchlist)
  }

  const shareToTelegram = (address: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card click
    const url = `https://t.me/share/url?url=${encodeURIComponent(address)}`
    window.open(url, "_blank")
  }

  // Section 1: Token chart data (top 15 by volume)
  const tokenData = tokens.slice(0, 15).map((token: any) => ({
    symbol: token.symbol,
    volume: Number(token.timeframes?.["24h"]?.volume || 0) * 1000000,
    marketCap: Number(token.marketCap?.usd || 0),
    image: token.metadata?.image_uri || "/default-token.png",
    address: token.address
  }))

  // Section 2: Quick stats
  const totalVolume = tokens.reduce((sum: number, t: any) => sum + (Number(t.timeframes?.["24h"]?.volume || 0) * 1000000), 0)
  const topVolumeToken = tokens[0]
  const lowVolumeToken = tokens.length > 0 ? tokens[tokens.length - 1] : null

  // Section 3: Token List
  const totalPages = Math.ceil(tokens.length / PAGE_SIZE)
  const paginatedTokens = tokens.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Find the max volume token for bar image label
  const maxVolume = Math.max(...tokenData.map(t => t.volume));
  const maxVolumeTokenSymbol = tokenData.find(t => t.volume === maxVolume)?.symbol;

  // Custom Bar shape to show logo at the top of each bar, always circular and centered
  const CustomBarWithLogo = (props: any) => {
    const { x, y, width, height, index, payload } = props;
    const entry = payload;
    const logoSize = 36;
    const logoX = x + width / 2 - logoSize / 2;
    const logoY = y - logoSize - 6;
    const clipId = `bar-logo-clip-${index}`;
    return (
      <g>
        <defs>
          <clipPath id={clipId}>
            <circle cx={logoX + logoSize / 2} cy={logoY + logoSize / 2} r={logoSize / 2} />
          </clipPath>
        </defs>
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Section 1: Token Chart */}
        <Card>
          <CardHeader>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight">Volume Distribution</h2>
              <p className="text-muted-foreground">Top 15 tokens by 24h trading volume</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[600px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={tokenData}
                  margin={{ top: 44, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="symbol"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    interval={0}
                  />
                  <YAxis
                    tickFormatter={(value) => `$${formatNumber(value)}`}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-background border rounded-lg p-3 shadow-lg">
                            <p className="font-bold">{data.symbol}</p>
                            <p className="text-primary">Volume: ${formatNumber(data.volume)}</p>
                            <p className="text-primary">Market Cap: ${formatNumber(data.marketCap)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="volume" shape={CustomBarWithLogo} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Quick Stats */}
        <Card>
          <CardHeader>
            <div className="space-y-1">
              <h2 className="text-3xl font-bold tracking-tight">Quick Stats</h2>
              <p className="text-muted-foreground">Key volume indicators at a glance</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="card-hover glass-effect">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tokens Tracked</CardTitle>
                  <Coins className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    {tokens.length.toLocaleString()}
                  </div>
                  <p className="text-sm text-muted-foreground">Active tokens in the market</p>
                </CardContent>
              </Card>
              <Card className="card-hover glass-effect">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                  <DollarSign className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    ${formatNumber(totalVolume)}
                  </div>
                  <p className="text-sm text-muted-foreground">24h trading volume</p>
                </CardContent>
              </Card>
              <Card className="card-hover glass-effect">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Top Volume</CardTitle>
                  <TrendingUp className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    {topVolumeToken?.symbol || "N/A"}
                  </div>
                  <p className="text-sm text-green-500 flex items-center">
                    <ArrowUpIcon className="mr-1 h-4 w-4" />
                    ${formatNumber(Number(topVolumeToken?.timeframes?.["24h"]?.volume || 0) * 1000000)}
                  </p>
                </CardContent>
              </Card>
              <Card className="card-hover glass-effect">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Low Volume</CardTitle>
                  <TrendingDown className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                    {lowVolumeToken?.symbol || "N/A"}
                  </div>
                  <p className="text-sm text-red-500 flex items-center">
                    <ArrowDownIcon className="mr-1 h-4 w-4" />
                    ${formatNumber(Number(lowVolumeToken?.timeframes?.["24h"]?.volume || 0) * 1000000)}
                  </p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Token List */}
        <Card>
          <CardHeader>
            <div className="text-lg font-bold">All Tokens (by Volume)</div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading...</div>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {paginatedTokens.map((token) => {
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
                              <img src={token.metadata.image_uri} alt={token.symbol} className="w-10 h-10 rounded-full object-cover border border-primary/30" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg font-bold border border-primary/30">{token.symbol?.slice(0,2)}</div>
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
                            <span className="text-xs text-muted-foreground">Vol</span>
                            <span className="text-lg font-bold text-foreground">${formatNumber(Number(token.timeframes?.["24h"]?.volume || 0) * 1000000)}</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="text-xs text-muted-foreground">MC</span>
                            <span className="text-lg font-bold text-foreground">${formatNumber(Number(token.marketCap?.usd || 0))}</span>
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
                        {/* Bottom row: time ago, holders, watchlist, share */}
                        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <span>🕒</span>
                            <span>{timeAgo(token.creationTimestamp)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`p-1 ${watchlist.includes(token.address) ? "text-yellow-500" : ""}`}
                              onClick={(e) => toggleWatchlist(token.address, e)}
                              title={watchlist.includes(token.address) ? "Remove from watchlist" : "Add to watchlist"}
                            >
                              <Star className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="p-1"
                              onClick={(e) => shareToTelegram(token.address, e)}
                              title="Share to Telegram"
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center gap-1">
                              <span><i className="fa-solid fa-users"></i></span>
                              <span>{token.holderCount || 0} holders</span>
                            </div>
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

export default VolumePage 