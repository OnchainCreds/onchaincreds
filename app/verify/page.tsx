"use client"

import type React from "react"
import { verifyCredential } from "@/app/actions/verify"
import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CredentialDisplay } from "@/components/credential-display"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Search, CheckCircle2, AlertCircle } from 'lucide-react'

export default function VerifyPage() {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [credential, setCredential] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchType, setSearchType] = useState<"tokenId" | "address" | "txHash">("tokenId")

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    setError(null)
    setCredential(null)

    try {
      const result = await verifyCredential(query.trim(), searchType)

      if (result.error) {
        setError(result.error)
      } else {
        setCredential(result)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed")
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="py-12 px-4 flex-1">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="text-5xl font-bold mb-4">Verify Credentials</h1>
            <p className="text-xl text-muted-foreground">Search and verify credentials minted on-chain</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSearch}
            className="mb-8 space-y-4"
          >
            <div className="flex gap-2 flex-wrap">
              <Button
                type="button"
                onClick={() => {
                  setSearchType("tokenId")
                  setCredential(null)
                  setQuery("")
                }}
                variant={searchType === "tokenId" ? "default" : "outline"}
                className="flex-1 min-w-[140px]"
              >
                Token ID
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setSearchType("address")
                  setCredential(null)
                  setQuery("")
                }}
                variant={searchType === "address" ? "default" : "outline"}
                className="flex-1 min-w-[140px]"
              >
                Wallet Address
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setSearchType("txHash")
                  setCredential(null)
                  setQuery("")
                }}
                variant={searchType === "txHash" ? "default" : "outline"}
                className="flex-1 min-w-[140px]"
              >
                Transaction Hash
              </Button>
            </div>

            {/* Search Input */}
            <div className="flex gap-2">
              <Input
                placeholder={
                  searchType === "tokenId"
                    ? "Enter token ID (e.g., 42)"
                    : searchType === "address"
                      ? "Enter wallet address (0x...)"
                      : "Enter transaction hash (0x...)"
                }
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isSearching}
                className="flex-1"
              />
              <Button type="submit" disabled={!query || isSearching} size="lg" className="gap-2">
                {isSearching ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={18} />
                    Search
                  </>
                )}
              </Button>
            </div>
          </motion.form>

          {/* Error State */}
          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <Card className="p-6 border border-destructive/50 bg-destructive/10">
                <div className="flex gap-3 text-destructive">
                  <AlertCircle size={20} className="flex-shrink-0" />
                  <p>{error}</p>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Credential Display */}
          {credential && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <CredentialDisplay credential={credential} />
            </motion.div>
          )}

          {/* Empty State */}
          {!credential && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center py-12"
            >
              <Card className="p-12 border border-border bg-secondary/30">
                <div className="space-y-4">
                  <div className="flex justify-center mb-4">
                    <CheckCircle2 size={48} className="text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">Verify Credentials</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Search for credentials by token ID, wallet address, or transaction hash. All credentials are verified
                    directly from the blockchain.
                  </p>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
