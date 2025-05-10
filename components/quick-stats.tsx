import { ArrowDownIcon, ArrowUpIcon, Coins, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function QuickStats() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Quick Stats</h2>
          <p className="text-muted-foreground">Key market indicators at a glance</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover glass-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tokens Tracked</CardTitle>
            <Coins className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              1,234
            </div>
            <p className="text-sm text-muted-foreground flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              +56 from last week
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover glass-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              $2.4T
            </div>
            <p className="text-sm text-muted-foreground flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              +2.5% from yesterday
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover glass-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Gainer</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              SOL
            </div>
            <p className="text-sm text-green-500 flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4" />
              +12.5% in 24h
            </p>
          </CardContent>
        </Card>
        <Card className="card-hover glass-effect">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Loser</CardTitle>
            <TrendingDown className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              DOGE
            </div>
            <p className="text-sm text-red-500 flex items-center">
              <ArrowDownIcon className="mr-1 h-4 w-4" />
              -8.2% in 24h
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
