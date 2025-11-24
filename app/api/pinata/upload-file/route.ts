import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file size (10MB limit)
    const MAX_SIZE = 10 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2)
      return NextResponse.json({ error: `File size ${sizeMB}MB exceeds 10MB limit` }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: `Invalid file type. Expected image, got ${file.type}` }, { status: 400 })
    }

    // Get Pinata credentials
    const apiKey = process.env.PINATA_API_KEY
    const secretKey = process.env.PINATA_SECRET_KEY

    if (!apiKey || !secretKey) {
      return NextResponse.json({ error: "Pinata credentials not configured" }, { status: 500 })
    }

    // Create form data for Pinata
    const pinataFormData = new FormData()
    pinataFormData.append("file", file)

    // Upload to Pinata
    const pinataResponse = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers: {
        pinata_api_key: apiKey,
        pinata_secret_api_key: secretKey,
      },
      body: pinataFormData,
    })

    if (!pinataResponse.ok) {
      const errorText = await pinataResponse.text()
      return NextResponse.json({ error: `Pinata returned ${pinataResponse.status}` }, { status: pinataResponse.status })
    }

    const result = await pinataResponse.json()

    return NextResponse.json({
      success: true,
      ipfsHash: result.IpfsHash,
      ipfsUri: `ipfs://${result.IpfsHash}`,
      url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: `Upload error: ${message}` }, { status: 500 })
  }
}
