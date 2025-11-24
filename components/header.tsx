"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { motion } from "framer-motion"
import { WalletButton } from "@/components/wallet-button"
import { CredentialTypeModal } from "@/components/credential-type-modal"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCredentialModalOpen, setIsCredentialModalOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Mint Credentials", href: "#", onClick: () => setIsCredentialModalOpen(true) },
    { name: "Verify Credentials", href: "/verify" },
    { name: "Templates", href: "/templates" },
    { name: "About", href: "/about" },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
              <Image
                src="/onchain-creds-logo.png"
                alt="OnchainCreds logo"
                width={40}
                height={40}
                className="w-8 h-8 sm:w-10 sm:h-10"
                priority
              />
              <span className="hidden sm:inline font-bold text-foreground text-lg">OnchainCreds</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex gap-8">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={item.onClick || (() => {})}
                  className={`relative text-sm font-medium transition-colors ${
                    item.href !== "#" && isActive(item.href)
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  } ${item.onClick ? "cursor-pointer" : ""}`}
                >
                  {item.href !== "#" ? <Link href={item.href}>{item.name}</Link> : item.name}
                  {item.href !== "#" && isActive(item.href) && (
                    <motion.div layoutId="underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </nav>

            {/* Right side - Wallet Button */}
            <div className="flex items-center gap-4">
              <WalletButton />

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden pb-4 border-t border-border"
            >
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    item.onClick?.()
                    setIsMenuOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                    item.href !== "#" && isActive(item.href)
                      ? "text-primary bg-primary/10 font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {item.href !== "#" ? (
                    <Link href={item.href} onClick={() => setIsMenuOpen(false)}>
                      {item.name}
                    </Link>
                  ) : (
                    item.name
                  )}
                </button>
              ))}
            </motion.nav>
          )}
        </div>
      </header>

      <CredentialTypeModal open={isCredentialModalOpen} onOpenChange={setIsCredentialModalOpen} />
    </>
  )
}
