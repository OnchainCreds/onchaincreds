import { ethers } from "ethers"
import { CONTRACT_CONFIG, MINET_ABI, CELO_RPC_URL } from "@/lib/contract-config"

export async function POST(request: Request) {
  try {
    const { query, searchType } = await request.json()

    if (!query || query.trim() === "") {
      return Response.json({ error: "Query required" }, { status: 400 })
    }

    if (!process.env.NEXT_PUBLIC_MINET_CONTRACT_ADDRESS || process.env.NEXT_PUBLIC_MINET_CONTRACT_ADDRESS === "0x") {
      return Response.json({ error: "Contract not configured" }, { status: 500 })
    }

    const provider = new ethers.JsonRpcProvider(CELO_RPC_URL)
    const contract = new ethers.Contract(CONTRACT_CONFIG.address, MINET_ABI, provider)

    let credential: any = null

    if (searchType === "tokenId") {
      const tokenId = query.trim()

      try {
        const tokenIdBigInt = BigInt(tokenId)

        const owner = await contract.ownerOf(tokenIdBigInt)

        const tokenURI = await contract.tokenURI(tokenIdBigInt)

        let metadata = null
        try {
          let ipfsUrl = tokenURI
          // Handle both ipfs:// and direct IPFS hash formats
          if (tokenURI.startsWith("ipfs://")) {
            ipfsUrl = tokenURI.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
          } else if (tokenURI.startsWith("http")) {
            ipfsUrl = tokenURI
          }

          const response = await fetch(ipfsUrl, { timeout: 10000 })

          if (response.ok) {
            metadata = await response.json()
          }
        } catch (err) {
          // Metadata fetch failed, continue without it
        }

        credential = {
          tokenId: tokenIdBigInt.toString(),
          owner,
          metadataUri: tokenURI,
          metadata,
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err)

        if (errorMsg.includes("not found") || errorMsg.includes("revert")) {
          return Response.json({ error: "Token ID does not exist on the contract" }, { status: 404 })
        } else if (errorMsg.includes("invalid")) {
          return Response.json({ error: "Invalid token ID format" }, { status: 400 })
        } else {
          return Response.json({ error: `Token lookup failed: ${errorMsg}` }, { status: 500 })
        }
      }
    } else if (searchType === "address") {
      const address = query.trim()

      try {
        // Check if address is valid
        if (!ethers.isAddress(address)) {
          return Response.json({ error: "Invalid wallet address" }, { status: 400 })
        }

        const balance = await contract.balanceOf(address)
        const balanceNum = Number(balance)

        if (balanceNum === 0) {
          return Response.json({ error: "No credentials found for this address" }, { status: 404 })
        }

        const credentials = []
        try {
          for (let i = 0; i < balanceNum; i++) {
            try {
              const tokenId = await contract.tokenByIndex(BigInt(i))

              const tokenURI = await contract.tokenURI(tokenId)
              let metadata = null

              try {
                let ipfsUrl = tokenURI
                if (tokenURI.startsWith("ipfs://")) {
                  ipfsUrl = tokenURI.replace("ipfs://", "https://gateway.pinata.cloud/ipfs/")
                }
                const response = await fetch(ipfsUrl, { timeout: 10000 })
                if (response.ok) {
                  metadata = await response.json()
                }
              } catch (err) {
                // Metadata fetch failed, continue
              }

              credentials.push({
                tokenId: tokenId.toString(),
                owner: address,
                metadataUri: tokenURI,
                metadata,
              })
            } catch (err) {
              // Continue to next token if one fails
            }
          }
        } catch (err) {
          // Could not enumerate tokens
        }

        if (credentials.length > 0) {
          credential = {
            owner: address,
            balance: balanceNum,
            credentials: credentials,
            message: `Address owns ${balanceNum} credential(s)`,
          }
        } else {
          credential = {
            owner: address,
            balance: balanceNum,
            message: `Address owns ${balanceNum} credential(s)`,
          }
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err)
        return Response.json({ error: `Failed to lookup address: ${errorMsg}` }, { status: 500 })
      }
    }

    if (!credential) {
      return Response.json({ error: "Credential not found" }, { status: 404 })
    }

    return Response.json(credential, { status: 200 })
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    return Response.json({ error: `Verification failed: ${errorMsg}` }, { status: 500 })
  }
}
