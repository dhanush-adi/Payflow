'use client'

import React from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-[#2D2D42]/50 bg-[#0A0A0F]/80 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#9945FF] to-[#00D4FF] flex items-center justify-center text-white group-hover:shadow-lg group-hover:shadow-[#9945FF]/30 transition-all">
              <span className="text-sm font-black">PF</span>
            </div>
            <span className="text-foreground font-black">PayFlow</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
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
              className="text-sm font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-[#9945FF] to-[#00D4FF] text-white hover:shadow-lg hover:shadow-[#9945FF]/30 hover:scale-105 transition-all"
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
          <div className="md:hidden border-t border-[#2D2D42]/50 py-4 space-y-2">
            <Link href="#features" className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2">
              Features
            </Link>
            <Link href="#how-it-works" className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2">
              How It Works
            </Link>
            <Link href="#pricing" className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2">
              Pricing
            </Link>
            <Link href="/dashboard" className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2">
              Dashboard
            </Link>
            <div className="flex gap-3 pt-4 border-t border-[#2D2D42]/50">
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex-1 py-2"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-sm font-bold px-4 py-2 rounded-xl bg-gradient-to-r from-[#9945FF] to-[#00D4FF] text-white flex-1 text-center"
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
