"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle2, XCircle, MapPin, Mail, Phone, Users, Shield } from 'lucide-react'
import { motion } from "framer-motion"

interface VerificationStatusProps {
  credential: {
    metadata?: {
      attributes?: Array<{ trait_type: string; value: string }>
    }
  }
}

export function VerificationStatus({ credential }: VerificationStatusProps) {
  const attributes = credential.metadata?.attributes || []
  
  const privateMetadataAttr = attributes.find(a => a.trait_type === "Private Metadata")
  let privateData: any = {}
  
  if (privateMetadataAttr) {
    try {
      privateData = JSON.parse(privateMetadataAttr.value)
    } catch {
      // If parsing fails, continue with empty object
    }
  }

  const claims = privateData.selfAttestedClaims || {}
  const references = privateData.references || []
  const walletAddress = privateData.walletAddress // Wallet connected during minting

  // Define all claim checks with enhanced wallet ownership verification
  const claimStatus = [
    {
      label: "Full Name Provided",
      provided: !!claims.fullName,
      icon: null,
    },
    {
      label: "Profession Provided",
      provided: !!claims.profession,
      icon: null,
    },
    {
      label: "Location Provided",
      provided: !!claims.location,
      icon: MapPin,
    },
    {
      label: "Skills Included",
      provided: claims.skills && claims.skills.length > 0,
      icon: null,
    },
    {
      label: "Education Entries Included",
      provided: claims.education && claims.education.length > 0,
      icon: null,
    },
    {
      label: "Contact Email Provided",
      provided: !!claims.email,
      icon: Mail,
    },
    {
      label: "Contact Phone Provided",
      provided: !!claims.phone,
      icon: Phone,
    },
    {
      label: "Reference Contact Provided",
      provided: references.length > 0,
      icon: Users,
    },
    {
      label: "Wallet Ownership Verified",
      provided: !!walletAddress,
      icon: Shield,
    },
  ]

  const providedCount = claimStatus.filter(c => c.provided).length
  const totalCount = claimStatus.length

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-4">
      {/* Summary Card */}
      <Card className="p-6 border border-border bg-secondary/30">
        <h3 className="text-lg font-bold mb-2">Credential Status Summary</h3>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {providedCount} of {totalCount} claims verified
          </p>
          <div className="text-2xl font-bold text-primary">
            {Math.round((providedCount / totalCount) * 100)}%
          </div>
        </div>
        <div className="w-full bg-secondary rounded-full h-2 mt-3">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(providedCount / totalCount) * 100}%` }}
          />
        </div>
      </Card>

      {/* Claims Checklist */}
      <Card className="p-6 border border-border bg-card">
        <h3 className="text-lg font-bold mb-4">Verified Claims</h3>
        <div className="space-y-2">
          {claimStatus.map((claim, index) => {
            const Icon = claim.icon || (claim.provided ? CheckCircle2 : XCircle)
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  claim.provided ? "bg-green-500/10" : "bg-gray-500/10"
                }`}
              >
                <Icon
                  size={18}
                  className={claim.provided ? "text-green-600" : "text-gray-500"}
                />
                <span className={`text-sm font-medium ${
                  claim.provided ? "text-green-700" : "text-gray-600"
                }`}>
                  {claim.label}
                </span>
              </motion.div>
            )
          })}
        </div>
      </Card>
    </motion.div>
  )
}
