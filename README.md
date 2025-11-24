# OnchainCreds - Blockchain Credential Verification Platform

## Overview

OnchainCreds is a decentralized, blockchain-powered platform that allows users to mint, verify, and showcase digital credentials and resumes as NFTs on the Celo blockchain. Users can own their credentials transparently, share verifiable proof of their accomplishments, and maintain complete control over their professional identity.

## Key Features

- **Mint Credentials as NFTs**: Convert your resume or professional profile into an immutable NFT on the blockchain
- **Multiple Template Designs**: Choose from 4 professionally designed credential templates with unique aesthetics
- **Photo Support**: Upload profile photos for templates that support them
- **Verify Credentials**: Search for and verify any minted credential by token ID or wallet address
- **IPFS Storage**: All credentials and metadata are stored on IPFS for decentralized persistence
- **Web3 Integration**: Built with Celo blockchain for low-cost transactions
- **Wallet Connect**: Seamless connection with MetaMask and other Web3 wallets

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Components**: Shadcn/ui
- **Styling**: Tailwind CSS v4
- **Web3 Integration**: ethers.js, wagmi, Web3Modal
- **Canvas Rendering**: HTML5 Canvas for credential generation

### Backend
- **Runtime**: Next.js Server Actions & API Routes
- **Blockchain**: Celo Mainnet (Minets)
- **Smart Contracts**: ERC-721 standard NFT contract
- **IPFS**: Pinata for decentralized storage
- **RPC Provider**: Celo RPC endpoints

## Credential Templates

### 1. **Professional Blue** (template-1)
- Style: Corporate with gradient headers
- Colors: Blue accents with professional layout
- Features: Supports all fields including photo

### 2. **Minimal Purple** (template-2)
- Style: Clean minimalist design
- Colors: Purple accents on white background
- Features: Elegant typography, minimal decoration

### 3. **Executive Professional** (template-3)
- Style: Classic framed design
- Colors: Navy blue with professional borders
- Features: Structured sections with clear dividers

### 4. **Modern Sidebar** (template-4)
- Style: Two-column layout with sidebar
- Colors: Gold accents with modern design
- Features: Sidebar with initials, expert highlighting

## Project Structure

