import type React from "react"
import type { Metadata } from "next"
import { Inter, Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Hyper Dash - Cryptocurrency Dashboard",
  description: "Track, analyze, and compare cryptocurrency tokens in real-time",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          integrity="sha512-..."
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 animate-gradient">
            <div className="relative">
              {/* Background decoration */}
              <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl" />
              </div>
              
              {/* Main content */}
              <main className="relative">
          {children}
              </main>
            </div>
          <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
