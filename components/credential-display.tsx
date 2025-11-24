"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, Download } from "lucide-react"

interface CredentialDisplayProps {
  credential: {
    tokenId?: string
    owner: string
    metadataUri?: string
    metadata?: {
      name: string
      description: string
      image?: string
      attributes?: Array<{ trait_type: string; value: string }>
    }
    credentials?: Array<{
      tokenId: string
      owner: string
      metadataUri: string
      metadata?: {
        name: string
        description: string
        image?: string
        attributes?: Array<{ trait_type: string; value: string }>
      }
    }>
    balance?: number
    message?: string
  }
}

function SingleCredentialDisplay({ credential }: { credential: any }) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const attributes = credential.metadata?.attributes || []
  const celoscanUrl = `https://celoscan.io/token/0x...?a=${credential.tokenId}`

  return (
    <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} transition={{ duration: 0.3 }} className="w-full">
      <Card className="w-full overflow-hidden border border-border">
        {credential.metadata?.image && (
          <div className="w-full aspect-video bg-secondary overflow-hidden">
            <img
              src={credential.metadata.image || "/placeholder.svg"}
              alt="Credential"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="w-full p-6 space-y-6 md:p-8">
          {/* Header */}
          <div className="w-full space-y-2">
            <h2 className="text-2xl font-bold md:text-3xl break-words">{credential.metadata?.name}</h2>
            <p className="text-sm text-muted-foreground md:text-base">{credential.metadata?.description}</p>
          </div>

          {/* Verification Badge */}
          <div className="w-full flex items-center gap-2 p-4 rounded-lg bg-green-500/10 border border-green-500/50">
            <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
            <span className="text-xs font-semibold text-green-600 md:text-sm">Verified on Celo Blockchain</span>
          </div>

          {/* Attributes */}
          {attributes.length > 0 && (
            <div className="w-full space-y-4">
              <h3 className="font-semibold text-lg">Credential Details</h3>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                {attributes.map((attr, i) => (
                  <div key={i} className="w-full p-4 rounded-lg bg-secondary/30 border border-border overflow-hidden">
                    <p className="text-xs text-muted-foreground mb-1">{attr.trait_type}</p>
                    <p className="font-medium break-words text-sm">{attr.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* On-chain Details */}
          <div className="w-full space-y-4">
            <h3 className="font-semibold text-lg">On-Chain Details</h3>
            <div className="w-full space-y-3">
              <div className="w-full p-4 rounded-lg bg-secondary/30 border border-border overflow-hidden">
                <p className="text-xs text-muted-foreground mb-1">Token ID</p>
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <p className="font-mono text-sm break-all">{credential.tokenId}</p>
                  <button
                    onClick={() => copyToClipboard(credential.tokenId)}
                    className="p-1 hover:bg-secondary rounded transition-colors flex-shrink-0"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div className="w-full p-4 rounded-lg bg-secondary/30 border border-border overflow-hidden">
                <p className="text-xs text-muted-foreground mb-1">Owner Address</p>
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <p className="font-mono text-sm break-all">
                    {credential.owner.slice(0, 6)}...{credential.owner.slice(-4)}
                  </p>
                  <button
                    onClick={() => copyToClipboard(credential.owner)}
                    className="p-1 hover:bg-secondary rounded transition-colors flex-shrink-0"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div className="w-full p-4 rounded-lg bg-secondary/30 border border-border overflow-hidden">
                <p className="text-xs text-muted-foreground mb-1">Metadata URI</p>
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <p className="font-mono text-sm truncate">{credential.metadataUri}</p>
                  <button
                    onClick={() => copyToClipboard(credential.metadataUri)}
                    className="p-1 hover:bg-secondary rounded transition-colors flex-shrink-0"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="w-full flex flex-col gap-3 pt-4 md:flex-row">
            <Button
              onClick={() => {
                window.open(celoscanUrl, "_blank")
              }}
              variant="outline"
              className="w-full gap-2 md:flex-1"
            >
              <ExternalLink size={18} />
              View on Celoscan
            </Button>
            <Button
              onClick={() => {
                window.open(credential.metadata?.image || "", "_blank")
              }}
              variant="outline"
              className="w-full gap-2 md:flex-1"
            >
              <Download size={18} />
              Download Image
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export function CredentialDisplay({ credential }: CredentialDisplayProps) {
  if (credential.credentials && Array.isArray(credential.credentials)) {
    return (
      <div className="w-full space-y-6">
        {/* Address Summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full mb-8">
          <Card className="w-full p-6 bg-secondary/30 border border-border overflow-hidden">
            <h2 className="text-xl font-bold md:text-2xl mb-4 break-words">{credential.message}</h2>
            <div className="w-full space-y-3">
              <div className="w-full p-4 rounded-lg bg-background border border-border overflow-hidden">
                <p className="text-xs text-muted-foreground mb-1">Owner Address</p>
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <p className="font-mono text-sm break-all">
                    {credential.owner.slice(0, 6)}...{credential.owner.slice(-4)}
                  </p>
                  <button
                    onClick={() => navigator.clipboard.writeText(credential.owner)}
                    className="p-1 hover:bg-secondary rounded transition-colors flex-shrink-0"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Credentials List */}
        <div className="w-full space-y-6">
          {credential.credentials.map((cred, index) => (
            <motion.div
              key={cred.tokenId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="w-full"
            >
              <SingleCredentialDisplay credential={cred} />
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <SingleCredentialDisplay credential={credential} />
    </div>
  )
}
