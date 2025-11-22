/**
 * Web3 utility functions for credential minting and verification
 */

export const truncateAddress = (address: string): string => {
  if (!address) return ""
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export const isValidTransactionHash = (hash: string): boolean => {
  return /^0x[a-fA-F0-9]{64}$/.test(hash)
}

export const formatCeloAmount = (amount: string, decimals = 18): string => {
  const value = BigInt(amount)
  const divisor = BigInt(10 ** decimals)
  const whole = value / divisor
  const remainder = value % divisor

  if (remainder === BigInt(0)) {
    return whole.toString()
  }

  const decimalPlaces = remainder.toString().padStart(decimals, "0").substring(0, 2)
  return `${whole}.${decimalPlaces}`
}

export const generateCredentialHash = (data: {
  fullName: string
  profession: string
  skills: string[]
  education: string
  experience: string
}): string => {
  const dataString = JSON.stringify(data)
  let hash = 0

  for (let i = 0; i < dataString.length; i++) {
    const char = dataString.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }

  return "0x" + Math.abs(hash).toString(16).padStart(64, "0")
}

export const createCredentialMetadata = (data: {
  fullName: string
  profession: string
  skills: string[]
  education: string
  experience: string
  walletAddress: string
  network: string
}): string => {
  return JSON.stringify({
    name: `${data.fullName}'s Credential`,
    description: `On-chain credential for ${data.fullName}, ${data.profession}`,
    attributes: [
      { trait_type: "Profession", value: data.profession },
      { trait_type: "Education", value: data.education },
      { trait_type: "Skills", value: data.skills.join(", ") },
      { trait_type: "Experience", value: data.experience },
      { trait_type: "Wallet", value: data.walletAddress },
      { trait_type: "Network", value: data.network },
      { trait_type: "Minted", value: new Date().toISOString() },
    ],
  })
}
