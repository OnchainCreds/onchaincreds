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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 py-4"
          >
            {/* Success State */}
            {result.success ? (
              <>
                <div className="text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="flex justify-center"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl" />
                      <CheckCircle2 size={64} className="text-green-500 relative" />
                    </div>
                  </motion.div>

                  <div>
                    <h2 className="text-3xl font-bold mb-2">Credential Minted Successfully!</h2>
                    <p className="text-muted-foreground">
                      Your professional credential has been minted as an NFT on the Celo blockchain.
                    </p>
                  </div>
                </div>

                {/* Credential Details - Improved spacing and layout to prevent overlapping */}
                <div className="space-y-4 bg-secondary/30 rounded-lg p-6">
                  {/* Token ID */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Token ID</p>
                    <div className="flex items-center justify-between bg-background rounded px-4 py-3 gap-3 flex-wrap">
                      <code className="font-mono text-sm break-all flex-1">{result.tokenId}</code>
                      <button
                        onClick={() => copyToClipboard(result.tokenId || "", "Token ID")}
                        className="p-2 hover:bg-secondary rounded transition-colors flex-shrink-0"
                        title="Copy Token ID"
                      >
                        <Copy size={18} className={copied === "Token ID" ? "text-green-500" : ""} />
                      </button>
                    </div>
                  </div>

                  {/* Transaction Hash */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Transaction Hash</p>
                    <div className="flex items-center justify-between bg-background rounded px-4 py-3 gap-3 flex-wrap">
                      <code className="font-mono text-xs break-all flex-1 leading-relaxed">
                        {result.transactionHash}
                      </code>
                      <button
                        onClick={() => copyToClipboard(result.transactionHash || "", "Transaction Hash")}
                        className="p-2 hover:bg-secondary rounded transition-colors flex-shrink-0"
                        title="Copy Transaction Hash"
                      >
                        <Copy size={18} className={copied === "Transaction Hash" ? "text-green-500" : ""} />
                      </button>
                    </div>
                  </div>

                  {/* Block Number */}
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Block Number</p>
                    <div className="bg-background rounded px-4 py-3">
                      <p className="font-mono text-sm">{result.blockNumber}</p>
                    </div>
                  </div>

                  {/* Metadata URI */}
                  {result.metadataUri && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-muted-foreground">Metadata URI</p>
                      <div className="flex items-center justify-between bg-background rounded px-4 py-3 gap-3 flex-wrap">
                        <code className="font-mono text-xs break-all flex-1 leading-relaxed">{result.metadataUri}</code>
                        <button
                          onClick={() => copyToClipboard(result.metadataUri || "", "Metadata URI")}
                          className="p-2 hover:bg-secondary rounded transition-colors flex-shrink-0"
                          title="Copy Metadata URI"
                        >
                          <Copy size={18} className={copied === "Metadata URI" ? "text-green-500" : ""} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons - Improved grid layout for better spacing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    onClick={() => {
                      window.open(celoscanUrl, "_blank")
                    }}
                    variant="outline"
                    className="gap-2"
                  >
                    <ExternalLink size={18} />
                    View on Celoscan
                  </Button>

                  {ipfsGatewayUrl && (
                    <Button
                      onClick={() => {
                        window.open(ipfsGatewayUrl, "_blank")
                      }}
                      variant="outline"
                      className="gap-2"
                    >
                      <Download size={18} />
                      View Metadata
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
                    className="gap-2"
                  >
                    <Share2 size={18} />
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
                    className="gap-2"
                  >
                    <Download size={18} />
                    Download Details
                  </Button>
                </div>

                <Button onClick={onClose} className="w-full" size="lg">
                  Mint Another Credential
                </Button>
              </>
            ) : (
              <>
                {/* Failure State */}
                <div className="text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="flex justify-center"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl" />
                      <XCircle size={64} className="text-red-500 relative" />
                    </div>
                  </motion.div>

                  <div>
                    <h2 className="text-3xl font-bold mb-2">Minting Failed</h2>
                    <p className="text-muted-foreground max-w-sm mx-auto">{result.error}</p>
                  </div>
                </div>

                {/* Error Details */}
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                  <p className="text-sm text-red-600 font-mono break-words whitespace-pre-wrap">{result.error}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 flex-wrap">
                  <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent min-w-[120px]">
                    Try Again
                  </Button>
                  <Button
                    onClick={() => {
                      const text = `Error minting credential on OnchainCreds: ${result.error}`
                      copyToClipboard(text, "Error Message")
                    }}
                    variant="outline"
                    className="flex-1 gap-2 min-w-[120px]"
                  >
                    <Copy size={18} />
                    Copy Error
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
