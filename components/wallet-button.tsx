"use client"

import { useWeb3Modal } from "@web3modal/ethers/react"
import { useWeb3ModalAccount } from "@web3modal/ethers/react"
import { Button } from "@/components/ui/button"
import { Wallet } from 'lucide-react'

export function WalletButton() {
  const { open } = useWeb3Modal()
  const { address, isConnected } = useWeb3ModalAccount()

  const displayAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""

  return (
    <Button onClick={() => open()} variant={isConnected ? "outline" : "default"} className="gap-2">
      <Wallet size={18} />
      {isConnected ? displayAddress : "Connect Wallet"}
    </Button>
  )
}
