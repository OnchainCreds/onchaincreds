"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { CredentialTypeSelectorModal } from "@/components/credential-type-selector-modal"

interface CredentialModalContextType {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const CredentialModalContext = createContext<CredentialModalContextType | undefined>(undefined)

export function CredentialModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <CredentialModalContext.Provider
      value={{
        isOpen,
        openModal: () => setIsOpen(true),
        closeModal: () => setIsOpen(false),
      }}
    >
      {children}
      <CredentialTypeSelectorModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </CredentialModalContext.Provider>
  )
}

export function useCredentialModal() {
  const context = useContext(CredentialModalContext)
  if (context === undefined) {
    throw new Error("useCredentialModal must be used within CredentialModalProvider")
  }
  return context
}