\`\`\`
OnchainCreds/
├── app/
│   ├── api/pinata/              # IPFS upload endpoints
│   ├── actions/                 # Server actions for uploads & verification
│   ├── mint/                    # Credential minting page
│   ├── verify/                  # Credential verification page
│   ├── templates/               # Browse templates page
│   ├── about/                   # About page
│   ├── layout.tsx               # Root layout with metadata
│   └── globals.css              # Global styling
├── components/
│   ├── mint-form.tsx            # Minting form component
│   ├── mint-result-modal.tsx    # Success modal
│   ├── credential-preview.tsx   # Live credential preview
│   ├── credential-display.tsx   # Credential display
│   ├── header.tsx               # Navigation header
│   ├── footer.tsx               # Footer component
│   └── ui/                      # Shadcn UI components
├── hooks/
│   ├── use-credential-image.ts  # Canvas rendering for credentials
│   ├── use-pinata-upload.ts     # Pinata upload logic
│   ├── use-web3-contract.ts     # Smart contract interaction
│   ├── use-web3-provider.ts     # Web3 provider setup
│   └── use-contract.ts          # Contract utilities
├── lib/
│   └── contract-config.ts       # Smart contract configuration
├── public/
│   ├── onchain-creds-logo.png   # Project logo
│   ├── og-image.png             # Social sharing preview image
│   └── icon.*                   # Favicon variants
└── package.json                 # Dependencies and scripts
\`\`\`

## Installation & Setup

### Prerequisites
- Node.js 18.17 or later
- npm or yarn
- MetaMask or Web3-compatible wallet

### Local Development

1. **Clone and install dependencies**:
   \`\`\`bash
   git clone <repository-url>
   cd onchain-creds
   npm install
   \`\`\`

2. **Configure environment variables** in \`.env.local\`:
   \`\`\`
   NEXT_PUBLIC_CELO_RPC_URL=https://forno.celo.org
   NEXT_PUBLIC_MINET_CONTRACT_ADDRESS=<your-deployed-contract-address>
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=<your-wallet-connect-id>
   PINATA_API_KEY=<your-pinata-api-key>
   PINATA_SECRET_KEY=<your-pinata-secret-key>
   \`\`\`

3. **Start development server**:
   \`\`\`bash
   npm run dev
   \`\`\`
   Open [http://localhost:3000](http://localhost:3000)

## How to Use

### Minting a Credential

1. Navigate to Mint page
2. Connect your wallet
3. Fill in credential details (name, profession, summary, skills, experience, education)
4. Upload profile photo (optional, depends on template)
5. Select your preferred template
6. Review preview and click "Mint Resume on Celo"
7. Sign transaction in your wallet
8. Success! Your credential is now minted and stored on-chain

### Verifying a Credential

1. Navigate to Verify page
2. Search by Token ID or Wallet Address
3. View the verified credential with full details

### Browsing Templates

1. Navigate to Templates page
2. View all 4 available credential designs
3. See which templates support photo uploads
4. Select your preferred template when creating a credential

## API Reference

### POST /api/pinata/upload-file
Uploads a file (image) to IPFS via Pinata

**Request**: FormData with file
**Response**: `{ ipfsHash, url, ipfsUri }`

### POST /api/pinata/upload
Uploads metadata JSON to IPFS via Pinata

**Request**: `{ metadata }`
**Response**: `{ ipfsHash, url, ipfsUri }`

### POST /app/actions/verify.ts (Server Action)
Verifies credentials by token ID or wallet address

**Parameters**: `query, searchType`
**Response**: Credential data with metadata

## Smart Contract

### ERC-721 Standard
- Implements NFT credential minting
- Supports token enumeration
- Stores metadata URIs pointing to IPFS

### Key Functions
- `mint(address to, string memory tokenUri)`: Mint new credential
- `tokenURI(uint256 tokenId)`: Get IPFS metadata URI
- `ownerOf(uint256 tokenId)`: Get credential owner
- `balanceOf(address owner)`: Get credential count

## Troubleshooting

### "Credential not found"
- Verify token ID is correct
- Check wallet address owns the credential
- Confirm contract address in environment variables

### "Failed to upload to IPFS"
- Check Pinata API keys are set correctly
- Ensure file size is under 10MB
- Verify file format (PNG, JPG, GIF)

### "Connection failed"
- Confirm wallet is connected
- Verify you're on Celo Mainnet (Minets)
- Ensure sufficient funds for gas

### Template text is cut off
- Text automatically wraps and expands canvas height
- Maximum 6 experience and 4 education items display fully
- Longer text is handled with ellipsis

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository in Vercel dashboard
3. Set environment variables
4. Deploy!

### Smart Contract Deployment

Use Hardhat or Truffle to deploy to Celo Mainnet (Minets):
\`\`\`bash
npx hardhat run scripts/deploy.js --network celo-mainnet
\`\`\`

## Security Considerations

- ✅ ERC-721 standard for secure NFT implementation
- ✅ IPFS storage ensures immutability
- ✅ Server-side file validation before upload
- ✅ File type and size validation
- ✅ Credentials signed on-chain
- ⚠️ Users responsible for wallet security
- ⚠️ Always verify transactions before signing

## License

MIT License - Open source and available for modification

## Support

For issues or questions:
- Open an issue on GitHub
- Check documentation and troubleshooting section
- Review error messages for guidance

## Roadmap

- [ ] Multi-chain support (Ethereum, Polygon)
- [ ] Additional credential templates
- [ ] Batch minting for institutions
- [ ] Credential revocation mechanism
- [ ] Enhanced search and filtering
- [ ] Mobile app version
- [ ] DAO governance for templates
