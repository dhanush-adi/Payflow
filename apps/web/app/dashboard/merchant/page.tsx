'use client'

import React, { useState, useEffect } from 'react'
import { motion, Variants } from 'framer-motion'
import { 
  LayoutDashboard,
  DollarSign,
  TrendingUp,
  QrCode,
  Link as LinkIcon,
  Settings,
  Users,
  ArrowDownLeft,
  ArrowUpRight,
  ExternalLink,
  Copy,
  Check,
  Plus,
  MoreVertical,
  Download,
  Calendar,
  Loader2,
  RefreshCw,
  Copy as CopyIcon,
  Wallet,
  CreditCard,
  Clock,
  Zap,
  BarChart3
} from 'lucide-react'
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { api } from '@/lib/api'
const merchantApi = {
  getProfile: () => api.get('/auth/profile'),
  getTransactions: (limit: number, offset: number) => api.get(`/payments?limit=${limit}&offset=${offset}`)
}
const blockchainApi = {
  getBalance: (address: string) => api.get(`/blockchain/balance/${address}`)
}
import { useRouter } from 'next/navigation'

const weeklyData = [
  { day: 'Mon', volume: 45000, count: 12 },
  { day: 'Tue', volume: 52000, count: 15 },
  { day: 'Wed', volume: 38000, count: 9 },
  { day: 'Thu', volume: 61000, count: 18 },
  { day: 'Fri', volume: 73000, count: 22 },
  { day: 'Sat', volume: 55000, count: 14 },
  { day: 'Sun', volume: 42000, count: 11 },
]

const recentSettlements = [
  { id: 1, amount: 150.50, amountINR: 12570, status: 'CONFIRMED', hash: '4xKj...8Zq', time: '2 min ago', customer: 'rahul.k@example.com' },
  { id: 2, amount: 89.25, amountINR: 7450, status: 'CONFIRMED', hash: '7mNp...2Ab', time: '15 min ago', customer: 'priya.s@example.com' },
  { id: 3, amount: 234.00, amountINR: 19550, status: 'CONFIRMED', hash: '9kLm...5Cd', time: '1 hour ago', customer: 'raj.m@example.com' },
  { id: 4, amount: 67.80, amountINR: 5665, status: 'PENDING', hash: '2pQr...8Ef', time: '2 hours ago', customer: 'anita.d@example.com' },
  { id: 5, amount: 178.90, amountINR: 14950, status: 'CONFIRMED', hash: '5sTu...1Gh', time: '3 hours ago', customer: 'vikram.p@example.com' },
]

const COLORS = ['#14F195', '#9945FF', '#00D4FF', '#FFB83D', '#FF6B6B'];

