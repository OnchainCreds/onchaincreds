"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, Clock } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface CredentialOption {
  id: string
  name: string
  description: string
  status: "available" | "coming-soon"
  icon: React.ReactNode
}

interface CredentialTypeSelectorModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CredentialTypeSelectorModal({ isOpen, onClose }: CredentialTypeSelectorModalProps) {
  const router = useRouter()

  const credentials: CredentialOption[] = [
    {
      id: "resume",
      name: "Resume",
      description: "Create a verified on-chain credential for your professional background, skills, and experience.",
      status: "available",
      icon: <CheckCircle size={24} className="text-green-500" />,
    },
    {
      id: "cv",
      name: "CV",
      description: "Comprehensive curriculum vitae with detailed career history and accomplishments.",
      status: "coming-soon",
      icon: <Clock size={24} className="text-amber-500" />,
    },
    {
      id: "academic",
      name: "Academic Certificate",
      description: "Verify your educational achievements and academic credentials on-chain.",
      status: "coming-soon",
      icon: <Clock size={24} className="text-amber-500" />,
    },
  ]

  const handleSelectType = (id: string, status: string) => {
    if (status === "available") {
      onClose()
      router.push("/mint")
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Modal - Centered and properly sized */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 p-4"
          >
            <Card className="bg-card border border-border p-6 rounded-xl shadow-lg">
              {/* Header with close button */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground">Select Credential Type</h2>
                  <p className="text-sm text-muted-foreground mt-1">Choose which credential to create</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors flex-shrink-0 ml-4"
                  aria-label="Close modal"
                >
                  <X size={20} className="text-muted-foreground hover:text-foreground" />
                </button>
              </div>

              {/* Credential Options - consistent sizing */}
              <div className="space-y-3 mb-6">
                {credentials.map((credential) => (
                  <motion.div
                    key={credential.id}
                    whileHover={credential.status === "available" ? { scale: 1.02, y: -2 } : {}}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Card
                      className={`p-4 border-2 transition-all ${
                        credential.status === "available"
                          ? "border-primary/30 hover:border-primary hover:bg-primary/5 hover:shadow-md cursor-pointer"
                          : "border-muted opacity-60 cursor-not-allowed"
                      }`}
                      onClick={() => handleSelectType(credential.id, credential.status)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex-shrink-0">{credential.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold text-base text-foreground">{credential.name}</h3>
                            {credential.status === "coming-soon" && (
                              <span className="text-xs font-medium px-2 py-0.5 bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-full whitespace-nowrap">
                                Coming Soon
                              </span>
                            )}
                            {credential.status === "available" && (
                              <span className="text-xs font-medium px-2 py-0.5 bg-green-500/20 text-green-700 dark:text-green-400 rounded-full whitespace-nowrap">
                                Available
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{credential.description}</p>
                        </div>
                        {credential.status === "available" && (
                          <Button
                            size="sm"
                            className="ml-2 flex-shrink-0 whitespace-nowrap"
                            onClick={() => handleSelectType(credential.id, credential.status)}
                          >
                            Select
                          </Button>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-end pt-4 border-t border-border">
                <Button variant="outline" onClick={onClose} className="px-6">
                  Cancel
                </Button>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
