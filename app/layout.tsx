import { Geist, Geist_Mono } from 'next/font/google'
import type { Metadata } from "next"
import "./globals.css"
import type React from "react"
import { ClientLayout } from "./client-layout"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OnchainCreds | Blockchain Credential Verification Protocol",
  description:
    "Own your credentials on-chain. A decentralized protocol for minting, verifying, and showcasing digital credentials with transparency.",
  keywords: "blockchain, credentials, resume, NFT, Celo, verification, Web3",
  openGraph: {
    title: "OnchainCreds | Own Your Credentials, On-Chain",
    description:
      "A blockchain-powered protocol for minting, verifying, and showcasing digital credentials with transparency.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OnchainCreds Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OnchainCreds",
    description: "Own your credentials on-chain",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/onchain-creds-logo.png",
    apple: "/onchain-creds-logo.png",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans antialiased bg-background text-foreground`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
