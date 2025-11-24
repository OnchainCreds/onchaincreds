"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import Link from "next/link"

interface CredentialTypeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const credentialTypes = [
  {
    id: "resume",
    name: "Resume",
    description: "Create an NFT credential from your professional resume",
    status: "available",
    icon: "📄",
  },
  {
    id: "cv",
    name: "Curriculum Vitae",
    description: "Mint your detailed CV as an on-chain credential",
    status: "coming-soon",
    icon: "📋",
  },
  {
    id: "certificate",
    name: "Academic Certificate",
    description: "Verify and mint your academic achievements",
    status: "coming-soon",
    icon: "🎓",
  },
]

export function CredentialTypeModal({ open, onOpenChange }: CredentialTypeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Credential Type</DialogTitle>
          <DialogDescription>Choose the type of credential you want to mint on-chain</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-6">
          <AnimatePresence>
            {credentialTypes.map((type, index) => (
              <motion.div
                key={type.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.1 }}
              >
                {type.status === "available" ? (
                  <Link href="/mint">
                    <button
                      onClick={() => onOpenChange(false)}
                      className="w-full p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer text-left group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="text-3xl mt-1">{type.icon}</div>
                          <div>
                            <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                              {type.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                          </div>
                        </div>
                        <Badge className="ml-2 bg-green-500/20 text-green-700 border-green-500/30 flex items-center gap-1">
                          <Check size={14} />
                          Available
                        </Badge>
                      </div>
                    </button>
                  </Link>
                ) : (
                  <div className="w-full p-4 rounded-lg border-2 border-border bg-muted/30 opacity-60 text-left">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl mt-1 opacity-50">{type.icon}</div>
                        <div>
                          <h3 className="font-semibold text-base text-muted-foreground">{type.name}</h3>
                          <p className="text-sm text-muted-foreground/70 mt-1">{type.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="ml-2 bg-amber-500/20 text-amber-700 border-amber-500/30">
                        Coming Soon
                      </Badge>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  )
}
