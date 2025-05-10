"use client"

import React, { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { PaginatedActivityTokenList } from "@/components/PaginatedActivityTokenList"

const mockChartData = [
  { date: "Jan", price: 42000 },
  { date: "Feb", price: 47000 },
  { date: "Mar", price: 53000 },
  { date: "Apr", price: 58000 },
  { date: "May", price: 51000 },
  { date: "Jun", price: 59000 },
  { date: "Jul", price: 62000 },
  { date: "Aug", price: 65432 },
]

export default function ActivityAnalyticsPage() {
  const [selectedToken, setSelectedToken] = useState("all")

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Graph Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Token Activity (24h)</CardTitle>
            <Select value={selectedToken} onValueChange={setSelectedToken}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by token" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tokens</SelectItem>
                {/* You can map real token symbols here if needed */}
                <SelectItem value="BTC">BTC</SelectItem>
                <SelectItem value="ETH">ETH</SelectItem>
                <SelectItem value="SOL">SOL</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value.toLocaleString()}`} />
                  <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        {/* Token Data Cards */}
        <PaginatedActivityTokenList selectedToken={selectedToken} />
      </div>
    </DashboardLayout>
  )
} 