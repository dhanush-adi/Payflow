'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, Variants, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import {
  Zap,
  Shield,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Play,
  Sparkles,
  Globe,
  Lock,
  DollarSign,
  CreditCard,
  Bot,
  Layers,
  BarChart3,
  Users,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Phone,
  Menu,
  X,
  Star,
  Quote
} from 'lucide-react'

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant Settlement',
    description: 'UPI payments settled in USDC on Solana within seconds, not days.',
    color: '#14F195'
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Enterprise encryption with multi-sig verification for every transaction.',
    color: '#9945FF'
  },
  {
    icon: Bot,
    title: 'AI Financial Copilot',
    description: 'Intelligent automation that tracks spending, suggests savings, and optimizes investments.',
    color: '#00D4FF'
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Pay locally with UPI, receive globally in USDC. Accept crypto from anywhere.',
    color: '#FFB83D'
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Beautiful dashboards showing spending patterns, trends, and financial insights.',
    color: '#14F195'
  },
  {
    icon: Layers,
    title: 'Seamless Integration',
    description: 'Simple APIs and no-code payment links. Accept crypto in minutes.',
    color: '#9945FF'
  }
]

const STATS = [
  { value: '₹50L+', label: 'Volume Processed', change: '+340%' },
  { value: '12K+', label: 'Transactions', change: '+890' },
  { value: '99.9%', label: 'Uptime', change: 'SLA Guaranteed' },
  { value: '<3s', label: 'Avg Settlement', change: 'Real-time' }
]

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'E-commerce Merchant',
    content: 'PayFlow transformed how I accept payments. My customers pay with UPI, and I receive USDC instantly. Game changer for cross-border sales.',
    rating: 5
  },
  {
    name: 'Rahul Mehta',
    role: 'Freelance Developer',
    content: 'The AI copilot is incredible. It automatically saves a percentage of every payment and reminds me about subscriptions I forgot about.',
    rating: 5
  },
  {
    name: 'Anita Desai',
    role: 'Restaurant Owner',
    content: 'My customers love the seamless payment experience. Settlement happens so fast, my cash flow has improved dramatically.',
    rating: 5
  }
]

