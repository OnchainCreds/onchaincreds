"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowRight, Shield, Zap, Globe } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Trust",
      description: "Blockchain-powered verification ensures complete authenticity without intermediaries",
    },
    {
      icon: Zap,
      title: "Efficiency",
      description: "Lightning-fast credential minting and verification on Celo network",
    },
    {
      icon: Globe,
      title: "Decentralization",
      description: "Fully decentralized protocol where users maintain complete ownership and control",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="text-5xl font-bold mb-6">About OnchainCreds</h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              OnchainCreds is a decentralized credential verification protocol developed by Absalex Labs, designed to
              transform how achievements and credentials are verified across the Web3 ecosystem. We believe that
              individuals should have complete ownership and control over their professional identity.
            </p>
          </motion.div>

          {/* Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8">Our Core Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 rounded-lg border border-border bg-secondary/30 hover:border-primary/50 transition-all"
                  >
                    <Icon size={32} className="text-primary mb-4" />
                    <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Absalex Labs Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-8 rounded-lg border border-primary/50 bg-primary/10 mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Backed by Absalex Labs</h2>
            <p className="text-lg mb-6 leading-relaxed">
              Absalex Labs is a research-driven blockchain innovation hub dedicated to building the future of Web3. With
              expertise in decentralized systems, smart contracts, and cryptographic protocols, we're committed to
              creating infrastructure that empowers individuals through trustless verification and self-sovereign
              identity.
            </p>
            <a
              href="https://absalex.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all"
            >
              Learn More About Absalex Labs
              <ArrowRight size={20} />
            </a>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-8">Why OnchainCreds?</h2>
            <ul className="space-y-4 text-lg">
              {[
                "Permanent on-chain records that cannot be forged or deleted",
                "Complete ownership of your credentials with private key control",
                "Instant verification without relying on centralized databases",
                "Portable credentials that work across any application or platform",
                "Transparent proof of authenticity through blockchain technology",
                "Native integration with Celo blockchain with upcoming multichain support for Ethereum, Polygon, and more",
              ].map((feature, index) => (
                <motion.li
                  key={typeof feature === "string" ? feature : "multichain"}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-primary font-bold text-xl mt-1">✓</span>
                  <span className="text-muted-foreground">{typeof feature === "string" ? feature : feature}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center p-8 rounded-lg border border-border bg-secondary/30"
          >
            <h3 className="text-2xl font-bold mb-4">Ready to Own Your Credentials?</h3>
            <Link
              href="/mint"
              className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all"
            >
              Start Minting Now
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
