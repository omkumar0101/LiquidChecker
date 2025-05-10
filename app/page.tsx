import { DashboardLayout } from "@/components/dashboard-layout"
import { HeroSection } from "@/components/hero-section"
import { SearchBar } from "@/components/search-bar"
import { TrendingTokens } from "@/components/trending-tokens"
import { QuickStats } from "@/components/quick-stats"

export default function Home() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <HeroSection />
        <div className="mt-8">
          <SearchBar />
        </div>
        <div className="mt-12">
          <QuickStats />
        </div>
        <div className="mt-12">
          <TrendingTokens />
        </div>
      </div>
    </DashboardLayout>
  )
}
