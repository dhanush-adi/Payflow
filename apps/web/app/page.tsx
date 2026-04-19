'use client'

import React from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { ArrowRight, TrendingUp, Lock, Zap, BarChart3, Wallet, Shield, Check, ArrowUpRight } from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import { AuroraBackground } from '@/components/ui/aurora-background'

export default function Home() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Aurora Background */}
      <AuroraBackground>
        <div className="mx-auto max-w-7xl relative z-10">
          <motion.div
            className="text-center space-y-10 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 rounded-full border border-secondary/40 bg-secondary/10 px-4 py-2 backdrop-blur">
                <span className="flex h-2 w-2 rounded-full bg-secondary"></span>
                <span className="text-sm font-medium text-foreground">The next era of trading</span>
              </div>
            </motion.div>

            {/* Heading - Large and Bold */}
            <motion.div variants={itemVariants} className="space-y-8">
              <h1 className="text-7xl sm:text-8xl font-black text-balance leading-tight">
                Trade Every <br/><span className="bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent">Asset on Solana</span>
              </h1>
              <p className="text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
                Lightning-fast execution, AI-powered insights, and institutional-grade security. Everything you need to dominate the market.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg bg-primary text-primary-foreground font-bold glow-primary hover:scale-105 transition-all"
              >
                Start Trading Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-secondary/50 text-foreground hover:bg-secondary/10 transition-all font-semibold"
              >
                View Platform
              </Link>
            </motion.div>

            {/* Stats with Gradient Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-6 pt-12 border-t border-border/30">
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 backdrop-blur-sm">
                <p className="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">$2.4B+</p>
                <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest font-bold">Assets Secured</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/20 backdrop-blur-sm">
                <p className="text-3xl font-black bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">50K+</p>
                <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest font-bold">Active Traders</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 backdrop-blur-sm">
                <p className="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">24/7</p>
                <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest font-bold">Trading Access</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </AuroraBackground>

      {/* Features Section - Grid with Gradient Cards */}
      <section className="px-4 py-32 sm:px-6 lg:px-8 border-t border-border/30">
        <div className="mx-auto max-w-7xl">
          <motion.div
            className="text-center mb-20 space-y-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-6xl sm:text-7xl font-black">Built for Winners</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything a professional trader needs, delivered with zero compromise.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: Shield,
                title: 'Bank-Grade Security',
                description: 'Multi-sig wallets and cold storage options',
                color: 'primary',
              },
              {
                icon: TrendingUp,
                title: 'Real-Time Analytics',
                description: 'Advanced portfolio tracking with live metrics',
                color: 'secondary',
              },
              {
                icon: Zap,
                title: 'AI Trading Assistant',
                description: 'Personalized recommendations powered by AI',
                color: 'primary',
              },
              {
                icon: BarChart3,
                title: 'Market Insights',
                description: 'Comprehensive data and historical analysis',
                color: 'secondary',
              },
              {
                icon: Lock,
                title: 'Privacy First',
                description: 'Encrypted data, never shared with third parties',
                color: 'primary',
              },
              {
                icon: Wallet,
                title: 'Multi-Asset Support',
                description: 'Manage SPL tokens and NFTs in one place',
                color: 'secondary',
              },
            ].map((feature, index) => {
              const Icon = feature.icon
              const bgGradient = feature.color === 'primary' 
                ? 'from-primary/20 to-transparent border-primary/30' 
                : 'from-secondary/20 to-transparent border-secondary/30'
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className={`p-6 rounded-xl border bg-gradient-to-br ${bgGradient} hover:shadow-lg hover:scale-105 transition-all`}
                >
                  <div className="flex items-start gap-4">
                    <Icon className={`w-6 h-6 flex-shrink-0 mt-1 ${feature.color === 'primary' ? 'text-primary' : 'text-secondary'}`} />
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section with Gradient */}
      <section className="px-4 py-32 sm:px-6 lg:px-8 border-t border-border/30">
        <div className="mx-auto max-w-4xl">
          <motion.div
            className="rounded-2xl border border-secondary/50 bg-gradient-to-br from-secondary/20 via-primary/10 to-transparent p-12 sm:p-20 text-center space-y-8 glow-cyan"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-6">
              <h2 className="text-6xl sm:text-7xl font-black">Ready to Trade?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join the fastest-growing community of Solana traders. Zero fees for the first month.
              </p>
            </div>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-lg bg-primary text-primary-foreground font-bold glow-primary hover:scale-105 transition-all text-base"
            >
              Launch Your Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-5 gap-12 mb-12">
            <div className="md:col-span-1">
              <h3 className="font-bold text-xl text-primary mb-2">SolanaVault</h3>
              <p className="text-sm text-muted-foreground">
                Trading intelligence for Solana.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="/security" className="hover:text-foreground transition-colors">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/careers" className="hover:text-foreground transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/docs" className="hover:text-foreground transition-colors">Documentation</Link></li>
                <li><Link href="/api" className="hover:text-foreground transition-colors">API</Link></li>
                <li><Link href="/support" className="hover:text-foreground transition-colors">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link></li>
                <li><Link href="/cookies" className="hover:text-foreground transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; 2026 SolanaVault. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
              <a href="#" className="hover:text-foreground transition-colors">Discord</a>
              <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