export default function MerchantDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [merchant, setMerchant] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [walletAddress] = useState('7xKXjg2e3VWsk1x2zddS7pDhJvDkBnP3mC5vC5cWjQ8Z')
  const [balance, setBalance] = useState({ sol: 12.3456, usdc: 2345.67 })
  const [copied, setCopied] = useState(false)
  const [paymentLinks, setPaymentLinks] = useState([
    { id: 1, name: 'Product A Payment', amount: 500, link: 'payflow.ai/p/a1b2c3', uses: 45, active: true },
    { id: 2, name: 'Monthly Subscription', amount: 999, link: 'payflow.ai/p/sub-monthly', uses: 128, active: true },
    { id: 3, name: 'Premium Plan', amount: 2499, link: 'payflow.ai/p/premium', uses: 67, active: false },
  ])

  const router = useRouter()

  useEffect(() => {
    const loadData = async () => {
      try {
        // Check if logged in
        const token = localStorage.getItem('user')
        if (!token) {
          // For demo, use mock data
          setIsLoading(false)
          return
        }
        
        const [merchantData, txData] = await Promise.all([
          merchantApi.getProfile().catch(() => null),
          merchantApi.getTransactions(10, 0).catch(() => ({ items: [] }))
        ])
        
        setMerchant(merchantData)
        setTransactions(txData.items || txData.data?.items || [])
      } catch (err) {
        console.error('Failed to load merchant data:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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

  const totalVolume = recentSettlements.reduce((acc, s) => acc + s.amount, 0)
  const totalINR = recentSettlements.reduce((acc, s) => acc + s.amountINR, 0)
  const confirmedCount = recentSettlements.filter(s => s.status === 'CONFIRMED').length

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-black text-sm">TM</span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-foreground">TechMart India</h1>
                <p className="text-sm text-muted-foreground">Merchant Dashboard</p>
              </div>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:bg-secondary/20 transition-all text-sm font-medium"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              Sync
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:bg-secondary/20 transition-all text-sm font-medium">
              <Settings size={16} />
              Settings
            </button>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/10 to-transparent p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <DollarSign size={20} className="text-accent" />
              </div>
              <TrendingUp size={16} className="text-accent-success" />
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">USDC Balance</p>
            <p className="text-2xl sm:text-3xl font-black text-foreground">${balance.usdc.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">≈ ₹{Math.round(balance.usdc * 83.45).toLocaleString()}</p>
          </motion.div>

          <motion.div variants={itemVariants} className="rounded-2xl border border-border bg-card/50 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <CreditCard size={20} className="text-primary" />
              </div>
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Settlements Today</p>
            <p className="text-2xl sm:text-3xl font-black text-foreground">{confirmedCount}</p>
            <p className="text-xs text-muted-foreground mt-1">Total: ${totalVolume.toFixed(2)}</p>
          </motion.div>

          <motion.div variants={itemVariants} className="rounded-2xl border border-border bg-card/50 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                <BarChart3 size={20} className="text-secondary" />
              </div>
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Weekly Volume</p>
            <p className="text-2xl sm:text-3xl font-black text-foreground">₹{Math.round(totalINR * 2.5).toLocaleString()}</p>
            <p className="text-xs text-accent-success mt-1">+18% vs last week</p>
          </motion.div>

          <motion.div variants={itemVariants} className="rounded-2xl border border-border bg-card/50 p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Users size={20} className="text-yellow-500" />
              </div>
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Total Customers</p>
            <p className="text-2xl sm:text-3xl font-black text-foreground">2,847</p>
            <p className="text-xs text-muted-foreground mt-1">+124 this month</p>
          </motion.div>
        </motion.div>

        {/* Chart Section */}
        <motion.div
          className="rounded-2xl border border-border bg-card/50 p-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">Settlement Volume</h3>
              <p className="text-xs text-muted-foreground">This week&apos;s transactions</p>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold">Week</button>
              <button className="px-3 py-1.5 rounded-lg bg-card text-muted-foreground text-xs font-medium hover:text-foreground transition-colors">Month</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14F195" stopOpacity={1} />
                  <stop offset="100%" stopColor="#14F195" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2D42" vertical={false} />
              <XAxis dataKey="day" stroke="#A1A8C1" style={{ fontSize: '12px', fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#A1A8C1" style={{ fontSize: '12px', fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#141829',
                  border: '1px solid #2D2D42',
                  borderRadius: '12px',
                  color: '#FFFFFF'
                }}
              />
              <Bar dataKey="volume" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Bottom Grid */}
        <motion.div
          className="grid lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Wallet Address */}
          <motion.div variants={itemVariants} className="rounded-2xl border border-border bg-card/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Wallet size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Solana Wallet</h3>
                <p className="text-xs text-muted-foreground">Your settlement address</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border mb-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground mb-1">Wallet Address</p>
                <p className="font-mono text-sm text-foreground truncate">{walletAddress}</p>
              </div>
              <button
                onClick={handleCopyAddress}
                className="p-2 rounded-lg hover:bg-secondary/20 transition-colors flex-shrink-0"
              >
                {copied ? (
                  <Check size={18} className="text-accent-success" />
                ) : (
                  <CopyIcon size={18} className="text-muted-foreground" />
                )}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-card border border-border">
                <p className="text-xs text-muted-foreground mb-1">SOL Balance</p>
                <p className="font-bold text-foreground">{balance.sol.toFixed(4)} SOL</p>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border">
                <p className="text-xs text-muted-foreground mb-1">USDC Balance</p>
                <p className="font-bold text-primary">${balance.usdc.toFixed(2)}</p>
              </div>
            </div>
            <a
              href={`https://explorer.solana.com/address/${walletAddress}?cluster=devnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 mt-4 p-3 rounded-xl border border-border hover:bg-secondary/20 transition-colors text-sm font-medium"
            >
              View on Explorer
              <ExternalLink size={16} />
            </a>
          </motion.div>

          {/* Recent Settlements */}
          <motion.div variants={itemVariants} className="lg:col-span-2 rounded-2xl border border-border bg-card/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-foreground">Recent Settlements</h3>
              <button className="text-xs text-primary hover:text-primary-dark font-medium flex items-center gap-1">
                <Download size={14} />
                Export
              </button>
            </div>
            <div className="space-y-3">
              {recentSettlements.map((settlement) => (
                <div
                  key={settlement.id}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/30 transition-colors border border-transparent hover:border-border/50"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      settlement.status === 'CONFIRMED' ? 'bg-accent-success/10' : 'bg-yellow-500/10'
                    }`}>
                      {settlement.status === 'CONFIRMED' ? (
                        <ArrowDownLeft size={20} className="text-accent-success" />
                      ) : (
                        <Clock size={20} className="text-yellow-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">${settlement.amount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">₹{settlement.amountINR.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs text-muted-foreground">{settlement.hash}</p>
                    <p className="text-xs text-muted-foreground">{settlement.time}</p>
                  </div>
                  <a
                    href={`https://explorer.solana.com/tx/${settlement.hash}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-secondary/20 transition-colors"
                  >
                    <ExternalLink size={16} className="text-muted-foreground" />
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Payment Links */}
        <motion.div
          className="rounded-2xl border border-border bg-card/50 p-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">Payment Links</h3>
              <p className="text-xs text-muted-foreground">Create shareable payment links</p>
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:shadow-lg hover:shadow-primary/30 transition-all text-sm">
              <Plus size={16} />
              Create Link
            </button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paymentLinks.map((link) => (
              <div
                key={link.id}
                className="p-4 rounded-xl border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-foreground">{link.name}</p>
                    <p className="text-xs text-muted-foreground">₹{link.amount}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                    link.active ? 'bg-accent-success/10 text-accent-success' : 'bg-muted text-muted-foreground'
                  }`}>
                    {link.active ? 'Active' : 'Inactive'}
                  </div>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-card border border-border">
                  <p className="text-xs font-mono text-muted-foreground truncate flex-1">{link.link}</p>
                  <button className="p-1 hover:bg-secondary/20 rounded transition-colors">
                    <CopyIcon size={14} className="text-muted-foreground" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                  <span>{link.uses} uses</span>
                  <span className="font-medium">${(link.amount / 83.45).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* API Integration */}
        <motion.div
          className="rounded-2xl border border-border bg-card/50 p-6"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
              <Zap size={20} className="text-secondary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">API Integration</h3>
              <p className="text-xs text-muted-foreground">Use our API to accept payments programmatically</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border font-mono text-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground">API Key</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-yellow-500">mk_live_••••••••••••••</span>
                <button className="p-1.5 rounded-lg hover:bg-secondary/20 transition-colors">
                  <CopyIcon size={14} className="text-muted-foreground" />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
            <p className="text-sm text-foreground mb-2">Quick Integration Code</p>
            <code className="text-xs text-muted-foreground block bg-card p-3 rounded-lg">
              curl -X POST https://api.payflow.ai/v1/payments \<br />
              &nbsp;&nbsp;-H &quot;Authorization: Bearer YOUR_API_KEY&quot; \<br />
              &nbsp;&nbsp;-d &quot;amount=500&amp;currency=INR&amp;merchant=your_id&quot;
            </code>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
