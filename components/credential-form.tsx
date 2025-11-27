"use client"

import { useState } from "react"
import { useWeb3ModalAccount } from "@web3modal/ethers/react"
import { useWeb3Contract } from "@/hooks/use-web3-contract"
import { usePinataUpload } from "@/hooks/use-pinata-upload"
import { WalletSelector } from "@/components/wallet-selector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Upload, AlertCircle, Loader2, ArrowRight, User, Mail, Phone, MapPin, BookOpen, Briefcase, Users, FileText } from 'lucide-react'
import type React from "react"

interface CredentialFormData {
  fullName: string
  profession: string
  location: string
  skills: string[]
  contact: {
    email: string
    phone: string
  }
  education: Array<{
    institution: string
    program: string
    startYear: string
    endYear: string
    description: string
  }>
  references: Array<{
    name: string
    company: string
    phone: string
    email: string
  }>
  walletAddress: string
  documentFile: File | null
}

interface CredentialFormProps {
  onMintSuccess: (result: any) => void
  onMintFailure: (error: string) => void
  isMinting: boolean
  setIsMinting: (value: boolean) => void
}

export function CredentialForm({
  onMintSuccess,
  onMintFailure,
  isMinting,
  setIsMinting,
}: CredentialFormProps) {
  const { address, isConnected } = useWeb3ModalAccount()
  const { mintCredential } = useWeb3Contract()
  const { uploadMetadata, uploadImage, isUploading } = usePinataUpload()

  const [formData, setFormData] = useState<CredentialFormData>({
    fullName: "",
    profession: "",
    location: "",
    skills: [],
    contact: {
      email: "",
      phone: "",
    },
    education: [{ institution: "", program: "", startYear: "", endYear: "", description: "" }],
    references: [],
    walletAddress: address || "",
    documentFile: null,
  })

  const [formError, setFormError] = useState<string | null>(null)
  const [skillInput, setSkillInput] = useState("")
  const [documentName, setDocumentName] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
      const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
      
      if (file.size > MAX_FILE_SIZE) {
        setFormError(`File size must be less than 10MB`)
        return
      }

      if (!ALLOWED_TYPES.includes(file.type)) {
        setFormError("Only PDF, images, and Word documents are allowed")
        return
      }

      setFormError(null)
      setFormData((prev) => ({ ...prev, documentFile: file }))
      setDocumentName(file.name)
    }
  }

  const addSkill = () => {
    if (skillInput.trim() && formData.skills.length < 10) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }))
      setSkillInput("")
    }
  }

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }))
  }

  const addEducation = () => {
    if (formData.education.length < 5) {
      setFormData((prev) => ({
        ...prev,
        education: [...prev.education, { institution: "", program: "", startYear: "", endYear: "", description: "" }],
      }))
    }
  }

  const removeEducation = (index: number) => {
    if (formData.education.length > 1) {
      setFormData((prev) => ({
        ...prev,
        education: prev.education.filter((_, i) => i !== index),
      }))
    }
  }

  const updateEducation = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu)),
    }))
  }

  const addReference = () => {
    if (formData.references.length < 3) {
      setFormData((prev) => ({
        ...prev,
        references: [...prev.references, { name: "", company: "", phone: "", email: "" }],
      }))
    }
  }

  const removeReference = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index),
    }))
  }

  const updateReference = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      references: prev.references.map((ref, i) => (i === index ? { ...ref, [field]: value } : ref)),
    }))
  }

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    // Validation
    if (!formData.fullName || !formData.profession || !formData.location) {
      setFormError("Please fill in all required fields: Full Name, Profession, and Location")
      return
    }

    if (!isConnected || !address) {
      setFormError("Please connect your wallet first")
      return
    }

    if (!formData.documentFile) {
      setFormError("Please upload a document (PDF, image, or Word)")
      return
    }

    setIsMinting(true)

    try {
      // Upload document to IPFS
      const documentResult = await uploadImage(formData.documentFile)
      if (!documentResult) {
        throw new Error("Failed to upload document to IPFS")
      }

      const privateMetadata = {
        documentIpfsUrl: documentResult.url,
        selfAttestedClaims: {
          fullName: formData.fullName,
          profession: formData.profession,
          location: formData.location,
          skills: formData.skills,
          email: formData.contact.email,
          phone: formData.contact.phone,
          education: formData.education.filter(e => e.institution || e.program),
        },
        references: formData.references.filter(r => r.name),
        walletAddress: address,
        mintedAt: new Date().toISOString(),
      }

      const metadata = {
        name: `${formData.fullName} - OnchainCred`,
        description: `Professional credential for ${formData.fullName}, ${formData.profession}`,
        image: documentResult.url,
        attributes: [
          { trait_type: "Full Name", value: formData.fullName },
          { trait_type: "Profession", value: formData.profession },
          { trait_type: "Location", value: formData.location },
          { trait_type: "Wallet Address", value: address },
          { trait_type: "Credential Status", value: "Verified" },
          { trait_type: "Private Metadata", value: JSON.stringify(privateMetadata) },
        ],
      }

      // Upload metadata to IPFS
      const metadataResult = await uploadMetadata(metadata)
      if (!metadataResult) {
        throw new Error("Failed to upload metadata to IPFS")
      }

      // Mint credential on blockchain
      const result = await mintCredential(metadataResult.ipfsUri)
      if (!result) {
        throw new Error("Failed to mint credential on blockchain")
      }

      onMintSuccess({
        success: true,
        transactionHash: result.transactionHash,
        tokenId: result.tokenId,
        blockNumber: result.blockNumber,
        metadataUri: metadataResult.ipfsUri,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : "Minting failed"
      setFormError(message)
      onMintFailure(message)
    } finally {
      setIsMinting(false)
    }
  }

  return (
    <form onSubmit={handleMint} className="space-y-6">
      {/* Wallet Connection Card */}
      <Card className="p-4 sm:p-6 border border-border bg-secondary/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-semibold">Wallet Connection (Required)</h3>
            <p className="text-sm text-muted-foreground">
              {isConnected ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` : "Connect your wallet to mint"}
            </p>
          </div>
          <WalletSelector />
        </div>
      </Card>

      {/* Error Alert */}
      {formError && (
        <Card className="p-4 border border-destructive/50 bg-destructive/10">
          <div className="flex gap-3 text-destructive">
            <AlertCircle size={20} className="flex-shrink-0" />
            <p className="text-sm">{formError}</p>
          </div>
        </Card>
      )}

      {/* Document Upload Section */}
      <Card className="p-4 sm:p-6 border border-border bg-card">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FileText size={20} className="text-primary" />
          Upload Document
        </h3>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Upload a PDF, image, or Word document to support your credential claims
          </p>
          <div className="border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary transition-colors">
            <input
              type="file"
              accept=".pdf,.doc,.docx,image/jpeg,image/png"
              onChange={handleDocumentUpload}
              className="w-full"
              disabled={isMinting || isUploading}
            />
          </div>
          {documentName && (
            <div className="p-3 bg-secondary/30 rounded-lg text-sm">
              <span className="font-medium">Selected:</span> {documentName}
            </div>
          )}
        </div>
      </Card>

      {/* Basic Information Section */}
      <Card className="p-4 sm:p-6 border border-border bg-card">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <User size={20} className="text-primary" />
          Personal Information
        </h3>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Full Name *"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
            disabled={isMinting || isUploading}
          />

          <Input
            type="text"
            placeholder="Profession / Job Title *"
            name="profession"
            value={formData.profession}
            onChange={handleInputChange}
            required
            disabled={isMinting || isUploading}
          />

          <Input
            type="text"
            placeholder="Location *"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
            disabled={isMinting || isUploading}
          />

          {/* Contact Information */}
          <div className="border-t border-border pt-4 space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Mail size={16} />
              Contact Information
            </h4>
            <Input
              type="email"
              placeholder="Email"
              value={formData.contact.email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, email: e.target.value },
                }))
              }
              disabled={isMinting || isUploading}
            />
            <Input
              type="tel"
              placeholder="Phone"
              value={formData.contact.phone}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, phone: e.target.value },
                }))
              }
              disabled={isMinting || isUploading}
            />
          </div>
        </div>
      </Card>

      {/* Skills Section */}
      <Card className="p-4 sm:p-6 border border-border bg-card">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Briefcase size={20} className="text-primary" />
          Skills
        </h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Add a skill..."
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  addSkill()
                }
              }}
              disabled={isMinting || isUploading || formData.skills.length >= 10}
            />
            <Button type="button" onClick={addSkill} size="sm" disabled={!skillInput.trim()}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill, idx) => (
              <div
                key={idx}
                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(idx)}
                  className="hover:opacity-70"
                  disabled={isMinting || isUploading}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Education Section */}
      <Card className="p-4 sm:p-6 border border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <BookOpen size={20} className="text-primary" />
            Education (Optional)
          </h3>
          <Button type="button" onClick={addEducation} size="sm" variant="outline" disabled={formData.education.length >= 5}>
            Add Entry
          </Button>
        </div>
        <div className="space-y-4">
          {formData.education.map((edu, idx) => (
            <div key={idx} className="space-y-3 p-4 bg-secondary/30 rounded-lg border border-border">
              <Input
                type="text"
                placeholder="Institution"
                value={edu.institution}
                onChange={(e) => updateEducation(idx, "institution", e.target.value)}
                disabled={isMinting || isUploading}
              />
              <Input
                type="text"
                placeholder="Program / Degree"
                value={edu.program}
                onChange={(e) => updateEducation(idx, "program", e.target.value)}
                disabled={isMinting || isUploading}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="text"
                  placeholder="Start Year"
                  value={edu.startYear}
                  onChange={(e) => updateEducation(idx, "startYear", e.target.value)}
                  disabled={isMinting || isUploading}
                />
                <Input
                  type="text"
                  placeholder="End Year"
                  value={edu.endYear}
                  onChange={(e) => updateEducation(idx, "endYear", e.target.value)}
                  disabled={isMinting || isUploading}
                />
              </div>
              <Textarea
                placeholder="Description"
                value={edu.description}
                onChange={(e) => updateEducation(idx, "description", e.target.value)}
                rows={2}
                disabled={isMinting || isUploading}
              />
              {formData.education.length > 1 && (
                <Button type="button" onClick={() => removeEducation(idx)} size="sm" variant="destructive" className="w-full">
                  Remove
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* References Section (Optional) */}
      <Card className="p-4 sm:p-6 border border-border bg-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Users size={20} className="text-primary" />
            References (Optional)
          </h3>
          <Button type="button" onClick={addReference} size="sm" variant="outline" disabled={formData.references.length >= 3}>
            Add Reference
          </Button>
        </div>
        <div className="space-y-4">
          {formData.references.map((ref, idx) => (
            <div key={idx} className="space-y-3 p-4 bg-secondary/30 rounded-lg border border-border">
              <Input
                type="text"
                placeholder="Reference Name"
                value={ref.name}
                onChange={(e) => updateReference(idx, "name", e.target.value)}
                disabled={isMinting || isUploading}
              />
              <Input
                type="text"
                placeholder="Company"
                value={ref.company}
                onChange={(e) => updateReference(idx, "company", e.target.value)}
                disabled={isMinting || isUploading}
              />
              <Input
                type="email"
                placeholder="Email"
                value={ref.email}
                onChange={(e) => updateReference(idx, "email", e.target.value)}
                disabled={isMinting || isUploading}
              />
              <Input
                type="tel"
                placeholder="Phone"
                value={ref.phone}
                onChange={(e) => updateReference(idx, "phone", e.target.value)}
                disabled={isMinting || isUploading}
              />
              <Button type="button" onClick={() => removeReference(idx)} size="sm" variant="destructive" className="w-full">
                Remove
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Mint Button */}
      <Button
        type="submit"
        disabled={!isConnected || isMinting || isUploading || !formData.documentFile}
        className="w-full py-6 text-lg font-bold"
        size="lg"
      >
        {isMinting || isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isUploading ? "Uploading..." : "Minting Credential..."}
          </>
        ) : (
          <>
            Mint Credential
            <ArrowRight className="ml-2" size={20} />
          </>
        )}
      </Button>
    </form>
  )
}
