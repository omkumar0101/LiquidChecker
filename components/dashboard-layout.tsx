"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Home, LineChart, Menu, Search, Star, X, Info, LogOut, Zap, PieChart, Clock, Droplet, TrendingUp, Repeat, Users, Twitter, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const routes = [
    {
      name: "Home",
      path: "/",
      icon: Home,
    },
    {
      name: "Watchlist",
      path: "/watchlist",
      icon: Star,
    },
    {
      name: "Compare",
      path: "/compare",
      icon: BarChart3,
    },
    {
      name: "Activity", 
      path: "/activity", 
      icon: Zap 
    },
    { 
      name: "Market Cap", 
      path: "/market-cap", 
      icon: PieChart 
    },
    { 
      name: "Age", 
      path: "/age", 
      icon: Clock 
    },
    { 
      name: "Volume", 
      path: "/volume", 
      icon: Droplet 
    },
    { 
      name: "Change", 
      path: "/change", 
      icon: TrendingUp 
    },
    { 
      name: "Trades", 
      path: "/trades", 
      icon: Repeat 
    },
    { 
      name: "Holders", 
      path: "/holders", 
      icon: Users 
    },
  ]

  const aboutRoute = { name: "About", path: "/about", icon: Info }

  return (
    <div className="flex min-h-screen bg-background w-full">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-[240px] border-r bg-background fixed h-screen">
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="rounded-full bg-primary w-8 h-8 flex items-center justify-center overflow-hidden">
                <img src="/logo.webp" alt="Liquid Checker Logo" className="w-7 h-7 object-cover aspect-square rounded-full" />
              </div>
            <span className="text-lg font-bold">Liquid Checker</span>
          </div>
            </div>
        <nav className="flex-1 py-4">
          <ul className="grid gap-1 px-2">
              {routes.map((route) => (
              <li key={route.path}>
                <Link
                  href={route.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary ${
                    pathname === route.path ? "bg-muted font-medium" : "text-muted-foreground"
                  }`}
                >
                      <route.icon className="h-5 w-5 shrink-0" />
                  {route.name}
                    </Link>
              </li>
              ))}
            <li key={aboutRoute.path}>
              <Link
                href={aboutRoute.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary ${
                  pathname === aboutRoute.path ? "bg-muted font-medium" : "text-muted-foreground"
                }`}
              >
                <aboutRoute.icon className="h-5 w-5 shrink-0" />
                {aboutRoute.name}
              </Link>
            </li>
          </ul>
        </nav>
        <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <span className="text-sm font-medium">LC</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">Guest User</p>
                  <p className="text-xs text-muted-foreground truncate">Local Storage Only</p>
                </div>
              </div>
          </div>
            </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-[240px]">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4">
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] p-0">
                <SheetTitle className="sr-only">Main Navigation</SheetTitle>
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center space-x-2">
                      <div className="rounded-full bg-primary w-8 h-8 flex items-center justify-center overflow-hidden">
                        <img src="/logo.webp" alt="Liquid Checker Logo" className="w-7 h-7 object-cover aspect-square rounded-full" />
                      </div>
                      <span className="text-lg font-bold">Liquid Checker</span>
                    </div>
                  </div>
                  <nav className="flex-1 py-4">
                    <ul className="grid gap-1 px-2">
                      {routes.map((route) => (
                        <li key={route.path}>
                          <Link
                            href={route.path}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary ${
                              pathname === route.path ? "bg-muted font-medium" : "text-muted-foreground"
                            }`}
                          >
                            <route.icon className="h-5 w-5 shrink-0" />
                            {route.name}
                          </Link>
                        </li>
                      ))}
                      <li key={aboutRoute.path}>
                        <Link
                          href={aboutRoute.path}
                          onClick={() => setOpen(false)}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary ${
                            pathname === aboutRoute.path ? "bg-muted font-medium" : "text-muted-foreground"
                          }`}
                        >
                          <aboutRoute.icon className="h-5 w-5 shrink-0" />
                          {aboutRoute.name}
                        </Link>
                      </li>
                    </ul>
                  </nav>
                  <div className="border-t p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <span className="text-sm font-medium">LC</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">Guest User</p>
                          <p className="text-xs text-muted-foreground truncate">Local Storage Only</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Beta Badge */}
          <div className="flex-1 flex justify-center">
            <div className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              Beta
            </div>
          </div>

          {/* Search and Social Links */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 w-[200px]">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search tokens..."
                className="h-8 w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://t.me" target="_blank" rel="noopener noreferrer">
                  <Send className="h-5 w-5" />
                  <span className="sr-only">Telegram</span>
                </a>
              </Button>
            </div>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
  )
}
