"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { HeroSection } from "@/components/hero-section"
import { TrendingTokens } from "@/components/trending-tokens"
import { QuickStats } from "@/components/quick-stats"

interface Token {
  symbol: string
  marketCap: { usd: string }
  timeframes: {
    "24h": {
      priceChange: string
    }
  }
}

export default function Home() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(
          "https://liquidlaunch.app/api/tokens?page=1&limit=1000&search=&sortKey=latestActivity&sortOrder=desc&timeframe=24h&view=in_progress&marketCapMin=0&marketCapMax=1000000&progressMin=0&progressMax=100&filterByHolderCount=false"
        )
        const data = await response.json()
        setTokens(data.tokens)
      } catch (error) {
        console.error("Error fetching tokens:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTokens()
  }, [])

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <HeroSection />
        <div className="mt-12">
          {!loading && <QuickStats tokens={tokens} />}
        </div>
        <div className="mt-12">
          <TrendingTokens />
        </div>
      </div>
    </DashboardLayout>
  )
}
