import { DashboardLayout } from "@/components/dashboard-layout"
import { TokenDashboard } from "@/components/token-dashboard"

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <TokenDashboard />
      </div>
    </DashboardLayout>
  )
}
