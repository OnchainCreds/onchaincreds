"use client"

import type { ReactNode } from "react"
import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react"

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || ""

if (!projectId) {
  console.warn("NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID is not set")
}

const getMetadataUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin
  }
  return "https://onchain-creds.vercel.app"
}

// Metadata for Web3Modal
const metadata = {
  name: "OnchainCreds",
  description: "Blockchain-powered credential verification platform",
  url: getMetadataUrl(),
  icons: ["/onchain-creds-logo.png"],
}

// Celo Mainnet configuration
const celoMainnet = {
  chainId: 42220,
  name: "Celo Mainnet",
  currency: "CELO",
  explorerUrl: "https://celoscan.io",
  rpcUrl: "https://forno.celo.org",
}

// Celo Alfajores Testnet configuration
const celoAlfajores = {
  chainId: 44787,
  name: "Celo Alfajores",
  currency: "CELO",
  explorerUrl: "https://alfajores-blockscout.celo-testnet.org",
  rpcUrl: "https://alfajores-forno.celo-testnet.org",
}

const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
  rpcUrl: process.env.NEXT_PUBLIC_CELO_RPC_URL || "https://forno.celo.org",
  defaultChainId: 42220,
})

createWeb3Modal({
  ethersConfig,
  chains: [celoMainnet as any, celoAlfajores as any],
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
})

export function WalletProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}
