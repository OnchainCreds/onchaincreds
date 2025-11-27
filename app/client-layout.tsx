"use client"

import { WalletProvider } from "@/components/wallet-provider"
import { CredentialModalProvider } from "@/components/credential-modal-provider"
import { useEffect } from "react"
import { usePathname } from 'next/navigation'
import React from "react"

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <ScrollToTop />
      <CredentialModalProvider>
        <WalletProvider>{children}</WalletProvider>
      </CredentialModalProvider>
    </>
  )
}

export default ClientLayout

// Component to handle scroll-to-top on navigation
function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
