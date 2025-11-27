"use client"

import { motion } from "framer-motion"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code2, Github, BookOpen, Zap, ArrowRight, Clock, CheckCircle } from 'lucide-react'

export default function DeveloperPage() {
  const resources = [
    {
      icon: Code2,
      title: "API Documentation",
      description: "Complete API reference and integration guides for OnchainCreds",
      action: "View Docs",
      comingSoon: true,
    },
    {
      icon: Github,
      title: "GitHub Repository",
      description: "Access our open-source codebase and contribute to the project",
      action: "View Repo",
      comingSoon: true,
    },
    {
      icon: BookOpen,
      title: "Smart Contracts",
      description: "Explore our audited smart contracts on the Celo blockchain",
      action: "View Contracts",
      comingSoon: true,
    },
    {
      icon: Zap,
      title: "Quick Start",
      description: "Get started integrating OnchainCreds into your application",
      action: "Get Started",
      comingSoon: true,
    },
  ]

  const credentialTypes = [
    { name: "Professional Credentials", description: "Work experience and professional qualifications" },
    { name: "Educational Credentials", description: "Degrees, certifications, and academic achievements" },
    { name: "Skills & Certifications", description: "Technical skills and professional certifications" },
    { name: "Community Credentials", description: "Contributions and community participation badges" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="text-5xl font-bold mb-6">For Developers</h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Build on top of OnchainCreds infrastructure. Integrate verified credentials into your application and create trustless verification flows.
            </p>
          </motion.div>

          {/* Resources Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8">Developer Resources</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {resources.map((resource, index) => {
                const Icon = resource.icon
                return (
                  <motion.div
                    key={resource.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-6 rounded-lg border transition-all ${
                      resource.comingSoon 
                        ? "border-border bg-secondary/20" 
                        : "border-border bg-secondary/30 hover:border-primary/50"
                    }`}
                  >
                    <Icon size={32} className={`mb-4 ${resource.comingSoon ? "text-muted-foreground" : "text-primary"}`} />
                    <h3 className="text-lg font-bold mb-2">{resource.title}</h3>
                    <p className="text-muted-foreground mb-4">{resource.description}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={resource.comingSoon}
                      className="gap-2"
                    >
                      {resource.comingSoon ? (
                        <>
                          <Clock size={16} />
                          Coming Soon
                        </>
                      ) : (
                        <>
                          {resource.action}
                          <ArrowRight size={16} />
                        </>
                      )}
                    </Button>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Credential Types Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold mb-8">Credential Types</h2>
            <p className="text-lg text-muted-foreground mb-8">
              OnchainCreds supports multiple credential types:
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle size={20} className="text-green-500" />
                  <h3 className="text-lg font-bold">Resume</h3>
                  <span className="text-xs font-medium px-2 py-0.5 bg-green-500/20 text-green-700 dark:text-green-400 rounded-full">
                    Available
                  </span>
                </div>
                <p className="text-muted-foreground">Professional background, skills, and experience</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-lg border border-border bg-card opacity-60 transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Clock size={20} className="text-amber-500" />
                  <h3 className="text-lg font-bold">CV</h3>
                  <span className="text-xs font-medium px-2 py-0.5 bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-full">
                    Coming Soon
                  </span>
                </div>
                <p className="text-muted-foreground">Comprehensive curriculum vitae with career history</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 rounded-lg border border-border bg-card opacity-60 transition-all"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Clock size={20} className="text-amber-500" />
                  <h3 className="text-lg font-bold">Academic Certificate</h3>
                  <span className="text-xs font-medium px-2 py-0.5 bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-full">
                    Coming Soon
                  </span>
                </div>
                <p className="text-muted-foreground">Educational achievements and academic credentials</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Integration Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="p-8 rounded-lg border border-border bg-secondary/30 mb-12 opacity-50 pointer-events-none"
          >
            <h2 className="text-3xl font-bold mb-4">Quick Integration</h2>
            <p className="text-lg mb-6 leading-relaxed">
              Integrate OnchainCreds verification into your application with just a few lines of code. Our SDK handles all the complexity of blockchain interaction and credential verification.
            </p>
            <div className="bg-background rounded-lg p-4 mb-6 overflow-x-auto">
              <pre className="text-sm font-mono text-muted-foreground">
{`import { OnchainCredsVerifier } from '@onchain-creds/sdk'

const verifier = new OnchainCredsVerifier()
const credentials = await verifier.verify(tokenId)
console.log(credentials.attestations)`}
              </pre>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Button size="lg" disabled className="gap-2">
                View SDK Documentation
                <ArrowRight size={20} />
              </Button>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-sm font-medium text-amber-700 dark:text-amber-400 whitespace-nowrap">
                <Clock size={16} />
                Coming Soon
              </span>
            </div>
          </motion.div>

          {/* Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            {[
              { label: "Active Credentials", value: "1,234" },
              { label: "Verified Users", value: "856" },
              { label: "Smart Contract", value: "Audited" },
            ].map((metric, index) => (
              <Card key={metric.label} className="p-6 text-center bg-secondary/30 border-border">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <p className="text-3xl font-bold text-primary mb-2">{metric.value}</p>
                  <p className="text-muted-foreground">{metric.label}</p>
                </motion.div>
              </Card>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center p-8 rounded-lg border border-border bg-secondary/30"
          >
            <h3 className="text-2xl font-bold mb-4">Ready to Build?</h3>
            <p className="text-muted-foreground mb-6">Start integrating OnchainCreds into your project today</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" disabled className="gap-2">
                <Clock size={20} />
                Coming Soon
              </Button>
              <Button size="lg" variant="outline" disabled className="gap-2">
                <Clock size={20} />
                Coming Soon
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
