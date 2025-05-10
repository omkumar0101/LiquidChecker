import { ArrowRight, TrendingUp, BarChart3, LineChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-background via-background to-primary/5 p-6 md:p-10 glass-effect">
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <TrendingUp className="mr-2 h-4 w-4" />
              Real-time Crypto Analytics
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Track Crypto Tokens with Precision
            </h1>
            <p className="text-lg text-muted-foreground md:text-xl">
              Real-time data, powerful charts, and insightful analytics for cryptocurrency traders and enthusiasts.
            </p>
          </div>
          <div className="flex flex-col gap-3 min-[400px]:flex-row">
            <Link href="/dashboard">
              <Button size="lg" className="gap-2 hover-scale">
                Explore Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="hover-scale">
                Learn More
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <span>Advanced Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <LineChart className="h-4 w-4 text-primary" />
              <span>Real-time Charts</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <div className="relative h-[300px] w-full md:h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 rounded-2xl flex items-center justify-center animate-gradient">
              <div className="relative w-4/5 h-4/5 bg-black/40 backdrop-blur-sm rounded-xl border border-white/10 shadow-2xl flex items-center justify-center card-hover">
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="w-4/5 h-4/5 flex flex-col space-y-4">
                  <div className="h-1/2 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg animate-pulse"></div>
                  <div className="grid grid-cols-2 gap-4 h-1/4">
                    <div className="bg-gradient-to-r from-secondary/20 to-secondary/10 rounded-lg animate-pulse delay-100"></div>
                    <div className="bg-gradient-to-r from-secondary/20 to-secondary/10 rounded-lg animate-pulse delay-200"></div>
                  </div>
                  <div className="h-1/4 bg-gradient-to-r from-muted/30 to-muted/20 rounded-lg animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
