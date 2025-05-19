import { DashboardLayout } from "@/components/dashboard-layout"

export default function About() {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">About Liquid Checker</h1>
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">What is Liquid Checker?</h2>
            <p className="text-muted-foreground">
              Liquid Checker is a powerful, user-friendly cryptocurrency dashboard that allows you to track, analyze, and
              compare tokens listed on LiquidLaunch. Our platform provides real-time price data, historical charts, and
              essential metrics to help you make informed decisions about your crypto investments.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">How it Works</h2>
            <p className="text-muted-foreground mb-4">
              Liquid Checker is entirely API-based, pulling data directly from LiquidLaunch and other trusted sources. We
              don't store any of your personal data or trading information on our servers.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>All token data is fetched in real-time from our API partners</li>
              <li>Your watchlist is stored locally in your browser</li>
              <li>Alerts are processed client-side for maximum privacy</li>
              <li>No account creation or personal information required</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-3">Privacy & Terms</h2>
            <p className="text-muted-foreground mb-4">
              At Liquid Checker, we take your privacy seriously. Since we don't collect or store any personal data, you can
              use our platform with complete confidence.
            </p>
            <p className="text-muted-foreground">
              The information provided on Liquid Checker is for informational purposes only and should not be considered
              financial advice. Always do your own research before making investment decisions.
            </p>
          </section>
        </div>
      </div>
    </DashboardLayout>
  )
}
