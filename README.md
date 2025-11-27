# OnchainCreds - Verified On-Chain Credentials Protocol

A decentralized protocol for creating, verifying, and managing professional credentials as immutable on-chain NFTs with transparent claim attestation and cryptographic proof of merit.

## Overview

OnchainCreds is a blockchain-based credential verification protocol built on the Celo network. The protocol enables secure credential minting with transparent claim verification, utilizing wallet-based identity anchoring and immutable on-chain records. Each credential captures verified professional information with clear attestation status.

## Core Features

- **Document Evidence**: Support for PDF, images, and Word documents as supporting documentation
- **Claim Verification**: Transparent attestation of professional claims with clear verification status
- **Cryptographic Identity**: Wallet address serves as cryptographic identity anchor and ownership verification
- **Immutable Records**: All credentials stored on Celo blockchain with IPFS pinning
- **Privacy Architecture**: Sensitive data maintained in private metadata within IPFS
- **Multi-Source Verification**: Search and verify credentials by Token ID, Wallet Address, or Transaction Hash

## Technical Stack

### Frontend Architecture
- Next.js 16 with TypeScript
- Shadcn/ui component library
- Tailwind CSS v4 for styling
- Web3 integration via ethers.js and Web3Modal

### Backend Infrastructure
- Next.js Server Actions and API Routes
- Celo blockchain network
- ERC-721 standard smart contracts
- Pinata IPFS for decentralized storage
- Celo RPC endpoints for blockchain interaction

## Protocol Architecture

### Credential Issuance

1. User submits supporting documentation
2. User attests to professional information:
   - Full Name (required)
   - Professional Title (required)
   - Geographic Location (required)
   - Contact Information
   - Skills inventory
   - Educational background (optional)
   - Professional references (optional)
3. Wallet connection provides cryptographic identity anchor
4. Credential metadata compiled and stored in IPFS
5. Credential minted as ERC-721 NFT on Celo mainnet

### Credential Verification

1. Query credentials via Token ID, Wallet Address, or Transaction Hash
2. Retrieve on-chain NFT metadata and verification status
3. Display claim attestation with verified/unverified indicators
4. Validate wallet ownership through blockchain record

## Project Structure

\`\`\`
OnchainCreds/
├── app/
│   ├── api/
│   │   ├── pinata/              # IPFS file operations
│   │   └── verify/              # Credential verification
│   ├── actions/
│   │   └── verify.ts            # Verification logic
│   ├── mint/                    # Credential creation
│   ├── verify/                  # Credential lookup
│   ├── about/                   # Protocol information
│   ├── developer/               # Developer documentation
│   └── globals.css              # Theme and styling
├── components/
│   ├── credential-form.tsx      # Credential submission
│   ├── credential-type-selector-modal.tsx
│   ├── verification-status.tsx  # Attestation display
│   ├── header.tsx               # Navigation
│   ├── footer.tsx               # Footer
│   └── ui/                      # Component library
├── hooks/
│   ├── use-pinata-upload.ts     # IPFS operations
│   ├── use-web3-contract.ts     # Contract interaction
│   └── use-mobile.ts            # Responsive utilities
├── lib/
│   ├── contract-config.ts       # Deployment configuration
│   ├── web3-utils.ts            # Blockchain utilities
│   └── utils.ts                 # General utilities
└── public/                      # Static assets
\`\`\`

## Setup and Deployment

### Prerequisites
- Node.js 18.17 or higher
- npm or yarn package manager
- Celo-compatible Web3 wallet

### Installation

1. Clone repository and install dependencies:
\`\`\`bash
git clone <repository-url>
cd onchain-creds
npm install
\`\`\`

2. Configure environment variables in `.env.local`:
\`\`\`
NEXT_PUBLIC_CELO_RPC_URL=https://forno.celo.org
NEXT_PUBLIC_MINET_CONTRACT_ADDRESS=<contract-address>
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=<wallet-id>
PINATA_API_KEY=<api-key>
PINATA_SECRET_KEY=<secret-key>
\`\`\`

3. Start development server:
\`\`\`bash
npm run dev
\`\`\`

Access application at http://localhost:3000

### Production Deployment

Deploy to Vercel:
1. Connect GitHub repository to Vercel
2. Configure environment variables in dashboard
3. Deployment triggers automatically on push

## API Endpoints

### POST /api/verify
Retrieves and verifies credentials on-chain

Query Parameters:
- `query`: Credential identifier (Token ID, wallet address, or transaction hash)
- `searchType`: Query type ("tokenId" | "address" | "txHash")

### POST /api/pinata/upload
Uploads metadata JSON to IPFS network

### POST /api/pinata/upload-file
Uploads supporting documentation files to IPFS

## Smart Contract Interface

ERC-721 based credential NFT:
- `mint()`: Create new credential
- `tokenURI()`: Retrieve IPFS metadata reference
- `ownerOf()`: Verify credential ownership
- `balanceOf()`: Query user credential count

## Data Architecture

Credential metadata includes:
- **On-Chain**: Public verification status and attestation summary
- **IPFS Private**: Complete document references, claim details, and wallet records

## Troubleshooting

### Credential Not Found
Verify token ID, wallet address, or transaction hash accuracy. Confirm contract address in configuration.

### Document Upload Failure
Ensure file size under 10MB. Supported formats: PDF, JPG, PNG, DOC, DOCX. Verify Pinata API credentials.

### Wallet Connection Issues
Confirm wallet is on Celo Mainnet. Verify sufficient gas balance. Check RPC endpoint availability.

## Security Considerations

- Credentials secured via ERC-721 standard implementation
- IPFS ensures immutability of stored data
- Server-side validation of all uploads
- Private metadata stored securely in IPFS
- Users maintain sole custody of wallet keys

## License

All Rights Reserved.

## Support

For technical assistance, please open a GitHub issue or contact the development team.

## Future Development

- Multi-chain credential support
- Enhanced revocation mechanisms
- Organizational batch operations
- Mobile application
- Advanced search capabilities
- Credential template system
\`\`\`

Perfect! I've fixed all three issues:

1. **Next.js Config** - Removed the unsupported `eslint` configuration option that was causing Vercel build warnings
2. **CSS Import** - Simplified the Tailwind CSS v4 import to properly initialize LightningCSS without fetching external resources
3. **README** - Completely rewritten as a professional technical documentation that explains the protocol architecture without exposing sensitive implementation details or using emojis

The build should now deploy cleanly without warnings, and the preview console will no longer show the LightningCSS error.
