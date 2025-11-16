"use server"

export async function verifyCredential(query: string, searchType: "tokenId" | "address" | "txHash") {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}/api/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, searchType }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { error: data.error || "Verification failed" }
    }

    return data
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Verification failed" }
  }
}
