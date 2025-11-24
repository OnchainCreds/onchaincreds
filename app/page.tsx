"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight, Lock, Zap, CheckCircle } from "lucide-react"
import { useState } from "react"
import { CredentialTypeModal } from "@/components/credential-type-modal"

export default function Home() {
  const [showCredentialModal, setShowCredentialModal] = useState(false)

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const features = [
    {
      icon: Lock,
      title: "Trustless Verification",
      description: "Blockchain-powered credential verification ensures authenticity without intermediaries",
    },
    {
      icon: Zap,
      title: "Instant Minting",
      description: "Mint your credentials as an NFT in seconds with permanent on-chain records",
    },
    {
      icon: CheckCircle,
      title: "Ownership & Control",
      description: "You own your credentials completely with full control over your digital identity",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 via-background to-background opacity-50" />

        {/* Animated Background Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          className="absolute top-20 right-10 w-72 h-72 bg-primary rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute bottom-20 left-10 w-96 h-96 bg-primary rounded-full blur-3xl"
        />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div {...fadeInUp}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
              Own Your Credentials,
              <span className="block text-primary">On-Chain.</span>
            </h1>
          </motion.div>

          <motion.p
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance"
          >
            A blockchain-powered protocol for minting, verifying, and showcasing digital credentials with complete
            transparency and ownership.
          </motion.p>

          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => setShowCredentialModal(true)}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
            >
              Mint Your Credentials
              <ArrowRight size={20} />
            </button>
            <Link
              href="/verify"
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-primary text-primary rounded-full font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              Verify Credentials
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-secondary/50">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-16"
          >
            Why Choose OnchainCreds?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="p-6 rounded-lg border border-border bg-background/50 hover:border-primary/50 transition-all duration-300"
                >
                  <Icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.6 }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Mint Your Credentials?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join the decentralized credential verification revolution. Get started in minutes.
            </p>
            <button
              onClick={() => setShowCredentialModal(true)}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
            >
              Start Minting Now
              <ArrowRight size={24} />
            </button>
          </motion.div>
        </div>
      </section>

      <CredentialTypeModal open={showCredentialModal} onOpenChange={setShowCredentialModal} />

      <Footer />
    </div>
  )
}
