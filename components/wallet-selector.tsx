"use client"

import { useWeb3Modal } from "@web3modal/ethers/react"
import { useWeb3ModalAccount } from "@web3modal/ethers/react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Wallet, ChevronDown, Check } from 'lucide-react'

export function WalletSelector() {
  const { open } = useWeb3Modal()
  const { address, isConnected } = useWeb3ModalAccount()

  const displayAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-400" />
            Celo
            <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem className="cursor-default py-2 px-3">
            <div className="flex items-center gap-2 w-full">
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="text-sm">Celo</span>
              <Check size={14} className="ml-auto text-primary" />
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Wallet Connect Button */}
      <Button onClick={() => open()} variant={isConnected ? "outline" : "default"} className="gap-2">
        <Wallet size={18} />
        {isConnected ? displayAddress : "Connect Wallet"}
      </Button>
    </div>
  )
}
