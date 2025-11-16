"use client"

import Link from "next/link"
import { Github, Twitter, MessageCircle, MessageSquare } from "lucide-react"
import { useState } from "react"
import { CredentialTypeModal } from "@/components/credential-type-modal"

export function Footer() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <footer className="bg-secondary border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Branding */}
            <div>
              <h3 className="font-bold text-lg mb-2">OnchainCreds</h3>
              <p className="text-sm text-muted-foreground">
                Powered by <span className="text-primary">Absalex Labs</span>
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-sm">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => setModalOpen(true)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Mint Credentials
                  </button>
                </li>
                <li>
                  <Link href="/verify" className="text-muted-foreground hover:text-foreground transition-colors">
                    Verify Credentials
                  </Link>
                </li>
                <li>
                  <Link href="/templates" className="text-muted-foreground hover:text-foreground transition-colors">
                    Templates
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold mb-4 text-sm">Connect</h4>
              <div className="flex gap-4">
                <a
                  href="https://x.com/OnchainCreds"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="https://github.com/OnchainCreds"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://t.me/OnchainCreds"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Telegram"
                >
                  <MessageSquare size={20} />
                </a>
                <a
                  href="https://discord.gg/9pPKD2WvHg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label="Discord"
                >
                  <MessageCircle size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 Absalex Labs. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      <CredentialTypeModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  )
}
