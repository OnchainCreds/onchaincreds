"use server"

interface PinataUploadResult {
  ipfsHash: string
  ipfsUri: string
  url: string
}

export async function uploadImageToIPFS(fileData: ArrayBuffer, fileName: string, mimeType: string = "image/png"): Promise<PinataUploadResult> {
  try {
    const apiKey = process.env.PINATA_API_KEY
    const secretKey = process.env.PINATA_SECRET_KEY

    if (!apiKey || !secretKey) {
      throw new Error("Pinata credentials not configured")
    }

    const uint8Array = new Uint8Array(fileData)
    const blob = new Blob([uint8Array], { type: mimeType })
    
    const formData = new FormData()
    formData.append("file", blob, fileName)

    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        pinata_api_key: apiKey,
        pinata_secret_api_key: secretKey,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Pinata error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    return {
      ipfsHash: data.IpfsHash,
      ipfsUri: `ipfs://${data.IpfsHash}`,
      url: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed"
    throw new Error(`Failed to upload image to IPFS: ${message}`)
  }
}

export async function uploadMetadataToIPFS(metadata: Record<string, any>): Promise<PinataUploadResult> {
  try {
    const apiKey = process.env.PINATA_API_KEY
    const secretKey = process.env.PINATA_SECRET_KEY

    if (!apiKey || !secretKey) {
      throw new Error("Pinata credentials not configured")
    }

    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: apiKey,
        pinata_secret_api_key: secretKey,
      },
      body: JSON.stringify(metadata),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Pinata error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()

    return {
      ipfsHash: data.IpfsHash,
      ipfsUri: `ipfs://${data.IpfsHash}`,
      url: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed"
    throw new Error(`Failed to upload metadata to IPFS: ${message}`)
  }
}
