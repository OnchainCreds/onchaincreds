"use client"

import { useState, useCallback } from "react"
import { ethers } from "ethers"
import { useWeb3ModalProvider, useWeb3ModalAccount } from "@web3modal/ethers/react"
import { CONTRACT_CONFIG, MINET_ABI, CELO_RPC_URL } from "@/lib/contract-config"

export interface MintResult {
  transactionHash: string
  blockNumber: number
  tokenId: string
}

export function useWeb3Contract() {
  const { address, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()

  const [isMinting, setIsMinting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const mintCredential = useCallback(
    async (ipfsUri: string): Promise<MintResult | null> => {
      if (!isConnected || !address || !walletProvider) {
        setError("Wallet not connected")
        return null
      }

      setIsMinting(true)
      setError(null)

      try {
        const ethersProvider = new ethers.BrowserProvider(walletProvider)
        const signer = await ethersProvider.getSigner()

        const contract = new ethers.Contract(CONTRACT_CONFIG.address, MINET_ABI, signer)

        // Call mint function
        const tx = await contract.mint(address, ipfsUri)

        // Wait for transaction confirmation
        const receipt = await tx.wait(1)

        if (!receipt) {
          throw new Error("Transaction failed")
        }

        // Extract token ID from events
        const events = receipt.logs
          .map((log: any) => {
            try {
              return contract.interface.parseLog(log)
            } catch {
              return null
            }
          })
          .filter((e: any) => e && e.name === "CredentialMinted")

        const tokenId = events[0]?.args[1]?.toString() || "unknown"

        const result: MintResult = {
          transactionHash: tx.hash,
          blockNumber: receipt.blockNumber,
          tokenId,
        }

        return result
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to mint credential"
        setError(message)
        return null
      } finally {
        setIsMinting(false)
      }
    },
    [isConnected, address, walletProvider],
  )

  const getBalance = useCallback(
    async (walletAddress?: string) => {
      const targetAddress = walletAddress || address
      if (!targetAddress) {
        setError("No wallet address provided")
        return 0
      }

      try {
        const provider = new ethers.JsonRpcProvider(CELO_RPC_URL)
        const contract = new ethers.Contract(CONTRACT_CONFIG.address, MINET_ABI, provider)

        const balance = await contract.balanceOf(targetAddress)
        return Number(balance)
      } catch (err) {
        return 0
      }
    },
    [address],
  )

  return {
    mintCredential,
    getBalance,
    isMinting,
    error,
    isConnected,
    address,
  }
}
