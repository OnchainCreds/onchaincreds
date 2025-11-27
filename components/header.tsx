"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { motion } from "framer-motion"
import { WalletButton } from "@/components/wallet-button"
import { useCredentialModal } from "@/components/credential-modal-provider"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { openModal } = useCredentialModal()
  const pathname = usePathname()

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Developer", href: "/developer" },
    { name: "Mint Credential", action: "mint" },
    { name: "Verify Credential", href: "/verify" },
  ]

  const isActive = (href: string | undefined) => href && pathname === href

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
                <div key={item.name}>
                  {item.action === "mint" ? (
                    <button
                      onClick={openModal}
                      className="relative text-sm font-medium transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      href={item.href || "#"}
                      className={`relative text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {item.name}
                      {isActive(item.href) && (
                        <motion.div layoutId="underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary" />
                      )}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Right side - Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={openModal}
                className="hidden sm:inline px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Mint Credential
              </button>
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
                <div key={item.name}>
                  {item.action === "mint" ? (
                    <button
                      onClick={() => {
                        openModal()
                        setIsMenuOpen(false)
                      }}
                      className="w-full text-left px-4 py-3 text-sm transition-colors text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      href={item.href || "#"}
                      onClick={() => setIsMenuOpen(false)}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors block ${
                        isActive(item.href)
                          ? "text-primary bg-primary/10 font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </motion.nav>
          )}
        </div>
      </header>
    </>
  )
}
