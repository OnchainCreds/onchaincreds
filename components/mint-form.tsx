"use client"

import { useState, useEffect, useRef } from "react"
import { useWeb3ModalAccount } from "@web3modal/ethers/react"
import { useWeb3Contract } from "@/hooks/use-web3-contract"
import { usePinataUpload } from "@/hooks/use-pinata-upload"
import { useCredentialImage } from "@/hooks/use-credential-image"
import { WalletSelector } from "@/components/wallet-selector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Upload, AlertCircle, Loader2, ArrowRight, User, Mail, Phone, MapPin, BookOpen, Briefcase, Users } from 'lucide-react'
import type React from "react"
import type { CredentialData } from "@/hooks/use-credential-image"

interface ResumeFormData {
  // Left Panel
  profileImage: File | null
  name: string
  profession: string
  aboutMe: string
  skills: string[]
  contact: {
    phone: string
    email: string
    location: string
  }
  // Right Panel
  education: Array<{
    school: string
    program: string
    description: string
    startYear: string
    endYear: string
  }>
  experience: Array<{
    company: string
    role: string
    description: string
    startYear: string
    endYear: string
  }>
  references: Array<{
    fullName: string
    company: string
    email: string
    phone: string
  }>
}

interface MintFormProps {
  selectedTemplate: string
  onSubmit: (data: CredentialData, image: string | null) => void
  onMintSuccess: (result: any) => void
  onMintFailure: (error: string) => void
  isMinting: boolean
  setIsMinting: (value: boolean) => void
}

