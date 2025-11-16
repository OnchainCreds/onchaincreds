"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowRight, Zap, Award, Palette, Lock } from 'lucide-react'

export default function TemplatesPage() {
  const resumeTemplates = [
    {
      id: 1,
      name: "Professional Blue",
      description: "Classic and elegant design perfect for corporate professionals",
      gradient: "from-blue-600 to-cyan-500",
      features: ["Clean Layout", "Optimal Readability", "Corporate Style"],
      supportsPhoto: true,
    },
    {
      id: 2,
      name: "Modern Purple",
      description: "Contemporary design with vibrant colors for creative professionals",
      gradient: "from-purple-600 to-pink-500",
      features: ["Bold Colors", "Modern Aesthetic", "Creative Focus"],
      supportsPhoto: true,
    },
    {
      id: 3,
      name: "Minimal Dark",
      description: "Minimalist approach emphasizing content over design elements",
      gradient: "from-gray-700 to-gray-500",
      features: ["Minimal Design", "Content First", "High Contrast"],
      supportsPhoto: false,
    },
    {
      id: 4,
      name: "Executive Gold",
      description: "Premium template for executives and senior professionals",
      gradient: "from-amber-700 to-yellow-500",
      features: ["Premium Feel", "Sophisticated", "Executive Focused"],
      supportsPhoto: true,
    },
    {
      id: 5,
      name: "Tech Green",
      description: "Perfect for tech professionals and developers",
      gradient: "from-emerald-600 to-teal-500",
      features: ["Tech Focused", "Code Friendly", "Modern Tech Style"],
      supportsPhoto: false,
    },
    {
      id: 6,
      name: "Sunset Orange",
      description: "Warm and inviting design for creative industries",
      gradient: "from-orange-600 to-red-500",
      features: ["Warm Tones", "Creative", "Inviting Design"],
      supportsPhoto: true,
    },
  ]

  const TemplateCard = ({ template, isAvailable = true }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`group ${isAvailable ? "" : "opacity-60"}`}
    >
      <div
        className={`rounded-lg overflow-hidden border transition-all duration-300 ${
          isAvailable ? "border-border hover:border-primary/50 bg-card hover:shadow-md" : "border-border bg-card"
        } flex flex-col h-full`}
      >
        {/* Template Preview */}
        <div
          className={`h-32 bg-gradient-to-br ${template.gradient} relative overflow-hidden flex-shrink-0 ${isAvailable ? "" : "grayscale"}`}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent opacity-40" />
          {isAvailable ? (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="text-center">
                <Palette className="h-6 w-6 text-white mb-1 mx-auto" />
                <p className="text-white font-bold text-xs">Preview</p>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Lock className="h-6 w-6 text-white/60 mx-auto mb-1" />
                <p className="text-white/60 font-bold text-xs">Coming Soon</p>
              </div>
            </div>
          )}
        </div>

        {/* Template Info */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-base font-bold mb-1">{template.name}</h3>
          <p className="text-xs text-muted-foreground mb-3 flex-grow">{template.description}</p>

          {/* Features */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {template.features.map((feature) => (
              <span key={feature} className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium">
                {feature}
              </span>
            ))}
          </div>

          {/* Photo Support Badge */}
          {template.supportsPhoto && isAvailable && (
            <div className="flex items-center gap-2 px-2.5 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded mb-3">
              <Zap className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700">✓ Photo Support</span>
            </div>
          )}

          {/* Action Button */}
          {isAvailable ? (
            <Link
              href={`/mint?template=${template.id}`}
              className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-primary text-primary-foreground rounded font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all text-sm mt-auto"
            >
              Use Template
              <ArrowRight size={14} />
            </Link>
          ) : (
            <button
              disabled
              className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-muted text-muted-foreground rounded font-semibold text-sm mt-auto cursor-not-allowed"
            >
              Coming Soon
              <Lock size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <span className="text-sm font-semibold">On-Chain Templates</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Choose Your Credential Template</h1>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Select from professionally designed templates to mint your credentials on-chain. Each template is
              optimized for clarity and impact.
            </p>
          </motion.div>

          {/* Resume Templates Section */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                <span className="w-1 h-8 bg-primary rounded" />
                Resume Templates
              </h2>
              <p className="text-muted-foreground">Available now - Mint your professional resume as an NFT</p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumeTemplates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <TemplateCard template={template} isAvailable={true} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* CV Templates Section */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                <Lock className="w-6 h-6 text-muted-foreground" />
                CV Templates
              </h2>
              <p className="text-muted-foreground">Coming soon - Full curriculum vitae templates</p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumeTemplates.slice(0, 3).map((template, index) => (
                <motion.div
                  key={`cv-${template.id}`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <TemplateCard template={template} isAvailable={false} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Academic Certificate Templates Section */}
          <div className="mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
                <Lock className="w-6 h-6 text-muted-foreground" />
                Academic Certificate Templates
              </h2>
              <p className="text-muted-foreground">Coming soon - University and course certificates</p>
            </motion.div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {resumeTemplates.slice(0, 3).map((template, index) => (
                <motion.div
                  key={`cert-${template.id}`}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <TemplateCard template={template} isAvailable={false} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-lg border border-border bg-secondary/30 p-8 text-center"
          >
            <Award className="h-10 w-10 mx-auto mb-3 text-primary" />
            <h3 className="text-2xl font-bold mb-2">Premium On-Chain Credentials</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
              Every template is professionally designed, fully customizable, and optimized for on-chain credentials.
              Once minted, your credentials become verifiable NFTs on the blockchain.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
