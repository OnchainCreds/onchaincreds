"use client"

import { WalletProvider } from "@/components/wallet-provider"
import React from "react"

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <ScrollToTop />
      <WalletProvider>{children}</WalletProvider>
    </>
  )
}

export default ClientLayout

// Added component to handle scroll-to-top on navigation
function ScrollToTop() {
  React.useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0)
    }

    // Scroll to top on mount and when location changes
    window.scrollTo(0, 0)

    // Listen for popstate (back/forward button)
    window.addEventListener("popstate", handleRouteChange)
    return () => window.removeEventListener("popstate", handleRouteChange)
  }, [])

  return null
}