const FAQ = [
  {
    q: 'How does UPI to USDC conversion work?',
    a: 'When a customer pays via UPI, our system instantly converts the INR amount to USDC using real-time exchange rates and settles it to your Solana wallet within 3 seconds.'
  },
  {
    q: 'What are the fees involved?',
    a: 'We charge a flat 0.5% conversion fee + ₹2 UPI gateway fee. No hidden charges. Solana network fees are negligible (<$0.01).'
  },
  {
    q: 'Is this legal in India?',
    a: 'Yes. We comply with all regulatory requirements. Our KYC process ensures full compliance while maintaining user privacy.'
  },
  {
    q: 'How do I withdraw USDC to my bank?',
    a: 'You can convert USDC back to INR and withdraw to any linked bank account through our on-ramp partners, typically within 1-2 business days.'
  },
  {
    q: 'What happens if a UPI payment fails?',
    a: 'Full refund is automatically processed. Our system monitors transaction status and ensures no loss of funds.'
  }
]

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isHeroLoaded, setIsHeroLoaded] = useState(false)

  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, 150])
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0])

  useEffect(() => {
    setIsHeroLoaded(true)
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  }

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = '/signup'
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-background/80 backdrop-blur-2xl border-b border-border/50 shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 sm:h-20 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                <span className="text-white font-black text-sm">PF</span>
              </div>
              <span className="text-lg sm:text-xl font-black text-foreground tracking-tight">PayFlow</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
              <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              <Link href="#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-sm font-bold px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all"
              >
                Get Started Free
              </Link>
            </div>

            <button
              className="md:hidden text-foreground p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden bg-background/95 backdrop-blur-2xl border-t border-border"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="px-4 py-6 space-y-4">
                <Link href="#features" className="block text-sm font-medium text-muted-foreground py-2">Features</Link>
                <Link href="#how-it-works" className="block text-sm font-medium text-muted-foreground py-2">How It Works</Link>
                <Link href="#pricing" className="block text-sm font-medium text-muted-foreground py-2">Pricing</Link>
                <Link href="#faq" className="block text-sm font-medium text-muted-foreground py-2">FAQ</Link>
                <div className="pt-4 border-t border-border space-y-3">
                  <Link href="/login" className="block text-sm font-medium text-muted-foreground py-2">Sign In</Link>
                  <Link href="/signup" className="block text-center text-sm font-bold px-5 py-3 rounded-xl bg-primary text-white">Get Started Free</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] animate-pulse [animation-delay:1s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px] animate-pulse [animation-delay:2s]" />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(45,49,66,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(45,49,66,0.3)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]" />
        </div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-32 right-[10%] hidden lg:block"
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Settlement</p>
                <p className="font-bold text-accent">+$1,245.00</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-32 left-[8%] hidden lg:block"
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Savings</p>
                <p className="font-bold text-primary">₹4,520</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isHeroLoaded ? 'visible' : 'hidden'}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                <Sparkles size={16} />
                <span>Powered by Solana • AI-Powered • UPI Connected</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div variants={itemVariants} className="space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-foreground leading-[1.1] tracking-tight">
                Bridge UPI to
                <br />
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Crypto Seamlessly
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                The hybrid payment infrastructure that lets users pay with UPI while merchants receive instant USDC settlements on Solana. Powered by AI for intelligent financial automation.
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
              <form onSubmit={handleGetStarted} className="w-full flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-5 py-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Start Free
                  <ArrowRight size={20} />
                </button>
              </form>
            </motion.div>

            {/* Social Proof */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-accent" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-accent" />
                <span>5-minute setup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-accent" />
                <span>Free forever plan</span>
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div variants={itemVariants} className="relative mt-12 max-w-5xl mx-auto">
              <div className="relative rounded-2xl border border-border bg-card/50 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/40 overflow-hidden">
                {/* Flow Animation */}
                <div className="flex flex-col lg:flex-row items-center lg:items-stretch justify-center gap-6 lg:gap-8">
                  {/* User Side */}
                  <div className="flex-1 flex flex-col items-center text-center min-w-[140px]">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-bold mb-4">
                      <Phone size={14} />
                      User Pays
                    </div>
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 border-2 border-dashed border-accent/30 flex items-center justify-center mb-4 flex-shrink-0">
                      <div className="text-center">
                        <span className="text-2xl sm:text-3xl font-black text-accent">₹500</span>
                        <p className="text-[10px] text-muted-foreground mt-1">UPI</p>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-foreground">Customer pays via PhonePe, GPay, Paytm</p>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center flex-shrink-0">
                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="hidden lg:flex"
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Zap size={28} className="text-white" />
                      </div>
                    </motion.div>
                    <div className="lg:hidden w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <ArrowDownRight size={24} className="text-white" />
                    </div>
                  </div>

                  {/* Merchant Side */}
                  <div className="flex-1 flex flex-col items-center lg:items-end text-center min-w-[140px]">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
                      <Layers size={14} />
                      Merchant Receives
                    </div>
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-dashed border-primary/30 flex items-center justify-center mb-4 flex-shrink-0">
                      <div className="text-center">
                        <span className="text-2xl sm:text-3xl font-black text-primary">$6.00</span>
                        <p className="text-[10px] text-muted-foreground mt-1">USDC</p>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-foreground">Merchant receives in Solana wallet</p>
                  </div>
                </div>

                {/* Flow Steps */}
                <div className="mt-8 pt-8 border-t border-border">
                  <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 text-secondary">
                      <span className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold">1</span>
                      <span className="hidden sm:inline">UPI Payment</span>
                      <span className="sm:hidden">1</span>
                    </div>
                    <div className="hidden sm:block">
                      <ArrowRight size={14} className="text-border" />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary">
                      <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white">2</span>
                      <span className="hidden sm:inline">INR → USDC</span>
                      <span className="sm:hidden">2</span>
                    </div>
                    <div className="hidden sm:block">
                      <ArrowRight size={14} className="text-border" />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent">
                      <span className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold">3</span>
                      <span className="hidden sm:inline">Solana Settlement</span>
                      <span className="sm:hidden">3</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={28} className="text-muted-foreground" />
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 sm:py-24 border-y border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {STATS.map((stat, i) => (
              <motion.div key={i} variants={itemVariants} className="text-center">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-xs font-medium text-accent">{stat.change}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Sparkles size={16} />
              Features
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-6 tracking-tight">
              Everything You Need for
              <br />
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Modern Payments
              </span>
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete payment infrastructure that bridges traditional finance and DeFi, powered by AI for intelligent automation.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  className="group relative p-8 rounded-2xl border border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${feature.color}15` }}
                  >
                    <Icon size={28} style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="relative py-20 sm:py-32 bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-6 tracking-tight">
              How PayFlow Works
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From UPI payment to crypto settlement in three simple steps
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Customer Initiates Payment',
                description: 'Customer chooses UPI payment method and enters amount. QR code is generated instantly with all payment details.',
                icon: Phone,
                color: '#00D4FF'
              },
              {
                step: '02',
                title: 'Real-Time Conversion',
                description: 'Upon UPI confirmation, INR is instantly converted to USDC using our optimized exchange rates. Conversion happens in real-time.',
                icon: DollarSign,
                color: '#9945FF'
              },
              {
                step: '03',
                title: 'Instant Blockchain Settlement',
                description: 'USDC is transferred to merchant\'s Solana wallet within 3 seconds. Transaction recorded on-chain with full transparency.',
                icon: Layers,
                color: '#14F195'
              }
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="relative"
                >
                  <div className="relative p-8 rounded-2xl border border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all">
                    <span className="absolute -top-4 left-8 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">{item.step}</span>
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: `${item.color}15` }}>
                      <Icon size={32} style={{ color: item.color }} />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-4">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                      <ArrowRight size={24} className="text-border" />
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* AI Copilot Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium">
                <Bot size={16} />
                AI-Powered
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
                Your Personal
                <br />
                <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  Financial Copilot
                </span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our AI doesn't just process payments—it learns your spending patterns, automates savings, detects subscriptions, and provides personalized insights to improve your financial health.
              </p>
              <div className="space-y-4">
                {[
                  { label: 'Spending Analysis', desc: 'Categorizes and tracks every expense automatically' },
                  { label: 'Smart Savings', desc: 'Auto-save rules that round up and invest intelligently' },
                  { label: 'Subscription Detection', desc: 'Never miss a payment or get surprised by renewals' },
                  { label: 'Budget Alerts', desc: 'Real-time notifications when you exceed limits' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                      <CheckCircle size={14} className="text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-card/80 backdrop-blur-xl border border-border rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                  <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
                  <span className="font-semibold text-foreground">AI Copilot</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <div className="max-w-[80%] p-4 rounded-2xl rounded-tr-none bg-primary/10 border border-primary/20">
                      <p className="text-sm text-foreground">Analyze my spending this month</p>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-4 rounded-2xl rounded-tl-none bg-card border border-border">
                      <p className="text-sm text-foreground mb-4">
                        Based on your transactions, here's what I found:
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Food & Dining</span>
                          <span className="font-bold text-foreground">₹8,450 (42%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-border overflow-hidden">
                          <div className="h-full bg-accent rounded-full" style={{ width: '42%' }} />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Shopping</span>
                          <span className="font-bold text-foreground">₹5,200 (26%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-border overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: '26%' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-start">
                    <div className="max-w-[80%] p-4 rounded-2xl rounded-tl-none bg-accent/10 border border-accent/20">
                      <p className="text-sm text-foreground">
                        <span className="font-bold text-accent">💡 Suggestion:</span> You could save ₹520/month by canceling unused subscriptions. Want me to set up auto-detection?
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-20 sm:py-32 bg-card/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-black text-foreground mb-4">
              Loved by Merchants
            </motion.h2>
            <motion.div variants={itemVariants} className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
              ))}
              <span className="text-sm text-muted-foreground ml-2">4.9/5 from 500+ reviews</span>
            </motion.div>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-8 rounded-2xl border border-border bg-card/50"
              >
                <Quote className="w-10 h-10 text-primary/20 mb-4" />
                <p className="text-lg sm:text-xl text-foreground leading-relaxed mb-8">
                  {TESTIMONIALS[currentTestimonial].content}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-foreground">{TESTIMONIALS[currentTestimonial].name}</p>
                    <p className="text-sm text-muted-foreground">{TESTIMONIALS[currentTestimonial].role}</p>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(TESTIMONIALS[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center gap-2 mt-6">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentTestimonial(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentTestimonial ? 'w-8 bg-primary' : 'bg-border hover:bg-primary/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative py-20 sm:py-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-black text-foreground mb-4">
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-muted-foreground">
              No hidden fees. Pay only for what you use.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl border border-border bg-card/50"
            >
              <h3 className="text-xl font-bold text-foreground mb-2">For Users</h3>
              <p className="text-muted-foreground text-sm mb-6">Perfect for individuals getting started</p>
              <div className="mb-6">
                <span className="text-4xl font-black text-foreground">Free</span>
                <span className="text-muted-foreground ml-2">forever</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Send/receive UPI payments', 'AI spending insights', 'Up to ₹10,000/month', 'Basic automations', 'Email support'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                    <CheckCircle size={18} className="text-accent" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block text-center px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-card transition-colors"
              >
                Get Started
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative p-8 rounded-2xl border-2 border-primary bg-gradient-to-b from-primary/5 to-transparent"
            >
              <div className="absolute -top-3 right-8 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                Most Popular
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">For Merchants</h3>
              <p className="text-muted-foreground text-sm mb-6">For businesses accepting crypto</p>
              <div className="mb-6">
                <span className="text-4xl font-black text-foreground">0.5%</span>
                <span className="text-muted-foreground ml-2">per transaction</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Unlimited transaction volume', 'Real-time USDC settlements', 'Advanced AI analytics', 'Custom payment links & QR', 'Priority support', 'API access', 'Webhook integrations'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                    <CheckCircle size={18} className="text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup?type=merchant"
                className="block text-center px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
              >
                Start Accepting Crypto
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="relative py-20 sm:py-32 bg-card/30">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-black text-foreground mb-4">
              Frequently Asked Questions
            </motion.h2>
            <motion.p variants={itemVariants} className="text-lg text-muted-foreground">
              Everything you need to know about PayFlow
            </motion.p>
          </motion.div>

          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl border border-border overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left bg-card/50 hover:bg-card transition-colors"
                >
                  <span className="font-semibold text-foreground pr-4">{item.q}</span>
                  <ChevronDown
                    size={20}
                    className={`text-muted-foreground transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 pt-0 text-sm text-muted-foreground leading-relaxed">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-10" />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight">
              Ready to Bridge the Gap?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of merchants and users already enjoying seamless UPI to crypto payments. Get started in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/signup"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:shadow-lg hover:shadow-primary/30 hover:scale-105 transition-all flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/demo"
                className="px-8 py-4 rounded-xl border border-border text-foreground font-semibold hover:bg-card transition-colors flex items-center gap-2"
              >
                <Play size={20} />
                Watch Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center">
                  <span className="text-white font-black text-sm">PF</span>
                </div>
                <span className="text-lg font-black text-foreground">PayFlow</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                The future of payments, bridging UPI and crypto seamlessly.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">API Docs</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Careers</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">KYC Policy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              © 2025 PayFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Globe size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <ExternalLink size={20} />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Users size={20} />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
