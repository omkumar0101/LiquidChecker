import { DashboardLayout } from "@/components/dashboard-layout"
import { TokenDetails } from "@/components/token-details"

export default function TokenPage({ params }: { params: { id: string } }) {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <TokenDetails id={params.id} />
      </div>
    </DashboardLayout>
  )
}
