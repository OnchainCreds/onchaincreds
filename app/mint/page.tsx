"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CredentialForm } from "@/components/credential-form"
import { MintResultModal } from "@/components/mint-result-modal"

export default function MintPage() {
  const [mintResult, setMintResult] = useState<any>(null)
  const [isMinting, setIsMinting] = useState(false)

  const handleMintSuccess = (result: any) => {
    setMintResult(result)
    setIsMinting(false)
  }

  const handleMintFailure = (error: string) => {
    setMintResult({
      success: false,
      error,
      transactionHash: null,
      tokenId: null,
    })
    setIsMinting(false)
  }

  const handleReset = () => {
    setMintResult(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Create Your Credential</h1>
            <p className="text-lg text-muted-foreground">
              Submit your professional information and supporting documents to mint a verified on-chain credential. All information is securely stored with cryptographic verification.
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CredentialForm
              onMintSuccess={handleMintSuccess}
              onMintFailure={handleMintFailure}
              isMinting={isMinting}
              setIsMinting={setIsMinting}
            />
          </motion.div>
        </div>
      </section>

      {/* Mint Result Modal */}
      {mintResult && <MintResultModal result={mintResult} onClose={handleReset} />}

      <Footer />
    </div>
  )
}
