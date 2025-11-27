import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const metadata = await request.json()

    const pinataApiKey = process.env.PINATA_API_KEY
    const pinataSecretKey = process.env.PINATA_SECRET_KEY

    if (!pinataApiKey || !pinataSecretKey) {
      return NextResponse.json({ error: "Pinata credentials not configured" }, { status: 500 })
    }

    const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metadata),
    })

    const responseText = await response.text()

    if (!response.ok) {
      throw new Error(`Pinata API error (${response.status}): ${responseText}`)
    }

    let result
    try {
      result = JSON.parse(responseText)
    } catch (e) {
      throw new Error("Invalid response from Pinata: could not parse JSON")
    }

    if (!result.IpfsHash) {
      throw new Error("Invalid response from Pinata: no IpfsHash returned")
    }

    return NextResponse.json({
      ipfsHash: result.IpfsHash,
      ipfsUri: `ipfs://${result.IpfsHash}`,
      url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to upload to Pinata"
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
