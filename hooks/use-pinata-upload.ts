"use client"

import { useState, useCallback } from "react"
import { uploadImageToIPFS, uploadMetadataToIPFS } from "@/app/actions/pinata"

interface PinataUploadResult {
  ipfsHash: string
  ipfsUri: string
  url: string
}

export function usePinataUpload() {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const uploadMetadata = useCallback(async (metadata: Record<string, any>): Promise<PinataUploadResult | null> => {
    setIsUploading(true)
    setError(null)

    try {
      const result = await uploadMetadataToIPFS(metadata)
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : "Metadata upload failed"
      setError(message)
      return null
    } finally {
      setIsUploading(false)
    }
  }, [])

  const uploadImage = useCallback(async (file: File): Promise<PinataUploadResult | null> => {
    setIsUploading(true)
    setError(null)

    try {
      if (!file) {
        throw new Error("No file provided")
      }

      const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds 10MB limit (${(file.size / 1024 / 1024).toFixed(2)}MB)`)
      }

      if (!file.type.startsWith("image/")) {
        throw new Error(`Invalid file type: ${file.type}. Only image files are allowed`)
      }

      const arrayBuffer = await file.arrayBuffer()
      const result = await uploadImageToIPFS(arrayBuffer, file.name, file.type)

      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : "Image upload failed"
      setError(message)
      return null
    } finally {
      setIsUploading(false)
    }
  }, [])

  return {
    uploadMetadata,
    uploadImage,
    isUploading,
    error,
  }
}
