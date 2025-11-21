import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Credential data structure
export const credentialDataSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  title: z.string().min(2, "Title is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  skills: z.array(z.string()).min(1, "Add at least one skill"),
  experience: z.string().min(10, "Experience description is required"),
  education: z.string().min(10, "Education details are required"),
  portfolioUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export type CredentialData = z.infer<typeof credentialDataSchema>;

// Template types
export type TemplateType = "professional" | "modern" | "creative";

export interface TemplateConfig {
  id: TemplateType;
  name: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
}

// NFT Metadata structure (ERC721 standard)
export interface NFTMetadata {
  name: string;
  description: string;
  image: string; // IPFS URL or data URL
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

// Minting result
export interface MintResult {
  tokenId: string;
  imageUrl: string;
  transactionHash: string;
  credentialUrl: string;
  blockExplorerUrl: string;
}

// Stored credentials (for tracking minted credentials)
export const credentials = pgTable("credentials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull(),
  tokenId: text("token_id").notNull(),
  credentialData: jsonb("credential_data").notNull().$type<CredentialData>(),
  templateType: text("template_type").notNull().$type<TemplateType>(),
  imageUrl: text("image_url").notNull(),
  metadataUrl: text("metadata_url").notNull(),
  transactionHash: text("transaction_hash").notNull(),
  mintedAt: timestamp("minted_at").defaultNow().notNull(),
});

export const insertCredentialSchema = createInsertSchema(credentials).omit({
  id: true,
  mintedAt: true,
});

export type InsertCredential = z.infer<typeof insertCredentialSchema>;
export type Credential = typeof credentials.$inferSelect;

// Wallet connection state
export interface WalletState {
  address: string | null;
  chainId: number | null;
  isConnected: boolean;
  isCorrectNetwork: boolean;
}

// -------------------------------
// ✅ CELO MAINNET CONFIGURATION
// -------------------------------
export const CELO_MAINNET_CONFIG = {
  chainId: "0xa4ec", // 42220 in hex
  chainIdDecimal: 42220,
  chainName: "Celo Mainnet",
  nativeCurrency: {
    name: "CELO",
    symbol: "CELO",
    decimals: 18,
  },
  rpcUrls: ["https://forno.celo.org"],
  blockExplorerUrls: ["https://celoscan.io"],
};

// -------------------------------
// ✅ SMART CONTRACT CONFIGURATION
// -------------------------------
export const CONTRACT_CONFIG = {
  address: "0x97161a87229d3A8E0Bd2Fbcd408eE6c9f65823ae", // Your mainnet contract
  abi: [
    "function mint(address to, string memory tokenURI) public returns (uint256)",
    "function balanceOf(address owner) public view returns (uint256)",
    "function ownerOf(uint256 tokenId) public view returns (address)",
    "function tokenURI(uint256 tokenId) public view returns (string memory)",
    "function isTransferable() public pure returns (bool)",
  ],
};