export function MintForm({
  selectedTemplate,
  onSubmit,
  onMintSuccess,
  onMintFailure,
  isMinting,
  setIsMinting,
}: MintFormProps) {
  const { isConnected } = useWeb3ModalAccount()
  const { mintCredential } = useWeb3Contract()
  const { uploadMetadata, uploadImage, isUploading } = usePinataUpload()
  const { generateCredentialImage, imageUrl, dataURLToFile } = useCredentialImage()

  const [formData, setFormData] = useState<ResumeFormData>({
    profileImage: null,
    name: "",
    profession: "",
    aboutMe: "",
    skills: [],
    contact: {
      phone: "",
      email: "",
      location: "",
    },
    education: [{ school: "", program: "", description: "", startYear: "", endYear: "" }],
    experience: [{ company: "", role: "", description: "", startYear: "", endYear: "" }],
    references: [{ fullName: "", company: "", email: "", phone: "" }],
  })

  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [credentialImage, setCredentialImage] = useState<string | null>(null)
  const [skillInput, setSkillInput] = useState("")

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const templateSupportsPhoto = !["template-3", "template-5", "template-6"].includes(selectedTemplate)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
      if (file.size > MAX_FILE_SIZE) {
        setFormError(`File size must be less than 5MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB`)
        return
      }

      if (!file.type.startsWith("image/")) {
        setFormError("Please select a valid image file (PNG, JPG, etc.)")
        return
      }

      setFormError(null)
      setFormData((prev) => ({ ...prev, profileImage: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addSkill = () => {
    if (skillInput.trim()) {
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
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, { school: "", program: "", description: "", startYear: "", endYear: "" }],
    }))
  }

  const removeEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }))
  }

  const updateEducation = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((edu, i) => (i === index ? { ...edu, [field]: value } : edu)),
    }))
  }

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [...prev.experience, { company: "", role: "", description: "", startYear: "", endYear: "" }],
    }))
  }

  const removeExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }))
  }

  const updateExperience = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp)),
    }))
  }

  const addReference = () => {
    setFormData((prev) => ({
      ...prev,
      references: [...prev.references, { fullName: "", company: "", email: "", phone: "" }],
    }))
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

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(async () => {
      if (!formData.name || !formData.profession) {
        return
      }

      const credentialData: CredentialData = {
        fullName: formData.name,
        profession: formData.profession,
        summary: formData.aboutMe,
        skills: formData.skills,
        education: formatEducation(formData.education),
        experience: formatExperience(formData.experience),
        references: formatReferences(formData.references),
        photoUrl: photoPreview,
        template: selectedTemplate,
      }

      const image = await generateCredentialImage(credentialData)
      if (image) {
        setCredentialImage(image)
        onSubmit(credentialData, image)
      }
    }, 800)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [formData, photoPreview, selectedTemplate, generateCredentialImage, onSubmit])

  const formatEducation = (education: ResumeFormData["education"]) => {
    return education
      .filter((e) => e.school || e.program)
      .map((e) => `${e.school} - ${e.program} (${e.startYear}-${e.endYear})\n${e.description}`)
      .join("\n\n")
  }

  const formatExperience = (experience: ResumeFormData["experience"]) => {
    return experience
      .filter((e) => e.company || e.role)
      .map((e) => `${e.role} at ${e.company} (${e.startYear}-${e.endYear})\n${e.description}`)
      .join("\n\n")
  }

  const formatReferences = (references: ResumeFormData["references"]) => {
    return references
      .filter((r) => r.fullName)
      .map((r) => `${r.fullName}, ${r.company}\n${r.email} | ${r.phone}`)
      .join("\n\n")
  }

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!formData.name || !formData.profession) {
      setFormError("Please fill in all required fields (Name and Profession)")
      return
    }

    if (!isConnected) {
      setFormError("Please connect your wallet first")
      return
    }

    if (!credentialImage) {
      setFormError("Please generate a preview first")
      return
    }

    setIsMinting(true)

    try {
      const credentialData: CredentialData = {
        fullName: formData.name,
        profession: formData.profession,
        summary: formData.aboutMe,
        skills: formData.skills,
        education: formatEducation(formData.education),
        experience: formatExperience(formData.experience),
        references: formatReferences(formData.references),
        photoUrl: photoPreview,
        template: selectedTemplate,
      }

      const credentialImageFile = dataURLToFile(credentialImage, `${formData.name.replace(/\s+/g, "-")}-credential.png`)
      const credentialImageResult = await uploadImage(credentialImageFile)

      if (!credentialImageResult) {
        throw new Error("Failed to upload credential image to IPFS")
      }

      const credentialImageUrl = credentialImageResult.url

      let photoIpfsUrl = null
      if (formData.profileImage) {
        const photoResult = await uploadImage(formData.profileImage)
        if (!photoResult) {
          throw new Error("Failed to upload profile photo to IPFS")
        }
        photoIpfsUrl = photoResult.url
      }

      const metadata = {
        name: `${formData.name} - OnchainCred`,
        description: `Professional credential for ${formData.name}, ${formData.profession}`,
        image: credentialImageUrl,
        attributes: [
          { trait_type: "Full Name", value: formData.name },
          { trait_type: "Profession", value: formData.profession },
          { trait_type: "About Me", value: formData.aboutMe },
          { trait_type: "Skills", value: formData.skills.join(", ") },
          { trait_type: "Phone", value: formData.contact.phone },
          { trait_type: "Email", value: formData.contact.email },
          { trait_type: "Location", value: formData.contact.location },
          { trait_type: "Education", value: formatEducation(formData.education) },
          { trait_type: "Experience", value: formatExperience(formData.experience) },
          { trait_type: "References", value: formatReferences(formData.references) },
          { trait_type: "Photo", value: photoIpfsUrl || "none" },
          { trait_type: "Template", value: selectedTemplate },
        ],
      }

      const metadataResult = await uploadMetadata(metadata)
      if (!metadataResult) {
        throw new Error("Failed to upload metadata to IPFS")
      }

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
      <Card className="p-6 border border-border bg-secondary/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="font-semibold">Wallet Connection</h3>
            <p className="text-sm text-muted-foreground">
              {isConnected ? "Wallet Connected" : "Connect your Celo wallet to mint"}
            </p>
          </div>
          <WalletSelector />
        </div>
      </Card>

      {formError && (
        <Card className="p-4 border border-destructive/50 bg-destructive/10">
          <div className="flex gap-3 text-destructive">
            <AlertCircle size={20} className="flex-shrink-0" />
            <p className="text-sm">{formError}</p>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* LEFT PANEL */}
        <div className="space-y-6 bg-card border border-border rounded-lg p-6">
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <User size={20} className="text-primary" />
              Left Panel
            </h3>
          </div>

          {/* Profile Photo */}
          {templateSupportsPhoto && (
            <div className="space-y-3">
              <label className="text-sm font-semibold flex items-center gap-2">
                <Upload size={16} />
                Profile Photo
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full"
                  disabled={isMinting || isUploading}
                />
              </div>
              {photoPreview && (
                <img
                  src={photoPreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-24 h-24 rounded-lg object-cover border border-border"
                />
              )}
            </div>
          )}

          {/* Name */}
          <Input
            type="text"
            placeholder="Full Name *"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            required
            disabled={isMinting || isUploading}
          />

          {/* Profession */}
          <Input
            type="text"
            placeholder="Profession / Job Title *"
            value={formData.profession}
            onChange={(e) => setFormData((prev) => ({ ...prev, profession: e.target.value }))}
            required
            disabled={isMinting || isUploading}
          />

          {/* About Me */}
          <div>
            <label className="text-sm font-medium mb-2 block">About Me</label>
            <Textarea
              placeholder="Brief professional summary..."
              value={formData.aboutMe}
              onChange={(e) => setFormData((prev) => ({ ...prev, aboutMe: e.target.value }))}
              rows={3}
              disabled={isMinting || isUploading}
            />
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <label className="text-sm font-semibold flex items-center gap-2">
              <Briefcase size={16} />
              Skills (5-6 recommended)
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Add skill..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addSkill()
                  }
                }}
                disabled={isMinting || isUploading || formData.skills.length >= 6}
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

          {/* Contact */}
          <div className="space-y-3 border-t border-border pt-4">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Mail size={16} />
              Contact
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
            <Input
              type="text"
              placeholder="Location"
              value={formData.contact.location}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  contact: { ...prev.contact, location: e.target.value },
                }))
              }
              disabled={isMinting || isUploading}
            />
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="space-y-6 bg-card border border-border rounded-lg p-6">
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-primary" />
              Right Panel
            </h3>
          </div>

          {/* Education */}
          <div className="space-y-3 border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <BookOpen size={16} />
                Education (1-2 items)
              </h4>
              <Button type="button" onClick={addEducation} size="sm" variant="outline" disabled={formData.education.length >= 2}>
                Add
              </Button>
            </div>
            {formData.education.map((edu, idx) => (
              <div key={idx} className="space-y-2 p-3 bg-secondary/30 rounded-lg">
                <Input
                  type="text"
                  placeholder="School"
                  value={edu.school}
                  onChange={(e) => updateEducation(idx, "school", e.target.value)}
                  disabled={isMinting || isUploading}
                  size={30}
                />
                <Input
                  type="text"
                  placeholder="Program"
                  value={edu.program}
                  onChange={(e) => updateEducation(idx, "program", e.target.value)}
                  disabled={isMinting || isUploading}
                  size={30}
                />
                <Input
                  type="text"
                  placeholder="Start Year"
                  value={edu.startYear}
                  onChange={(e) => updateEducation(idx, "startYear", e.target.value)}
                  disabled={isMinting || isUploading}
                  size={30}
                />
                <Input
                  type="text"
                  placeholder="End Year"
                  value={edu.endYear}
                  onChange={(e) => updateEducation(idx, "endYear", e.target.value)}
                  disabled={isMinting || isUploading}
                  size={30}
                />
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

          {/* Experience */}
          <div className="space-y-3 border-b border-border pb-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Briefcase size={16} />
                Experience (Multiple)
              </h4>
              <Button type="button" onClick={addExperience} size="sm" variant="outline">
                Add
              </Button>
            </div>
            {formData.experience.map((exp, idx) => (
              <div key={idx} className="space-y-2 p-3 bg-secondary/30 rounded-lg">
                <Input
                  type="text"
                  placeholder="Company"
                  value={exp.company}
                  onChange={(e) => updateExperience(idx, "company", e.target.value)}
                  disabled={isMinting || isUploading}
                  size={30}
                />
                <Input
                  type="text"
                  placeholder="Role"
                  value={exp.role}
                  onChange={(e) => updateExperience(idx, "role", e.target.value)}
                  disabled={isMinting || isUploading}
                  size={30}
                />
                <Input
                  type="text"
                  placeholder="Start Year"
                  value={exp.startYear}
                  onChange={(e) => updateExperience(idx, "startYear", e.target.value)}
                  disabled={isMinting || isUploading}
                  size={30}
                />
                <Input
                  type="text"
                  placeholder="End Year"
                  value={exp.endYear}
                  onChange={(e) => updateExperience(idx, "endYear", e.target.value)}
                  disabled={isMinting || isUploading}
                  size={30}
                />
                <Textarea
                  placeholder="Description"
                  value={exp.description}
                  onChange={(e) => updateExperience(idx, "description", e.target.value)}
                  rows={2}
                  disabled={isMinting || isUploading}
                />
                {formData.experience.length > 1 && (
                  <Button type="button" onClick={() => removeExperience(idx)} size="sm" variant="destructive" className="w-full">
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* References */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <Users size={16} />
                References (1-2 items)
              </h4>
              <Button type="button" onClick={addReference} size="sm" variant="outline" disabled={formData.references.length >= 2}>
                Add
              </Button>
            </div>
            {formData.references.map((ref, idx) => (
              <div key={idx} className="space-y-2 p-3 bg-secondary/30 rounded-lg">
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={ref.fullName}
                  onChange={(e) => updateReference(idx, "fullName", e.target.value)}
                  disabled={isMinting || isUploading}
                  size={30}
                />
                <Input
                  type="text"
                  placeholder="Company"
                  value={ref.company}
                  onChange={(e) => updateReference(idx, "company", e.target.value)}
                  disabled={isMinting || isUploading}
                  size={30}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={ref.email}
                  onChange={(e) => updateReference(idx, "email", e.target.value)}
                  disabled={isMinting || isUploading}
                  size={30}
                />
                <Input
                  type="tel"
                  placeholder="Phone"
                  value={ref.phone}
                  onChange={(e) => updateReference(idx, "phone", e.target.value)}
                  disabled={isMinting || isUploading}
                  size={30}
                />
                {formData.references.length > 1 && (
                  <Button type="button" onClick={() => removeReference(idx)} size="sm" variant="destructive" className="w-full">
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!isConnected || isMinting || isUploading || !credentialImage}
        className="w-full py-6 text-lg font-bold"
        size="lg"
      >
        {isMinting || isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isUploading ? "Uploading to IPFS..." : "Minting on Celo..."}
          </>
        ) : (
          <>
            Mint Resume on Celo
            <ArrowRight className="ml-2" size={20} />
          </>
        )}
      </Button>
    </form>
  )
}
