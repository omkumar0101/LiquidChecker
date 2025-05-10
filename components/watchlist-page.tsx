"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpIcon, ArrowDownIcon, Star, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ChartContainer } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer } from "recharts"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for watchlist tokens
const mockWatchlistTokens = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    price: 65432.1,
    change: 2.5,
    chartData: [
      { date: "Mon", price: 63000 },
      { date: "Tue", price: 64000 },
      { date: "Wed", price: 63500 },
      { date: "Thu", price: 64500 },
      { date: "Fri", price: 65432 },
    ],
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    price: 3456.78,
    change: 1.8,
    chartData: [
      { date: "Mon", price: 3300 },
      { date: "Tue", price: 3350 },
      { date: "Wed", price: 3400 },
      { date: "Thu", price: 3420 },
      { date: "Fri", price: 3456 },
    ],
  },
  {
    id: "solana",
    name: "Solana",
    symbol: "SOL",
    price: 123.45,
    change: 12.5,
    chartData: [
      { date: "Mon", price: 110 },
      { date: "Tue", price: 115 },
      { date: "Wed", price: 118 },
      { date: "Thu", price: 120 },
      { date: "Fri", price: 123 },
    ],
  },
]

export function WatchlistPage() {
  const [watchlist, setWatchlist] = useState(mockWatchlistTokens)
  const [selectedToken, setSelectedToken] = useState<any>(null)
  const { toast } = useToast()

  const handleRemoveFromWatchlist = (id: string) => {
    setWatchlist(watchlist.filter((token) => token.id !== id))
    toast({
      title: "Removed from watchlist",
      description: `${watchlist.find((token) => token.id === id)?.name} has been removed from your watchlist.`,
    })
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Watchlist</h1>
          <p className="text-muted-foreground mt-1">Track your favorite tokens in one place</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Set Alert</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Price Alert</DialogTitle>
              <DialogDescription>Get notified when a token reaches a certain price.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="token">Token</Label>
                <Select>
                  <SelectTrigger id="token">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    {watchlist.map((token) => (
                      <SelectItem key={token.id} value={token.id}>
                        {token.name} ({token.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="condition">Condition</Label>
                <Select defaultValue="above">
                  <SelectTrigger id="condition">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="above">Price goes above</SelectItem>
                    <SelectItem value="below">Price goes below</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price (USD)</Label>
                <Input id="price" type="number" placeholder="0.00" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Alert</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {watchlist.length === 0 ? (
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your watchlist is empty</h3>
            <p className="text-muted-foreground mb-6">
              Add tokens to your watchlist to track their performance and set price alerts.
            </p>
            <Link href="/dashboard">
              <Button>Explore Tokens</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {watchlist.map((token) => (
            <Card key={token.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/20 mr-2 flex items-center justify-center">
                    {token.symbol.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-md font-medium">{token.name}</CardTitle>
                    <CardDescription>{token.symbol}</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleRemoveFromWatchlist(token.id)}>
                  <Star className="h-4 w-4 fill-primary" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-2xl font-bold">${token.price.toLocaleString()}</div>
                  <p className={`text-xs flex items-center ${token.change > 0 ? "text-green-500" : "text-red-500"}`}>
                    {token.change > 0 ? (
                      <ArrowUpIcon className="mr-1 h-3 w-3" />
                    ) : (
                      <ArrowDownIcon className="mr-1 h-3 w-3" />
                    )}
                    {Math.abs(token.change)}% in 24h
                  </p>
                </div>
                <div className="h-[100px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ChartContainer>
                      <AreaChart data={token.chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <defs>
                          <linearGradient id={`color${token.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke="hsl(var(--primary))"
                          fillOpacity={1}
                          fill={`url(#color${token.id})`}
                        />
                      </AreaChart>
                    </ChartContainer>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex justify-between">
                  <Link href={`/tokens/${token.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">Set Alert</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Price Alert for {token.name}</DialogTitle>
                        <DialogDescription>Get notified when {token.symbol} reaches a certain price.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="condition">Condition</Label>
                          <Select defaultValue="above">
                            <SelectTrigger id="condition">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="above">Price goes above</SelectItem>
                              <SelectItem value="below">Price goes below</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="price">Price (USD)</Label>
                          <Input id="price" type="number" placeholder="0.00" defaultValue={token.price.toFixed(2)} />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Create Alert</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
