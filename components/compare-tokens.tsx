"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowUpIcon, ArrowDownIcon, Plus, X, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from "recharts"

interface Token {
  address: string
  name: string
  symbol: string
  marketCap: { usd: string }
  price: { usd: string }
  liquidity: { usd: string }
  metadata: {
    image_uri: string
    description?: string
    twitter?: string
    telegram?: string
    discord?: string
    website?: string
  }
  timeframes: {
    "24h": {
      priceChange: string
      volume?: string
      buys?: string
      sells?: string
    }
  }
  holderCount?: string
  totalTrades?: string
  progress?: string
}

// Fetch detailed token data
const fetchTokenData = async (address: string) => {
  try {
    const response = await fetch(`https://liquidlaunch.app/api/tokens/${address}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error fetching token data for ${address}:`, error)
    return null
  }
}

// Generate histogram data for token comparison
const generateHistogramData = (token1: Token, token2: Token) => {
  // Token 1 calculations
  const marketCap1 = Number(token1.marketCap?.usd || 0)
  const rawVolume1 = Number(token1.timeframes?.["24h"]?.volume || 0)
  const volume1 = rawVolume1 * 1000000 // Convert to millions
  const liquidity1 = Number(token1.liquidity?.usd || 0)
  const priceChange1 = Number(token1.timeframes?.["24h"]?.priceChange || 0)
  const buys1 = Number(token1.timeframes?.["24h"]?.buys || 0);
  const sells1 = Number(token1.timeframes?.["24h"]?.sells || 0);
  const totalTrades1 = buys1 + sells1;
  
  // Token 2 calculations
  const marketCap2 = Number(token2.marketCap?.usd || 0)
  const rawVolume2 = Number(token2.timeframes?.["24h"]?.volume || 0)
  const volume2 = rawVolume2 * 1000000 // Convert to millions
  const liquidity2 = Number(token2.liquidity?.usd || 0)
  const priceChange2 = Number(token2.timeframes?.["24h"]?.priceChange || 0)
  const buys2 = Number(token2.timeframes?.["24h"]?.buys || 0);
  const sells2 = Number(token2.timeframes?.["24h"]?.sells || 0);
  const totalTrades2 = buys2 + sells2;

  return [
    {
      name: "Market Cap",
      [token1.symbol]: marketCap1,
      [token2.symbol]: marketCap2,
    },
    {
      name: "Volume (24h)",
      [token1.symbol]: volume1,
      [token2.symbol]: volume2,
    },
    {
      name: "Liquidity (USD)",
      [token1.symbol]: liquidity1,
      [token2.symbol]: liquidity2,
    },
    {
      name: "Price Change (24h)",
      [token1.symbol]: priceChange1,
      [token2.symbol]: priceChange2,
    },
    {
      name: "Total Trades (24h)",
      [token1.symbol]: totalTrades1,
      [token2.symbol]: totalTrades2,
    },
  ]
}

