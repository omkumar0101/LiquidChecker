"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

// Mock data for search results
const mockTokens = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "solana", name: "Solana", symbol: "SOL" },
  { id: "cardano", name: "Cardano", symbol: "ADA" },
  { id: "polkadot", name: "Polkadot", symbol: "DOT" },
]

export function SearchBar() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleSelect = (id: string) => {
    setOpen(false)
    router.push(`/tokens/${id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Search Tokens</h2>
          <p className="text-muted-foreground">Find and analyze any cryptocurrency</p>
        </div>
        <Coins className="h-6 w-6 text-primary" />
      </div>
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="relative w-full justify-start text-muted-foreground h-14 px-4 glass-effect hover-scale"
        >
          <Search className="mr-2 h-5 w-5 text-primary" />
          <span className="text-base">Search for any token...</span>
        </Button>
      </div>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for any token..." className="h-12" />
        <CommandList>
          <CommandEmpty className="py-6 text-center text-muted-foreground">
            No tokens found. Try a different search term.
          </CommandEmpty>
          <CommandGroup heading="Popular Tokens">
            {mockTokens.map((token) => (
              <CommandItem
                key={token.id}
                onSelect={() => handleSelect(token.id)}
                className="flex items-center gap-2 p-2 cursor-pointer hover:bg-primary/5"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">{token.symbol.charAt(0)}</span>
                  </div>
                <div className="flex flex-col">
                  <span className="font-medium">{token.name}</span>
                  <span className="text-sm text-muted-foreground">{token.symbol}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  )
}
