'use client'

import React from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/20 bg-background/50 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg group">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-foreground group-hover:shadow-lg group-hover:shadow-primary/30 transition-all">
              <span className="text-sm font-black">S</span>
            </div>
            <span className="text-foreground font-black">SolanaVault</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-secondary transition-colors">
              Dashboard
            </Link>
            <Link href="/dashboard/payments" className="text-sm font-medium text-muted-foreground hover:text-secondary transition-colors">
              Payments
            </Link>
            <Link href="/dashboard/ai-copilot" className="text-sm font-medium text-muted-foreground hover:text-secondary transition-colors">
              AI Copilot
            </Link>
            <Link href="/dashboard/analytics" className="text-sm font-medium text-muted-foreground hover:text-secondary transition-colors">
              Analytics
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="text-sm font-bold px-4 py-2 rounded-md bg-primary text-primary-foreground glow-primary hover:scale-105 transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-foreground"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-border/20 py-4 space-y-2">
            <Link href="/dashboard" className="block text-sm font-medium text-muted-foreground hover:text-secondary transition-colors py-2">
              Dashboard
            </Link>
            <Link href="/dashboard/payments" className="block text-sm font-medium text-muted-foreground hover:text-secondary transition-colors py-2">
              Payments
            </Link>
            <Link href="/dashboard/ai-copilot" className="block text-sm font-medium text-muted-foreground hover:text-secondary transition-colors py-2">
              AI Copilot
            </Link>
            <Link href="/dashboard/analytics" className="block text-sm font-medium text-muted-foreground hover:text-secondary transition-colors py-2">
              Analytics
            </Link>
            <div className="flex gap-3 pt-4 border-t border-border/20">
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex-1 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-sm font-bold px-4 py-2 rounded-md bg-primary text-primary-foreground glow-primary hover:scale-105 transition-all flex-1 text-center"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
