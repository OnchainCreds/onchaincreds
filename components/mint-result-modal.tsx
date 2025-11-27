"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Copy, Download, Share2, ExternalLink } from 'lucide-react'
import { CONTRACT_CONFIG } from "@/lib/contract-config"

interface MintResultModalProps {
  result: {
    success: boolean
    transactionHash?: string
    tokenId?: string
    blockNumber?: number
    error?: string
    metadataUri?: string
  }
  onClose: () => void
}

export function MintResultModal({ result, onClose }: MintResultModalProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  const generateShareText = () => {
    return `I just minted my professional credentials as an NFT on Celo using OnchainCreds! Token ID: ${result.tokenId} on @CeloOrg blockchain. Own your credentials on-chain!`
  }

  const celoscanUrl = `https://celoscan.io/tx/${result.transactionHash}`
  const ipfsGatewayUrl = result.metadataUri?.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")

  return (
    <AnimatePresence>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 py-2"
          >
            {/* Success State */}
            {result.success ? (
              <>
                <div className="text-center space-y-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="flex justify-center"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl" />
                      <CheckCircle2 size={48} className="text-green-500 relative" />
                    </div>
                  </motion.div>

                  <div>
                    <h2 className="text-2xl font-bold mb-1">Credential Minted!</h2>
                    <p className="text-sm text-muted-foreground">
                      Your professional credential has been minted as an NFT on Celo.
                    </p>
                  </div>
                </div>

                {/* Credential Details - Compact spacing */}
                <div className="space-y-3 bg-secondary/30 rounded-lg p-4">
                  {/* Token ID */}
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground">Token ID</p>
                    <div className="flex items-center justify-between bg-background rounded px-3 py-2 gap-2 flex-wrap">
                      <code className="font-mono text-xs break-all flex-1">{result.tokenId}</code>
                      <button
                        onClick={() => copyToClipboard(result.tokenId || "", "Token ID")}
                        className="p-1.5 hover:bg-secondary rounded transition-colors flex-shrink-0"
                        title="Copy Token ID"
                      >
                        <Copy size={16} className={copied === "Token ID" ? "text-green-500" : ""} />
                      </button>
                    </div>
                  </div>

                  {/* Transaction Hash */}
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground">Transaction Hash</p>
                    <div className="flex items-center justify-between bg-background rounded px-3 py-2 gap-2 flex-wrap">
                      <code className="font-mono text-xs break-all flex-1 leading-tight">
                        {result.transactionHash}
                      </code>
                      <button
                        onClick={() => copyToClipboard(result.transactionHash || "", "Transaction Hash")}
                        className="p-1.5 hover:bg-secondary rounded transition-colors flex-shrink-0"
                        title="Copy Transaction Hash"
                      >
                        <Copy size={16} className={copied === "Transaction Hash" ? "text-green-500" : ""} />
                      </button>
                    </div>
                  </div>

                  {/* Block Number */}
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground">Block Number</p>
                    <div className="bg-background rounded px-3 py-2">
                      <p className="font-mono text-xs">{result.blockNumber}</p>
                    </div>
                  </div>

                  {/* Metadata URI */}
                  {result.metadataUri && (
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground">Metadata URI</p>
                      <div className="flex items-center justify-between bg-background rounded px-3 py-2 gap-2 flex-wrap">
                        <code className="font-mono text-xs break-all flex-1 leading-tight">{result.metadataUri}</code>
                        <button
                          onClick={() => copyToClipboard(result.metadataUri || "", "Metadata URI")}
                          className="p-1.5 hover:bg-secondary rounded transition-colors flex-shrink-0"
                          title="Copy Metadata URI"
                        >
                          <Copy size={16} className={copied === "Metadata URI" ? "text-green-500" : ""} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons - Compact grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button
                    onClick={() => {
                      window.open(celoscanUrl, "_blank")
                    }}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <ExternalLink size={16} />
                    <span className="hidden sm:inline">Celoscan</span>
                    <span className="sm:hidden">View</span>
                  </Button>

                  {ipfsGatewayUrl && (
                    <Button
                      onClick={() => {
                        window.open(ipfsGatewayUrl, "_blank")
                      }}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Download size={16} />
                      <span className="hidden sm:inline">Metadata</span>
                      <span className="sm:hidden">IPFS</span>
                    </Button>
                  )}

                  <Button
                    onClick={() => {
                      const text = generateShareText()
                      if (navigator.share) {
                        navigator.share({
                          title: "OnchainCreds - Credential Minted!",
                          text: text,
                        })
                      } else {
                        copyToClipboard(text, "Share Text")
                      }
                    }}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Share2 size={16} />
                    Share
                  </Button>

                  <Button
                    onClick={() => {
                      // Trigger download of credential details
                      const details = `
OnchainCreds - Credential Minted
================================
Token ID: ${result.tokenId}
Transaction Hash: ${result.transactionHash}
Block Number: ${result.blockNumber}
Metadata URI: ${result.metadataUri}
Chain: Celo Mainnet (42220)
Contract: ${CONTRACT_CONFIG.address}

View on Celoscan: ${celoscanUrl}
                      `.trim()

                      const element = document.createElement("a")
                      element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(details))
                      element.setAttribute("download", `credential-${result.tokenId}.txt`)
                      element.style.display = "none"
                      document.body.appendChild(element)
                      element.click()
                      document.body.removeChild(element)
                    }}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Download size={16} />
                    Details
                  </Button>
                </div>

                <Button onClick={onClose} className="w-full" size="md">
                  Mint Another
                </Button>
              </>
            ) : (
              <>
                {/* Failure State */}
                <div className="text-center space-y-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="flex justify-center"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl" />
                      <XCircle size={48} className="text-red-500 relative" />
                    </div>
                  </motion.div>

                  <div>
                    <h2 className="text-2xl font-bold mb-1">Minting Failed</h2>
                    <p className="text-muted-foreground text-sm max-w-sm mx-auto">{result.error}</p>
                  </div>
                </div>

                {/* Error Details */}
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                  <p className="text-xs text-red-600 font-mono break-words whitespace-pre-wrap">{result.error}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 flex-wrap">
                  <Button onClick={onClose} variant="outline" size="sm" className="flex-1 bg-transparent min-w-[100px]">
                    Try Again
                  </Button>
                  <Button
                    onClick={() => {
                      const text = `Error minting credential on OnchainCreds: ${result.error}`
                      copyToClipboard(text, "Error Message")
                    }}
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2 min-w-[100px]"
                  >
                    <Copy size={16} />
                    <span className="hidden sm:inline">Copy</span>
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </DialogContent>
      </Dialog>
    </AnimatePresence>
  )
}
