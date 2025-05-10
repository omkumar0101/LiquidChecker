import { DashboardLayout } from "@/components/dashboard-layout"
import { CompareTokens } from "@/components/compare-tokens"

export default function Compare() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <CompareTokens />
      </div>
    </DashboardLayout>
  )
}
