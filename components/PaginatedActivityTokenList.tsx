"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, Copy, Users, Star, Share2 } from "lucide-react"

const PAGE_SIZE = 9

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

export function PaginatedActivityTokenList({ selectedToken }: { selectedToken: string }) {
  const [tokens, setTokens] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [copied, setCopied] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [watchlist, setWatchlist] = useState<string[]>([])

  const fetchTokens = () => {
    setLoading(true)
    setError(null)
    fetch(`https://liquidlaunch.app/api/tokens?page=${page}&limit=${PAGE_SIZE}&search=&sortKey=latestActivity&sortOrder=desc&timeframe=24h&view=in_progress&marketCapMin=0&marketCapMax=1000000&progressMin=0&progressMax=100&filterByHolderCount=false`)
      .then((res) => res.json())
      .then((data) => {
        if (data.tokens) {
          setTokens(data.tokens)
          setTotalPages(data.pagination?.totalPages || 1)
        } else {
          setError("Failed to fetch tokens.")
        }
      })
      .catch(() => setError("Failed to fetch tokens."))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchTokens()
    // Load watchlist from localStorage
    const savedWatchlist = JSON.parse(localStorage.getItem("watchlist") || "[]")
    setWatchlist(savedWatchlist)
    // eslint-disable-next-line
  }, [page, selectedToken])

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

  return (
    <div className="space-y-4 mt-8">
      <Card className="bg-transparent shadow-none border-none">
        <CardContent>
          {loading && <div>Loading tokens...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && !error && (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {tokens.map((token: any) => {
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
          )}
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 