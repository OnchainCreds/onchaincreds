"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import type { CredentialData } from "@/hooks/use-credential-image"

interface CredentialPreviewProps {
  data: CredentialData
  imageUrl?: string | null
}

export function CredentialPreview({ data, imageUrl }: CredentialPreviewProps) {
  const [displayImage, setDisplayImage] = useState<string | null>(imageUrl || null)

  useEffect(() => {
    setDisplayImage(imageUrl)
  }, [imageUrl])

  const templates = {
    "template-1": "from-blue-600 to-cyan-400",
    "template-2": "from-purple-600 to-pink-400",
    "template-3": "from-gray-700 to-gray-400",
    "template-4": "from-amber-700 to-yellow-400",
  } as Record<string, string>

  const gradientClass = templates[data.template] || templates["template-1"]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full flex flex-col items-center justify-center bg-secondary/30 rounded-lg p-4"
    >
      {displayImage ? (
        <div className="w-full max-w-sm">
          <img
            src={displayImage || "/placeholder.svg"}
            alt="Credential Preview"
            className="w-full rounded-lg shadow-lg border border-border"
          />
        </div>
      ) : (
        <Card className="w-full max-w-sm p-8 space-y-6">
          {/* Gradient header */}
          <div className={`h-32 rounded-lg bg-gradient-to-br ${gradientClass}`} />

          {/* Content placeholder */}
          <div className="space-y-4">
            <div className="h-6 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />

            <div className="pt-4 space-y-2">
              <div className="h-4 bg-muted rounded w-1/4" />
              <div className="h-3 bg-muted rounded" />
              <div className="h-3 bg-muted rounded w-5/6" />
            </div>

            <div className="flex gap-2 pt-4 flex-wrap">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-6 w-16 bg-muted rounded" />
              ))}
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  )
}
