"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, X, Copy, Star, StarOff } from "lucide-react"

const PAGE_SIZE = 10
const REFRESH_INTERVAL = 600000 // 10 minutes in ms

function copyToClipboard(text: string, setCopied: (v: boolean) => void) {
  navigator.clipboard.writeText(text)
  setCopied(true)
  setTimeout(() => setCopied(false), 1200)
}

function getWatchlist(): string[] {
  if (typeof window === "undefined") return []
  try {
    return JSON.parse(localStorage.getItem("tokenWatchlist") || "[]")
  } catch {
    return []
  }
}

function setWatchlist(list: string[]) {
  localStorage.setItem("tokenWatchlist", JSON.stringify(list))
}

function formatNumber(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(2).replace(/\.00$/, "") + "B"
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(2).replace(/\.00$/, "") + "M"
  if (num >= 1_000) return (num / 1_000).toFixed(2).replace(/\.00$/, "") + "k"
  return num.toLocaleString()
}

function shortAddress(addr: string): string {
  if (!addr) return ""
  return addr.slice(0, 4) + "..." + addr.slice(-4)
}

export function PaginatedTokenList() {
  const [tokens, setTokens] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [copied, setCopied] = useState<string | null>(null)
  const [watchlist, setWatchlistState] = useState<string[]>(getWatchlist())

  const fetchTokens = () => {
    setLoading(true)
    setError(null)
    fetch("https://api.liqd.ag/tokens")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.tokens) {
          // Sort by address descending (latest first)
          const sorted = [...data.data.tokens].sort((a, b) => b.address.localeCompare(a.address))
          setTokens(sorted)
        } else {
          setError("Failed to fetch tokens.")
        }
      })
      .catch(() => setError("Failed to fetch tokens."))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchTokens()
    const interval = setInterval(fetchTokens, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  // Sync watchlist with localStorage
  useEffect(() => {
    setWatchlist(watchlist)
  }, [watchlist])

  const handleWatchlist = (address: string) => {
    setWatchlistState((prev) => {
      if (prev.includes(address)) {
        return prev.filter((a) => a !== address)
      } else {
        return [...prev, address]
      }
    })
  }

  const totalPages = Math.ceil(tokens.length / PAGE_SIZE)
  const paginatedTokens = tokens.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-4 mt-8">
      <Card>
        <CardHeader>
          <CardTitle>All Tokens <span className="text-muted-foreground text-sm">({tokens.length} total)</span></CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <div>Loading tokens...</div>}
          {error && <div className="text-red-500">{error}</div>}
          {!loading && !error && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {paginatedTokens.map((token) => {
                const isWatched = watchlist.includes(token.address)
                return (
                  <Card key={token.address} className="border-none shadow-lg bg-gradient-to-br from-background via-primary/5 to-primary/10 rounded-xl hover:scale-[1.025] transition-transform flex flex-col justify-between h-full">
                    <CardHeader className="pb-2 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold tracking-tight text-primary flex items-center gap-2">{token.symbol}</span>
                        <Button
                          variant={isWatched ? "default" : "outline"}
                          size="icon"
                          className="ml-2"
                          onClick={() => handleWatchlist(token.address)}
                          title={isWatched ? "Remove from Watchlist" : "Add to Watchlist"}
                        >
                          {isWatched ? <Star className="fill-primary text-primary-foreground" /> : <StarOff />}
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-semibold truncate">{token.name}</span>
                        {token.isERC20Verified ? (
                          <Check className="text-green-500 h-5 w-5" />
                        ) : (
                          <X className="text-red-400 h-5 w-5" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3 pt-0 flex-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-semibold">Address:</span>
                        <span className="font-mono break-all select-all">{shortAddress(token.address)}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="p-1"
                          onClick={() => copyToClipboard(token.address, (v) => setCopied(v ? token.address : null))}
                          title="Copy address"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        {copied === token.address && <span className="text-green-600 text-xs ml-1">Copied!</span>}
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="bg-primary/10 rounded px-2 py-1 font-semibold">Decimals: {token.decimals}</span>
                        <span className="bg-primary/10 rounded px-2 py-1 font-semibold">Total Transfers: {formatNumber(token.totalTransfers)}</span>
                        <span className="bg-primary/10 rounded px-2 py-1 font-semibold">24h Transfers: {formatNumber(token.transfers24h)}</span>
                      </div>
                    </CardContent>
                  </Card>
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