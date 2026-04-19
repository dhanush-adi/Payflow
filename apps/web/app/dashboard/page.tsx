'use client'

import React, { useEffect, useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownLeft, Eye, EyeOff, Loader2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { authApi, paymentsApi } from '@/lib/api'
import { useRouter } from 'next/navigation'

const portfolioData = [
  { date: 'Jan 1', value: 45000 },
  { date: 'Jan 8', value: 52000 },
  { date: 'Jan 15', value: 48000 },
  { date: 'Jan 22', value: 61000 },
  { date: 'Jan 29', value: 58000 },
  { date: 'Feb 5', value: 67000 },
  { date: 'Feb 12', value: 71000 },
]

const holdings = [
  { symbol: 'SOL', name: 'Solana', amount: 5.234, value: 1567.02, change: 12.5, logo: '◈' },
  { symbol: 'USDC', name: 'USD Coin', amount: 10000, value: 10000, change: 0, logo: '◉' },
  { symbol: 'JUP', name: 'Jupiter', amount: 2500, value: 3750, change: 28.3, logo: '✦' },
  { symbol: 'ORCA', name: 'Orca', amount: 850, value: 2550, change: -5.2, logo: '○' },
]

const recentTransactions = [
  { id: 1, type: 'buy', asset: 'SOL', amount: 1.5, value: 450, time: '2 hours ago' },
  { id: 2, type: 'sell', asset: 'JUP', amount: 500, value: 750, time: '5 hours ago' },
  { id: 3, type: 'buy', asset: 'USDC', amount: 5000, value: 5000, time: '1 day ago' },
  { id: 4, type: 'swap', asset: 'SOL → ORCA', amount: 0.5, value: 150, time: '2 days ago' },
]

export default function DashboardPage() {
  const [hideBalance, setHideBalance] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return router.push('/login')
        
        const [userData, txData] = await Promise.all([
          authApi.getProfile(),
          paymentsApi.getTransactions()
        ])
        setUser(userData)
        setTransactions(txData.data || [])
      } catch (err) {
        console.error("Dashboard error:", err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground">Portfolio</h1>
          <p className="text-muted-foreground mt-2">Welcome back, {user?.name || 'User'}! Here's your overview.</p>
        </motion.div>
      </motion.div>

      {/* Quick Actions & High-level Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Simulate UPI Link */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl border border-accent/30 bg-accent/5 p-6 flex flex-col justify-between group hover:bg-accent/10 transition-all cursor-pointer"
          onClick={() => {
            // Simplified simulation trigger
            alert("Simulating UPI -> Crypto Flow...\n1. UPI Payment Received (₹500)\n2. Converting to USDC ($6)\n3. Settling on Solana...")
            paymentsApi.createPayment({ amount: 500, merchantId: 'demo-merchant', description: 'Simulated UPI Payment' })
          }}
        >
          <div className="flex items-center justify-between">
            <div className="p-2 bg-accent/10 rounded-lg text-accent">
              <ArrowUpRight size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Real-timeSimulation</span>
          </div>
          <div>
            <h3 className="text-xl font-black text-foreground group-hover:translate-x-1 transition-transform">Simulate UPI</h3>
            <p className="text-xs text-muted-foreground mt-1">Pay with UPI, settle in USDC</p>
          </div>
        </motion.div>

        {/* Total Balance */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/15 to-transparent p-6 space-y-4 glow-primary md:col-span-1"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-muted-foreground">Total Balance</h3>
            <button
              onClick={() => setHideBalance(!hideBalance)}
              className="text-foreground-secondary hover:text-foreground transition-colors"
            >
              {hideBalance ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">
              {hideBalance ? '••••••' : '$28,867.02'}
            </p>
            <p className="text-sm text-accent-success mt-2">↑ 12.5% this month</p>
          </div>
        </motion.div>

        {/* 24h Change */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl border border-border bg-secondary/30 p-6 space-y-4"
        >
          <h3 className="text-sm font-medium text-foreground-secondary">24h Change</h3>
          <div>
            <p className="text-3xl font-bold text-foreground">$1,234.56</p>
            <p className="text-sm text-accent-success mt-2">↑ 4.5% increase</p>
          </div>
        </motion.div>

        {/* Status */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl border border-border bg-secondary/30 p-6 space-y-4"
        >
          <h3 className="text-sm font-medium text-foreground-secondary">Bridge Status</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <p className="text-xl font-bold text-foreground">UPI2Chain Active</p>
          </div>
          <p className="text-xs text-muted-foreground mt-2">INR/USDC Rate: ₹83.45</p>
        </motion.div>
      </motion.div>

      {/* Chart */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl border border-border bg-secondary/30 p-6"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground">Portfolio Performance</h3>
          <p className="text-sm text-foreground-secondary mt-1">Last 30 days</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={portfolioData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14F195" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#14F195" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D3142" />
            <XAxis dataKey="date" stroke="#A1A8C1" style={{ fontSize: '12px' }} />
            <YAxis stroke="#A1A8C1" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#141829',
                border: '1px solid #2D3142',
                borderRadius: '8px',
                color: '#FFFFFF'
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#14F195"
              fillOpacity={1}
              fill="url(#colorValue)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Holdings and Transactions */}
      <motion.div
        className="grid lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* Holdings */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 rounded-xl border border-border bg-secondary/30 p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-6">Your Holdings</h3>
          <div className="space-y-4">
            {holdings.map((holding) => (
              <div
                key={holding.symbol}
                className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-border transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {holding.logo}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{holding.name}</p>
                    <p className="text-sm text-foreground-secondary">{holding.amount} {holding.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">${holding.value.toLocaleString()}</p>
                  <p className={`text-sm ${holding.change >= 0 ? 'text-accent-success' : 'text-destructive'}`}>
                    {holding.change >= 0 ? '+' : ''}{holding.change}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl border border-border bg-secondary/30 p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {transactions.length > 0 ? (
              transactions.map((tx: any, idx: number) => (
                <div key={tx.id || idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary/10">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">
                        {tx.type || 'Transfer'} - {tx.status}
                      </p>
                      <p className="text-xs text-foreground-secondary">
                        {new Date(tx.createdAt || Date.now()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-foreground text-right border-b border-dashed border-primary/30">
                    ${tx.amountUSDC?.toLocaleString() || tx.amount || 0}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-foreground-secondary italic">No recent transactions found.</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