export function CompareTokens() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [selectedTokens, setSelectedTokens] = useState<Token[]>([])
  const [timeframe, setTimeframe] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('timeframe') || "1m"
    }
    return "1m"
  })
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load selected tokens from localStorage on component mount
  useEffect(() => {
    const savedTokens = localStorage.getItem('selectedTokens')
    if (savedTokens) {
      try {
        const parsedTokens = JSON.parse(savedTokens)
        setSelectedTokens(parsedTokens)
      } catch (error) {
        console.error('Error parsing saved tokens:', error)
        localStorage.removeItem('selectedTokens')
      }
    }
  }, [])

  // Save selected tokens to localStorage whenever they change
  useEffect(() => {
    if (selectedTokens.length > 0) {
      localStorage.setItem('selectedTokens', JSON.stringify(selectedTokens))
    } else {
      localStorage.removeItem('selectedTokens')
    }
  }, [selectedTokens])

  // Save timeframe to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('timeframe', timeframe)
  }, [timeframe])

  // Fetch detailed data for selected tokens
  useEffect(() => {
    const fetchDetailedData = async () => {
      if (selectedTokens.length === 2) {
        setLoading(true)
        try {
          const [token1Data, token2Data] = await Promise.all([
            fetchTokenData(selectedTokens[0].address),
            fetchTokenData(selectedTokens[1].address)
          ])

          if (token1Data && token2Data) {
            setSelectedTokens([
              { ...selectedTokens[0], ...token1Data },
              { ...selectedTokens[1], ...token2Data }
            ])
          }
        } catch (error) {
          console.error('Error fetching detailed token data:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchDetailedData()
  }, [selectedTokens.length])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchTokens = async () => {
      if (!searchQuery.trim()) {
        setTokens([])
        return
      }

      setLoading(true)
      try {
        const response = await fetch(
          `https://liquidlaunch.app/api/tokens/search?q=${encodeURIComponent(searchQuery)}`
        )
        const data = await response.json()
        const tokensData = Array.isArray(data) ? data : data.tokens || []
        setTokens(tokensData)
        setSelectedIndex(-1)
      } catch (error) {
        console.error("Error fetching tokens:", error)
        setTokens([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      fetchTokens()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults) return

    const filteredTokens = tokens.filter((token) => !selectedTokens.some((t) => t.address === token.address))

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < filteredTokens.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < filteredTokens.length) {
          handleAddToken(filteredTokens[selectedIndex])
        }
        break
      case "Escape":
        e.preventDefault()
        setShowResults(false)
        break
    }
  }

  const handleAddToken = (token: Token) => {
    if (selectedTokens.length < 3 && !selectedTokens.some((t) => t.address === token.address)) {
      const newSelectedTokens = [...selectedTokens, token]
      setSelectedTokens(newSelectedTokens)
      setSearchQuery("")
      setShowResults(false)
      setSelectedIndex(-1)
      inputRef.current?.focus()
    }
  }

  const handleRemoveToken = (address: string) => {
    const newSelectedTokens = selectedTokens.filter((token) => token.address !== address)
    setSelectedTokens(newSelectedTokens)
  }

  const formatNumber = (num: number): string => {
    // Convert scientific notation to regular number
    const regularNum = Number(num.toExponential(2))
    
    if (regularNum >= 1_000_000_000) return (regularNum / 1_000_000_000).toFixed(2).replace(/\.00$/, "") + "B"
    if (regularNum >= 1_000_000) return (regularNum / 1_000_000).toFixed(2).replace(/\.00$/, "") + "M"
    if (regularNum >= 1_000) return (regularNum / 1_000).toFixed(2).replace(/\.00$/, "") + "k"
    return regularNum.toLocaleString()
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium mb-1">{label}</p>
          {payload.map((entry: any, index: number) => {
            let value = entry.value;
            let formattedValue = value;
            
            if (label === "Total Trades (24h)") {
              formattedValue = value.toLocaleString();
            } else if (label === "Price Change (24h)") {
              formattedValue = `${value}%`;
            } else {
              formattedValue = formatNumber(value);
            }
            
            return (
              <p key={index} className="text-sm" style={{ color: entry.color }}>
                {entry.name}: {formattedValue}
              </p>
            );
          })}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Compare Tokens</h1>
        <p className="text-muted-foreground mt-1">Compare performance and metrics side by side</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="w-full md:w-64 relative" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setShowResults(true)
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setShowResults(true)}
              className="pl-8"
            />
          </div>
          {showResults && searchQuery && (
            <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-auto">
              {loading ? (
                <div className="p-4 text-center text-sm text-muted-foreground">Searching...</div>
              ) : tokens.length > 0 ? (
                tokens
                  .filter((token) => !selectedTokens.some((t) => t.address === token.address))
                  .map((token, index) => (
                    <button
                      key={token.address}
                      className={`w-full px-4 py-2 text-left hover:bg-muted flex items-center gap-2 ${
                        index === selectedIndex ? "bg-muted" : ""
                      }`}
                      onClick={() => handleAddToken(token)}
                    >
                      {token.metadata?.image_uri ? (
                        <img src={token.metadata.image_uri} alt={token.symbol} className="w-6 h-6 rounded-full" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs">
                          {token.symbol.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{token.name}</div>
                        <div className="text-sm text-muted-foreground">{token.symbol}</div>
                      </div>
                    </button>
                  ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">No tokens found</div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedTokens.map((token) => (
            <div key={token.address} className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
              {token.metadata?.image_uri ? (
                <img src={token.metadata.image_uri} alt={token.symbol} className="w-4 h-4 rounded-full" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[10px]">
                  {token.symbol.charAt(0)}
                </div>
              )}
              <span className="text-sm font-medium">{token.symbol}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-full"
                onClick={() => handleRemoveToken(token.address)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}

          {selectedTokens.length === 0 && <div className="text-sm text-muted-foreground">Select tokens to compare</div>}
        </div>

        <div className="ml-auto">
          <Tabs value={timeframe} onValueChange={setTimeframe}>
            <TabsList>
              <TabsTrigger value="1d">1D</TabsTrigger>
              <TabsTrigger value="1w">1W</TabsTrigger>
              <TabsTrigger value="1m">1M</TabsTrigger>
              <TabsTrigger value="1y">1Y</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {loading ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground mt-4">Loading token data...</p>
          </div>
        </Card>
      ) : selectedTokens.length === 2 ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Token Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[600px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={generateHistogramData(selectedTokens[0], selectedTokens[1])}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    barGap={0}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      interval={0}
                    />
                    <YAxis 
                      tickFormatter={(value) => {
                        if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`
                        if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
                        if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`
                        return value.toString()
                      }}
                      domain={[0, 'auto']}
                      allowDecimals={false}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      dataKey={selectedTokens[0].symbol}
                      fill="#8884d8"
                      radius={[4, 4, 0, 0]}
                      name={selectedTokens[0].symbol}
                    >
                      {generateHistogramData(selectedTokens[0], selectedTokens[1]).map((entry, index) => (
                        <Label
                          key={`label-${index}`}
                          content={({ x, y, width, value }) => {
                            if (typeof value === 'undefined') return null;
                            const formattedValue = entry.name === "Total Trades (24h)" 
                              ? value.toLocaleString()
                              : entry.name === "Price Change (24h)"
                              ? `${value}%`
                              : formatNumber(Number(value));
                            return (
                              <text
                                x={Number(x) + Number(width) / 2}
                                y={Number(y) - 10}
                                fill="#8884d8"
                                textAnchor="middle"
                                fontSize={12}
                              >
                                {formattedValue}
                              </text>
                            );
                          }}
                        />
                      ))}
                    </Bar>
                    <Bar
                      dataKey={selectedTokens[1].symbol}
                      fill="#82ca9d"
                      radius={[4, 4, 0, 0]}
                      name={selectedTokens[1].symbol}
                    >
                      {generateHistogramData(selectedTokens[0], selectedTokens[1]).map((entry, index) => (
                        <Label
                          key={`label-${index}`}
                          content={({ x, y, width, value }) => {
                            if (typeof value === 'undefined') return null;
                            const formattedValue = entry.name === "Total Trades (24h)"
                              ? value.toLocaleString()
                              : entry.name === "Price Change (24h)"
                              ? `${value}%`
                              : formatNumber(Number(value));
                            return (
                              <text
                                x={Number(x) + Number(width) / 2}
                                y={Number(y) - 10}
                                fill="#82ca9d"
                                textAnchor="middle"
                                fontSize={12}
                              >
                                {formattedValue}
                              </text>
                            );
                          }}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Section: Token Metadata and Social Links */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Token Social Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedTokens.map((token) => {
                  // Social links extraction (adjust keys if your API is different)
                  const socials = [
                    { key: 'twitter', label: 'Twitter', icon: '🐦', url: token.metadata?.twitter },
                    { key: 'telegram', label: 'Telegram', icon: '✈️', url: token.metadata?.telegram },
                    { key: 'discord', label: 'Discord', icon: '💬', url: token.metadata?.discord },
                    { key: 'website', label: 'Website', icon: '🌐', url: token.metadata?.website },
                  ];
                  const presentSocials = socials.filter(s => s.url);
                  const totalPoints = presentSocials.length;
                  return (
                    <div key={token.address} className="flex flex-col items-center gap-3 border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {token.metadata?.image_uri && (
                          <img src={token.metadata.image_uri} alt={token.symbol} className="w-8 h-8 rounded-full" />
                        )}
                        <span className="font-bold text-lg">{token.symbol}</span>
                        <span className="text-muted-foreground">{token.name}</span>
                      </div>
                      <div className="flex gap-2 flex-wrap mb-2">
                        {presentSocials.map(social => (
                          <a
                            key={social.key}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded hover:bg-primary/10 border border-border text-sm font-medium transition"
                          >
                            <span>{social.icon}</span> {social.label}
                          </a>
                        ))}
                      </div>
                      <div className="text-sm font-semibold">
                        Total Points: <span className="text-primary">{totalPoints}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      ) : selectedTokens.length > 0 ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-semibold mb-2">Select Two Tokens</h3>
            <p className="text-muted-foreground mb-6">
              Please select exactly two tokens to compare their metrics side by side.
            </p>
          </div>
        </Card>
      ) : (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <Plus className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Add tokens to compare</h3>
            <p className="text-muted-foreground mb-6">
              Select two tokens to compare their performance and metrics side by side.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}
