'use client'

import React, { useEffect, useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Eye, 
  EyeOff, 
  Loader2,
  Zap,
  Sparkles,
  CreditCard,
  BarChart3,
  Bell,
  Plus,
  ChevronRight,
  RefreshCw
} from 'lucide-react'
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, CartesianGrid, XAxis, YAxis } from 'recharts'
import { authApi, paymentsApi, aiApi } from '@/lib/api'
import { PaymentFlowModal } from '@/components/payment-flow-modal'
import { useRouter } from 'next/navigation'

const portfolioData = [
  { date: 'Jan', value: 45000 },
  { date: 'Feb', value: 52000 },
  { date: 'Mar', value: 48000 },
  { date: 'Apr', value: 61000 },
  { date: 'May', value: 58000 },
  { date: 'Jun', value: 67000 },
  { date: 'Jul', value: 71000 },
]

const spendingBreakdown = [
  { name: 'Food & Dining', value: 35, color: '#14F195' },
  { name: 'Shopping', value: 25, color: '#9945FF' },
  { name: 'Travel', value: 20, color: '#00D4FF' },
  { name: 'Entertainment', value: 12, color: '#FFB83D' },
  { name: 'Other', value: 8, color: '#FF6B6B' },
]

export default function DashboardPage() {
  const [hideBalance, setHideBalance] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [insights, setInsights] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()

  const loadData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }
      
      const [userData, txData, insightsData] = await Promise.all([
        authApi.getProfile(),
        paymentsApi.getTransactions(10, 0),
        aiApi.getInsights().catch(() => ({ data: [] }))
      ])
      setUser(userData)
      setTransactions(txData.data?.items || txData.items || [])
      setInsights(insightsData.data || insightsData || [])
    } catch (err) {
      console.error("Dashboard error:", err)
      localStorage.removeItem('token')
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadData()
    setIsRefreshing(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary mx-auto flex items-center justify-center">
            <span className="text-2xl font-black text-white">PF</span>
          </div>
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
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

  const totalVolume = transactions.reduce((acc, tx) => acc + (tx.amountINR || 0), 0)
  const avgTransaction = transactions.length > 0 ? totalVolume / transactions.length : 0

  return (
    <div className="min-h-screen bg-background">
      <PaymentFlowModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground">
              Hello, {user?.name?.split(' ')[0] || 'User'}! 👋
            </h1>
            <p className="text-muted-foreground mt-1">Here&apos;s your financial overview</p>
          </motion.div>
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:bg-secondary/20 transition-all text-sm font-medium disabled:opacity-50"
            >
              <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] transition-all"
            >
              <Plus size={18} />
              New Payment
            </button>
          </motion.div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Total Balance */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-5 sm:p-6 shadow-lg shadow-primary/10"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Wallet size={20} className="text-primary" />
              </div>
              <button
                onClick={() => setHideBalance(!hideBalance)}
                className="p-1.5 rounded-lg hover:bg-secondary/20 text-muted-foreground transition-colors"
              >
                {hideBalance ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Total Balance</p>
            <p className="text-2xl sm:text-3xl font-black text-foreground">
              {hideBalance ? '••••••' : '₹71,234'}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <TrendingUp size={14} className="text-accent-success" />
              <span className="text-accent-success font-medium">+12.5%</span>
              <span className="text-muted-foreground">this month</span>
            </div>
          </motion.div>

          {/* USDC Holdings */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-border bg-secondary/20 p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                <Sparkles size={20} className="text-secondary" />
              </div>
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">USDC on Solana</p>
            <p className="text-2xl sm:text-3xl font-black text-foreground">
              {hideBalance ? '••••' : '$854.23'}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <span className="text-muted-foreground">≈ ₹71,234</span>
            </div>
          </motion.div>

          {/* Monthly Spending */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-border bg-card/50 p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <BarChart3 size={20} className="text-accent" />
              </div>
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Monthly Volume</p>
            <p className="text-2xl sm:text-3xl font-black text-foreground">
              {hideBalance ? '••••••' : `₹${totalVolume.toLocaleString()}`}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <TrendingUp size={14} className="text-accent-success" />
              <span className="text-accent-success font-medium">+₹12,450</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          </motion.div>

          {/* Avg Transaction */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-border bg-card/50 p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <CreditCard size={20} className="text-yellow-500" />
              </div>
            </div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Avg Transaction</p>
            <p className="text-2xl sm:text-3xl font-black text-foreground">
              ₹{avgTransaction.toFixed(0) || '0'}
            </p>
            <div className="flex items-center gap-1 mt-2 text-xs">
              <span className="text-muted-foreground">Avg: ₹{avgTransaction.toFixed(0)}</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Charts Row */}
        <motion.div
          className="grid lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Portfolio Chart */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 rounded-2xl border border-border bg-card/50 p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-foreground">Volume Trends</h3>
                <p className="text-xs text-muted-foreground">Last 7 months</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold">Weekly</button>
                <button className="px-3 py-1.5 rounded-lg bg-card text-muted-foreground text-xs font-medium hover:text-foreground transition-colors">Monthly</button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={portfolioData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#9945FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#9945FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D2D42" vertical={false} />
                <XAxis dataKey="date" stroke="#A1A8C1" style={{ fontSize: '12px', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#A1A8C1" style={{ fontSize: '12px', fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141829',
                    border: '1px solid #2D2D42',
                    borderRadius: '12px',
                    color: '#FFFFFF'
                  }}
                  labelStyle={{ color: '#A1A8C1' }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Volume']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#9945FF"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Spending Breakdown */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-border bg-card/50 p-6"
          >
            <h3 className="text-lg font-bold text-foreground mb-6">Spending Breakdown</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={spendingBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {spendingBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141829',
                    border: '1px solid #2D2D42',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 mt-4">
              {spendingBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-medium text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Row */}
        <motion.div
          className="grid lg:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Recent Transactions */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-border bg-card/50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">Recent Transactions</h3>
              <button 
                onClick={() => router.push('/dashboard/payments')}
                className="text-xs text-primary hover:text-primary-dark font-medium flex items-center gap-1 transition-colors"
              >
                View All
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {transactions.length > 0 ? (
                transactions.slice(0, 5).map((tx, idx) => (
                  <div
                    key={tx.id || idx}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/30 transition-colors border border-transparent hover:border-border/50"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        tx.status === 'COMPLETED' ? 'bg-accent-success/10' : 'bg-yellow-500/10'
                      }`}>
                        {tx.status === 'COMPLETED' ? (
                          <ArrowDownLeft className="w-5 h-5 text-accent-success" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">{tx.merchant?.businessName || tx.description || 'Payment'}</p>
                        <p className="text-xs text-muted-foreground">{tx.category || 'General'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">-₹{tx.amountINR?.toLocaleString() || 0}</p>
                      <p className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full mt-1 inline-block ${
                        tx.status === 'COMPLETED' ? 'bg-accent-success/10 text-accent-success' : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {tx.status?.toLowerCase() || 'pending'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CreditCard size={40} className="text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No transactions yet</p>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="mt-4 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors"
                  >
                    Make your first payment
                  </button>
                </div>
              )}
            </div>
          </motion.div>

          {/* AI Insights */}
          <motion.div
            variants={itemVariants}
            className="rounded-2xl border border-border bg-card/50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                  <Zap size={16} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-foreground">AI Insights</h3>
              </div>
              <button 
                onClick={() => router.push('/dashboard/ai-copilot')}
                className="text-xs text-primary hover:text-primary-dark font-medium flex items-center gap-1 transition-colors"
              >
                View All
                <ChevronRight size={14} />
              </button>
            </div>
            <div className="space-y-3">
              {insights.length > 0 ? (
                insights.slice(0, 3).map((insight, idx) => (
                  <div
                    key={insight.id || idx}
                    className="p-4 rounded-xl bg-gradient-to-r from-secondary/5 to-primary/5 border border-border/50 hover:border-primary/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{insight.title}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{insight.description}</p>
                      </div>
                      <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Sparkles size={40} className="text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">AI insights will appear here</p>
                  <p className="text-xs text-muted-foreground mt-1">Make transactions to get personalized insights</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h3 className="text-lg font-bold text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button
              onClick={() => setShowPaymentModal(true)}
              className="p-5 rounded-2xl border border-border bg-card/50 hover:bg-secondary/30 hover:border-primary/50 transition-all text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowUpRight size={24} className="text-primary" />
              </div>
              <p className="font-semibold text-foreground text-sm">Pay with UPI</p>
              <p className="text-xs text-muted-foreground mt-1">Send crypto via UPI</p>
            </button>
            <button
              onClick={() => router.push('/dashboard/wallet')}
              className="p-5 rounded-2xl border border-border bg-card/50 hover:bg-secondary/30 hover:border-primary/50 transition-all text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary/10 mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Wallet size={24} className="text-secondary" />
              </div>
              <p className="font-semibold text-foreground text-sm">My Wallet</p>
              <p className="text-xs text-muted-foreground mt-1">View balances</p>
            </button>
            <button
              onClick={() => router.push('/dashboard/analytics')}
              className="p-5 rounded-2xl border border-border bg-card/50 hover:bg-secondary/30 hover:border-primary/50 transition-all text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BarChart3 size={24} className="text-accent" />
              </div>
              <p className="font-semibold text-foreground text-sm">Analytics</p>
              <p className="text-xs text-muted-foreground mt-1">View insights</p>
            </button>
            <button
              onClick={() => router.push('/dashboard/automation')}
              className="p-5 rounded-2xl border border-border bg-card/50 hover:bg-secondary/30 hover:border-primary/50 transition-all text-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap size={24} className="text-yellow-500" />
              </div>
              <p className="font-semibold text-foreground text-sm">Automation</p>
              <p className="text-xs text-muted-foreground mt-1">Set up rules</p>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
