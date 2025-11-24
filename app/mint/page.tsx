"use client"

import { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MintForm } from "@/components/mint-form"
import { CredentialPreview } from "@/components/credential-preview"
import { MintResultModal } from "@/components/mint-result-modal"
import { ChevronDown, Check } from 'lucide-react'
import type { CredentialData } from "@/hooks/use-credential-image"

export default function MintPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("template-1")
  const [previewData, setPreviewData] = useState<CredentialData | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [mintResult, setMintResult] = useState<any>(null)
  const [isMinting, setIsMinting] = useState(false)
  const [templateDropdownOpen, setTemplateDropdownOpen] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const templateParam = params.get("template")
    if (templateParam) {
      const templateMap: { [key: string]: string } = {
        "1": "template-1",
        "2": "template-2",
        "3": "template-3",
        "4": "template-4",
        "5": "template-5",
        "6": "template-6",
      }
      const mappedTemplate = templateMap[templateParam]
      if (mappedTemplate) {
        setSelectedTemplate(mappedTemplate)
        // Scroll to form after a small delay to ensure rendering
        setTimeout(() => {
          const formElement = document.querySelector("form")
          if (formElement) {
            formElement.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        }, 100)
      }
    }
  }, [])

  const templates = [
    { id: "template-1", name: "Professional Blue", color: "from-blue-600 to-cyan-400", supportsPhoto: true },
    { id: "template-2", name: "Modern Purple", color: "from-purple-600 to-pink-400", supportsPhoto: true },
    { id: "template-3", name: "Minimal Dark", color: "from-gray-700 to-gray-400", supportsPhoto: false },
    { id: "template-4", name: "Executive Gold", color: "from-amber-700 to-yellow-400", supportsPhoto: true },
    { id: "template-5", name: "Tech Green", color: "from-emerald-600 to-teal-400", supportsPhoto: false },
    { id: "template-6", name: "Sunset Orange", color: "from-orange-600 to-red-400", supportsPhoto: true },
  ]

  const selectedTemplateData = useMemo(
    () => templates.find((t) => t.id === selectedTemplate),
    [selectedTemplate, templates],
  )

  const handleFormSubmit = (data: CredentialData, image: string | null) => {
    setPreviewData({ ...data, template: selectedTemplate })
    setPreviewImage(image)
  }

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
    setPreviewData(null)
    setPreviewImage(null)
  }

  const handleWalletConnect = () => {
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Mint Your Resume</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Transform your professional achievements into an NFT credential on-chain
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              {/* Mint Form */}
              <MintForm
                selectedTemplate={selectedTemplate}
                onSubmit={handleFormSubmit}
                onMintSuccess={handleMintSuccess}
                onMintFailure={handleMintFailure}
                isMinting={isMinting}
                setIsMinting={setIsMinting}
              />
            </motion.div>

            {/* Preview Section */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <div className="sticky top-24 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
                  <div className="rounded-xl border border-border bg-secondary/30 p-4 min-h-96 flex items-center justify-center">
                    {previewData ? (
                      <CredentialPreview data={previewData} imageUrl={previewImage} />
                    ) : (
                      <div className="text-center">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <svg
                            className="h-8 w-8 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                          </svg>
                        </div>
                        <p className="text-muted-foreground font-medium">Fill out the form to see preview</p>
                        <p className="text-sm text-muted-foreground mt-2">Your credential will appear here</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">Select Template</label>
                  <div className="relative">
                    <button
                      onClick={() => setTemplateDropdownOpen(!templateDropdownOpen)}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-card hover:bg-secondary transition-colors text-left flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`h-6 w-6 rounded bg-gradient-to-br ${selectedTemplateData?.color}`} />
                        <span className="font-medium">{selectedTemplateData?.name}</span>
                        {selectedTemplateData?.supportsPhoto && (
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Photo</span>
                        )}
                      </div>
                      <ChevronDown
                        size={20}
                        className={`transition-transform ${templateDropdownOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {templateDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50">
                        {templates.map((template) => (
                          <button
                            key={template.id}
                            onClick={() => {
                              setSelectedTemplate(template.id)
                              setTemplateDropdownOpen(false)
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center justify-between border-b border-border last:border-b-0"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`h-5 w-5 rounded bg-gradient-to-br ${template.color}`} />
                              <span className="font-medium">{template.name}</span>
                              {template.supportsPhoto && (
                                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">Photo</span>
                              )}
                            </div>
                            {selectedTemplate === template.id && <Check size={18} className="text-primary" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mint Result Modal */}
      {mintResult && <MintResultModal result={mintResult} onClose={handleReset} />}

      <Footer />
    </div>
  )
}
