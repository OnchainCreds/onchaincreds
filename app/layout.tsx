import { Geist, Geist_Mono } from 'next/font/google'
import type { Metadata } from "next"
import "./globals.css"
import type React from "react"
import { ClientLayout } from "./client-layout"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OnchainCreds | Decentralized Credential Verification",
  description:
    "Mint verified professional credentials as on-chain NFTs. Self-attest your claims and maintain complete control over your digital identity through blockchain technology.",
  keywords: "blockchain, credentials, verification, NFT, Celo, Web3, identity, decentralized",
  openGraph: {
    title: "OnchainCreds | Decentralized Credential Verification",
    description:
      "Mint verified professional credentials as on-chain NFTs with transparent claim verification.",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OnchainCreds",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OnchainCreds",
    description: "Verified credentials on-chain",
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
