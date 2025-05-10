"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Home, LineChart, Menu, Search, Star, X, Info, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

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
      name: "Dashboard",
      path: "/dashboard",
      icon: LineChart,
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
      name: "About",
      path: "/about",
      icon: Info,
    },
  ]

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex" collapsible="icon">
          <SidebarHeader className="flex items-center px-4 py-2">
            <div className="flex items-center space-x-2">
              <div className="rounded-full bg-primary w-8 h-8 flex items-center justify-center">
                <LineChart className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold whitespace-nowrap hidden md:inline group-data-[state=expanded]/sidebar-wrapper:inline group-data-[state=collapsed]/sidebar-wrapper:hidden">Hyper Dash</span>
            </div>
            <SidebarTrigger className="ml-auto" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {routes.map((route) => (
                <SidebarMenuItem key={route.path}>
                  <SidebarMenuButton asChild isActive={pathname === route.path}>
                    <Link href={route.path} className="flex items-center gap-2">
                      <route.icon className="h-5 w-5 shrink-0" />
                      <span className="truncate">{route.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            {/* Analytics group from image */}
            <div className="mt-6">
              <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Analytics</div>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/analytics/activity"} className="flex items-center gap-2">
                    <Link href="/analytics/activity"><span>⚡</span><span>Activity</span></Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/analytics/market-cap"} className="flex items-center gap-2">
                    <Link href="/analytics/market-cap">Market Cap</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/analytics/age"} className="flex items-center gap-2">
                    <Link href="/analytics/age">Age</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/analytics/volume"} className="flex items-center gap-2">
                    <Link href="/analytics/volume">Volume</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/analytics/change"} className="flex items-center gap-2">
                    <Link href="/analytics/change">Change</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/analytics/trades"} className="flex items-center gap-2">
                    <Link href="/analytics/trades">Trades</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={pathname === "/analytics/holders"} className="flex items-center gap-2">
                    <Link href="/analytics/holders">Holders</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <span className="text-sm font-medium">HD</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">Guest User</p>
                  <p className="text-xs text-muted-foreground truncate">Local Storage Only</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="shrink-0">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Mobile Header */}
        <div className="flex flex-col w-full">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] p-0">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center space-x-2">
                      <div className="rounded-full bg-primary w-8 h-8 flex items-center justify-center">
                        <LineChart className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <span className="text-lg font-bold">Hyper Dash</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <nav className="flex-1 overflow-auto py-4">
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
                    </ul>
                  </nav>
                  <div className="border-t p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                          <span className="text-sm font-medium">HD</span>
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
            <div className="flex items-center gap-2">
              <LineChart className="h-6 w-6" />
              <span className="font-bold text-lg">Hyper Dash</span>
            </div>
            <div className="flex items-center ml-auto">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
