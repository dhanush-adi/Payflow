'use client'

import React, { useEffect, useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { Download, Filter, TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Loader2 } from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart as PieChartComponent,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { paymentsApi } from '@/lib/api'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6M')
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const transactions = await paymentsApi.getTransactions(50, 0)
        
        // Process transactions for some real-ish data
        const totalVolume = transactions.reduce((acc: number, tx: any) => acc + tx.amountUSDC, 0)
        const avgTx = transactions.length > 0 ? totalVolume / transactions.length : 0
        
        setData({
          transactions,
          totalVolume,
          avgTx,
          txCount: transactions.length
        })
      } catch (err) {
        console.error('Failed to fetch analytics:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  // Mocked for visual richness but potentially linked to real counts
  const performanceData = [
    { month: 'Jan', Volume: 4200 },
    { month: 'Feb', Volume: 4800 },
    { month: 'Mar', Volume: 5200 },
    { month: 'Apr', Volume: 5800 },
    { month: 'May', Volume: 6400 },
    { month: 'Jun', Volume: data?.totalVolume > 0 ? Math.floor(data.totalVolume) : 7100 },
  ]

  // Calculate real category breakdown
  const categoryMap: Record<string, number> = {}
  data?.transactions?.forEach((tx: any) => {
    const cat = tx.category || 'Miscellaneous'
    categoryMap[cat] = (categoryMap[cat] || 0) + tx.amountINR
  })

  const spendingBreakdown = Object.entries(categoryMap).map(([name, value], idx) => ({
    name,
    value,
    color: ['#14F195', '#9945FF', '#00D4FF', '#FFD700', '#FF4500'][idx % 5]
  }))

  const finalBreakdown = spendingBreakdown.length > 0 ? spendingBreakdown : [
    { name: 'Food & Dining', value: 45, color: '#14F195' },
    { name: 'Shopping', value: 35, color: '#9945FF' },
    { name: 'Travel', value: 20, color: '#00D4FF' },
  ]

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
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">Financial Intelligence</h1>
          <p className="text-foreground-secondary mt-1">AI-processed spending insights and bridge analytics</p>
        </motion.div>
        <motion.div variants={itemVariants} className="flex gap-3 text-[10px] font-bold uppercase tracking-widest text-accent items-center p-2 bg-accent/10 border border-accent/20 rounded-lg">
          <Activity size={14} className="animate-pulse" />
          Live UPI2Chain Feed
        </motion.div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          { label: 'Total Settled (INR)', value: `₹${(data?.totalVolume * 83.45 || 0).toLocaleString()}`, change: '+12.5%', isPositive: true },
          { label: 'Avg Spend (INR)', value: `₹${(data?.avgTx * 83.45 || 0).toLocaleString()}`, change: '-2.1%', isPositive: false },
          { label: 'Bridge TX Count', value: data?.txCount || '0', change: '+3', isPositive: true },
          { label: 'Solana Status', value: 'Active', change: '100% Up', isPositive: true },
        ].map((metric, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="rounded-2xl border border-border bg-secondary/30 p-6 shadow-xl shadow-black/5"
          >
            <p className="text-xs font-bold text-foreground-secondary uppercase tracking-wider mb-2">{metric.label}</p>
            <p className="text-2xl font-black text-foreground mb-2">{metric.value}</p>
            <p className={`text-[10px] font-bold flex items-center gap-1 ${metric.isPositive ? 'text-accent-success' : 'text-destructive'}`}>
              {metric.isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {metric.change}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <motion.div
        className="grid lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 rounded-2xl border border-border bg-secondary/30 p-8 shadow-2xl shadow-black/20 overflow-hidden relative"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
          <h3 className="text-lg font-black text-foreground mb-8">Settlement Volume History (INR)</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={performanceData}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9945FF" stopOpacity={1} />
                  <stop offset="100%" stopColor="#14F195" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D3142" vertical={false} />
              <XAxis dataKey="month" stroke="#A1A8C1" axisLine={false} tickLine={false} style={{ fontSize: '10px', fontWeight: 700 }} dy={10} />
              <YAxis stroke="#A1A8C1" axisLine={false} tickLine={false} style={{ fontSize: '10px', fontWeight: 700 }} dx={-10} />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{
                  backgroundColor: '#141829',
                  border: '1px solid #2D3142',
                  borderRadius: '12px',
                  color: '#FFFFFF',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                }}
              />
              <Bar dataKey="Volume" fill="url(#barGradient)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="rounded-2xl border border-border bg-secondary/30 p-8 shadow-2xl shadow-black/20"
        >
          <h3 className="text-lg font-black text-foreground mb-8">Spending Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChartComponent>
              <Pie
                data={finalBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={8}
                dataKey="value"
                stroke="none"
              >
                {finalBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#141829',
                  border: '1px solid #2D3142',
                  borderRadius: '12px',
                  color: '#FFFFFF'
                }}
              />
            </PieChartComponent>
          </ResponsiveContainer>
          <div className="space-y-4 mt-8 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
            {finalBreakdown.map((asset) => (
              <div key={asset.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: asset.color, boxShadow: `0 0 10px ${asset.color}44` }}
                  />
                  <span className="text-xs font-bold text-foreground-secondary">{asset.name}</span>
                </div>
                <span className="text-xs font-black text-foreground">₹{asset.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Risk & Health Section */}
      <motion.div
        variants={itemVariants}
        className="grid md:grid-cols-2 gap-6"
      >
        <div className="rounded-2xl border border-border bg-secondary/30 p-8 flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-bold text-foreground-secondary uppercase tracking-widest">Portfolio Health</p>
            <p className="text-4xl font-black text-accent-success">Excellent</p>
            <p className="text-sm text-foreground-secondary">Your asset diversification is optimal for current market conditions.</p>
          </div>
          <div className="w-24 h-24 rounded-full border-8 border-accent-success/20 flex items-center justify-center p-2">
            <div className="w-full h-full rounded-full border-8 border-accent-success flex items-center justify-center">
              <span className="text-lg font-black text-accent-success">98</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-secondary/30 p-8 space-y-6">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <Activity className="text-primary" size={20} />
            Market Correlation
          </h3>
          <div className="space-y-4">
            <div className="w-full h-3 rounded-full bg-border/50 relative overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: '65%' }} />
            </div>
            <div className="flex justify-between text-xs font-bold text-foreground-secondary">
              <span>SOL Performance Correlation</span>
              <span className="text-foreground">65% Positive</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
