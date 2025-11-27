"use client"

import type React from "react"
import { verifyCredential } from "@/app/actions/verify"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { VerificationStatus } from "@/components/verification-status"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Search, CheckCircle2, AlertCircle, Copy } from 'lucide-react'
import { useWeb3ModalAccount } from "@web3modal/ethers/react"

export default function VerifyPage() {
  const { address: connectedAddress, isConnected } = useWeb3ModalAccount()
  
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [credential, setCredential] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [searchType, setSearchType] = useState<"tokenId" | "address" | "txHash" | "myCredentials">("tokenId")
  const [credentials, setCredentials] = useState<any[]>([])

  const handleSearchTypeChange = (newSearchType: typeof searchType) => {
    setSearchType(newSearchType)
    setCredential(null)
    setCredentials([])
    setQuery("")
    setError(null)

    if (newSearchType === "myCredentials" && isConnected && connectedAddress) {
      handleMyCredentialsSearch(connectedAddress)
    }
  }

  const handleMyCredentialsSearch = async (walletAddress: string) => {
    setIsSearching(true)
    setError(null)
    setCredential(null)

    try {
      const result = await verifyCredential(walletAddress, "address")

      if (result.error) {
        setError(result.error)
        setCredentials([])
      } else if (result.credentials && Array.isArray(result.credentials)) {
        setCredentials(result.credentials)
      } else {
        setCredentials([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed")
      setCredentials([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(true)
    setError(null)
    setCredential(null)
    setCredentials([])

    try {
      const result = await verifyCredential(query.trim(), searchType === "myCredentials" ? "address" : searchType)

      if (result.error) {
        setError(result.error)
      } else {
        if (result.credentials && Array.isArray(result.credentials)) {
          setCredentials(result.credentials)
        } else {
          setCredential(result)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed")
    } finally {
      setIsSearching(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="py-12 px-4 flex-1">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Verify Credentials</h1>
            <p className="text-lg text-muted-foreground">
              Search and verify credentials minted on-chain. View attestation status and claim verification.
            </p>
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
                onClick={() => handleSearchTypeChange("tokenId")}
                variant={searchType === "tokenId" ? "default" : "outline"}
                className="flex-1 min-w-[120px]"
              >
                Search by ID
              </Button>
              <Button
                type="button"
                onClick={() => handleSearchTypeChange("txHash")}
                variant={searchType === "txHash" ? "default" : "outline"}
                className="flex-1 min-w-[140px]"
              >
                Search by Tx Hash
              </Button>
              <Button
                type="button"
                onClick={() => handleSearchTypeChange("address")}
                variant={searchType === "address" ? "default" : "outline"}
                className="flex-1 min-w-[150px]"
              >
                Search by Address
              </Button>
              <Button
                type="button"
                onClick={() => handleSearchTypeChange("myCredentials")}
                variant={searchType === "myCredentials" ? "default" : "outline"}
                disabled={!isConnected}
                className="flex-1 min-w-[130px]"
              >
                My Credentials
              </Button>
            </div>

            {searchType !== "myCredentials" && (
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
            )}

            {searchType === "myCredentials" && (
              <div className="flex gap-2">
                <div className="flex-1 p-3 rounded-lg border border-border bg-secondary/30 flex items-center">
                  <span className="text-sm text-muted-foreground">
                    {isConnected ? `Connected: ${connectedAddress?.slice(0, 6)}...${connectedAddress?.slice(-4)}` : "Connect wallet to view credentials"}
                  </span>
                </div>
                <Button 
                  type="button"
                  onClick={() => isConnected && connectedAddress && handleMyCredentialsSearch(connectedAddress)}
                  disabled={!isConnected || isSearching} 
                  size="lg" 
                  className="gap-2"
                >
                  {isSearching ? (
                    <>
                      <Spinner className="h-4 w-4" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <Search size={18} />
                      Load
                    </>
                  )}
                </Button>
              </div>
            )}
          </motion.form>

          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <Card className="p-6 border border-destructive/50 bg-destructive/10">
                <div className="flex gap-3 text-destructive">
                  <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold">Search Failed</h3>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {(credential || credentials.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {credentials.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    Found {credentials.length} Credential{credentials.length !== 1 ? 's' : ''}
                  </h3>
                  {credentials.map((cred: any, index: number) => (
                    <Card
                      key={index}
                      className="p-6 border border-border bg-card hover:bg-card/80 transition-colors cursor-pointer"
                      onClick={() => {
                        setCredential(cred)
                        setCredentials([])
                      }}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{cred.metadata?.name || `Credential #${cred.tokenId}`}</h4>
                            <p className="text-sm text-muted-foreground">{cred.metadata?.description}</p>
                          </div>
                          <div className="text-xs font-mono bg-secondary/30 px-3 py-1 rounded ml-2">
                            #{cred.tokenId}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Owner: {cred.owner?.slice(0, 6)}...{cred.owner?.slice(-4)}</span>
                          {cred.transactionHash && <span>Tx: {cred.transactionHash?.slice(0, 10)}...</span>}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {credential && (
                <>
                  <Card className="p-6 border border-border bg-card">
                    <h2 className="text-2xl font-bold mb-2">{credential.metadata?.name}</h2>
                    <p className="text-muted-foreground mb-4">{credential.metadata?.description}</p>
                    
                    <div className="space-y-3 border-t border-border pt-4">
                      <div className="p-3 rounded-lg bg-secondary/30">
                        <p className="text-xs text-muted-foreground mb-1">Token ID</p>
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-mono text-sm">{credential.tokenId}</p>
                          <button
                            onClick={() => copyToClipboard(credential.tokenId)}
                            className="p-1 hover:bg-secondary rounded transition-colors"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-secondary/30">
                        <p className="text-xs text-muted-foreground mb-1">Owner Address</p>
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-mono text-sm">
                            {credential.owner?.slice(0, 6)}...{credential.owner?.slice(-4)}
                          </p>
                          <button
                            onClick={() => copyToClipboard(credential.owner)}
                            className="p-1 hover:bg-secondary rounded transition-colors"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>
                      {credential.transactionHash && (
                        <div className="p-3 rounded-lg bg-secondary/30">
                          <p className="text-xs text-muted-foreground mb-1">Transaction Hash</p>
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-mono text-sm">
                              {credential.transactionHash?.slice(0, 10)}...{credential.transactionHash?.slice(-8)}
                            </p>
                            <button
                              onClick={() => copyToClipboard(credential.transactionHash)}
                              className="p-1 hover:bg-secondary rounded transition-colors"
                            >
                              <Copy size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>

                  <VerificationStatus credential={credential} />
                </>
              )}
            </motion.div>
          )}

          {!credential && credentials.length === 0 && !error && (
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
                  <h3 className="text-lg font-semibold">Search for Credentials</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Use one of the four search options to find and verify credentials on-chain. Connect your wallet to access "My Credentials".
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
