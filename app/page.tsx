"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight, Lock, CheckCircle, Zap } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useCredentialModal } from "@/components/credential-modal-provider"

export default function Home() {
  const { openModal } = useCredentialModal()

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const features = [
    {
      icon: Lock,
      title: "Verified Identity",
      description: "Self-attested claims verified through document submission and blockchain verification",
    },
    {
      icon: CheckCircle,
      title: "Transparent Attestation",
      description: "Clear claim status display showing exactly what has been verified and what hasn't",
    },
    {
      icon: Zap,
      title: "Instant Minting",
      description: "Mint your verified credential as an NFT on-chain with permanent records",
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
              Verified Credentials
              <span className="block text-primary">On-Chain</span>
            </h1>
          </motion.div>

          <motion.p
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance"
          >
            Submit your professional information and documents to mint verifiable on-chain credentials. Your claims are self-attested and transparently recorded on the blockchain.
          </motion.p>

          <motion.div
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={openModal}
              size="lg"
              className="gap-2"
            >
              Mint Credentials
              <ArrowRight size={20} />
            </Button>
            <a href="/verify">
              <Button variant="outline" size="lg" className="gap-2">
                Verify Credentials
                <ArrowRight size={20} />
              </Button>
            </a>
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
            How It Works
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Mint?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Create your verified credential in minutes. Your identity, securely on-chain.
            </p>
            <Button
              onClick={openModal}
              size="lg"
              className="gap-2"
            >
              Mint Credentials
              <ArrowRight size={20} />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
