"use server"

interface PinataUploadResult {
  ipfsHash: string
  ipfsUri: string
  url: string
}

export async function uploadImageToIPFS(fileData: ArrayBuffer, fileName: string): Promise<PinataUploadResult> {
  const PINATA_API_KEY = process.env.PINATA_API_KEY
  const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY

  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    throw new Error("Pinata credentials not configured")
  }

  try {
    const formData = new FormData()
    const blob = new Blob([fileData], { type: "image/png" })
    formData.append("file", blob, fileName)

    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Pinata upload failed: ${response.status} ${error}`)
    }

    const data = await response.json()

    return {
      ipfsHash: data.IpfsHash,
      ipfsUri: `ipfs://${data.IpfsHash}`,
      url: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed"
    throw new Error(`Failed to upload to Pinata: ${message}`)
  }
}

export async function uploadMetadataToIPFS(metadata: Record<string, any>): Promise<PinataUploadResult> {
  const PINATA_API_KEY = process.env.PINATA_API_KEY
  const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY

  if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
    throw new Error("Pinata credentials not configured")
  }

  try {
    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
      body: JSON.stringify(metadata),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Pinata upload failed: ${response.status} ${error}`)
    }

    const data = await response.json()

    return {
      ipfsHash: data.IpfsHash,
      ipfsUri: `ipfs://${data.IpfsHash}`,
      url: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed"
    throw new Error(`Failed to upload metadata to Pinata: ${message}`)
  }
}
