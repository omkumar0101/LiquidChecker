import { DashboardLayout } from "@/components/dashboard-layout"
import { WatchlistPage } from "@/components/watchlist-page"

export default function Watchlist() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <WatchlistPage />
      </div>
    </DashboardLayout>
  )
}
