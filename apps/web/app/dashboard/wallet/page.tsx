'use client'

import React, { useEffect, useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { Copy, Download, Upload, Eye, EyeOff, Plus, Send, ArrowUpRight, ArrowDownLeft, Check, Loader2 } from 'lucide-react'
import { authApi, paymentsApi } from '@/lib/api'

export default function WalletPage() {
  const [showBalance, setShowBalance] = useState(false)
  const [copied, setCopied] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, txData] = await Promise.all([
          authApi.getProfile(),
          paymentsApi.getTransactions(10, 0)
        ])
        setUser(profileData)
        setTransactions(txData)
      } catch (err) {
        console.error('Failed to fetch wallet data:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
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

  const handleCopy = (address: string) => {
    if (!address) return
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  const primaryAddress = user?.solanaAddress || 'Connect your wallet'

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
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Wallet</h1>
          <p className="text-foreground-secondary mt-1">Manage your Solana addresses and transactions</p>
        </motion.div>
        <motion.div variants={itemVariants} className="flex gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors text-sm font-medium">
            <Upload size={18} />
            Deposit
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary-dark transition-colors text-sm font-medium">
            <Download size={18} />
            Withdraw
          </button>
        </motion.div>
      </motion.div>

      {/* Primary Wallet */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl border border-border bg-secondary/30 p-8 space-y-6 shadow-xl shadow-black/20"
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-2">Main Wallet</h2>
            <p className="text-foreground-secondary">Your primary Solana address</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            Active
          </span>
        </div>

        {/* Balance Display */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground-secondary">SOL Balance</p>
          <div className="flex items-center gap-4">
            <p className="text-5xl font-extrabold text-foreground tracking-tight">
              {showBalance ? '5.234 SOL' : '••••••'}
            </p>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 rounded-lg hover:bg-secondary/50 text-foreground-secondary hover:text-foreground transition-all"
            >
              {showBalance ? <Eye size={24} /> : <EyeOff size={24} />}
            </button>
          </div>
          <p className="text-sm text-foreground-secondary">≈ $1,567.02 USD</p>
        </div>

        {/* Address Copy */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground-secondary">Wallet Address</p>
          <button
            onClick={() => handleCopy(primaryAddress)}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-background/50 hover:border-primary transition-all group backdrop-blur-sm"
          >
            <code className="text-sm font-mono text-foreground break-all mr-4 text-left">
              {primaryAddress}
            </code>
            <div className="flex-shrink-0">
              {copied ? (
                <Check className="w-5 h-5 text-accent-success" />
              ) : (
                <Copy className="w-5 h-5 text-foreground-secondary group-hover:text-foreground transition-colors" />
              )}
            </div>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-6 pt-6 border-t border-border/50">
          <div className="flex-1 space-y-4">
            <p className="text-sm font-medium text-foreground-secondary">Quick Actions</p>
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-background/30 hover:bg-secondary transition-all font-medium text-sm">
                <Send size={18} />
                Send
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-background/30 hover:bg-secondary transition-all font-medium text-sm">
                <Upload size={18} />
                Receive
              </button>
            </div>
          </div>
          <div className="hidden sm:block w-px bg-border/50" />
          <div className="flex-1 space-y-4">
            <p className="text-sm font-medium text-foreground-secondary">Network Status</p>
            <div className="p-3 rounded-xl border border-border bg-background/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent-success animate-pulse" />
                <span className="text-sm font-medium text-foreground">Mainnet Beta</span>
              </div>
              <span className="text-xs text-foreground-secondary">1.4ms Latency</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Transaction History */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl border border-border bg-secondary/30 p-6 shadow-xl shadow-black/20"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Transaction History</h2>
          <button className="text-sm text-primary hover:text-primary-dark font-medium transition-colors">
            View All
          </button>
        </div>

        <div className="space-y-1">
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/40 transition-all border border-transparent hover:border-border/50"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.status === 'SUCCESS' ? 'bg-accent-success/10' : 'bg-accent-warning/10'
                  }`}>
                    {tx.amountUSDC > 0 ? (
                      <ArrowDownLeft className="w-5 h-5 text-accent-success" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-accent-warning" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">
                      {tx.merchant?.businessName || 'Payment'}
                    </p>
                    <p className="text-xs text-foreground-secondary">
                      {new Date(tx.createdAt).toLocaleDateString()} at {new Date(tx.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-foreground">
                    ${tx.amountUSDC.toFixed(2)}
                  </p>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 inline-block ${
                    tx.status === 'SUCCESS' 
                      ? 'bg-accent-success/10 text-accent-success' 
                      : 'bg-accent-warning/10 text-accent-warning'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 space-y-3">
              <p className="text-foreground-secondary font-medium">No transactions found</p>
              <button className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-bold border border-primary/20">
                Make your first payment
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
