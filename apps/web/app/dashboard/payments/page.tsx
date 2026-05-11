'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import { Send, Plus, Download, ArrowRight, Clock, CheckCircle2, Loader2, AlertCircle } from 'lucide-react'
import { paymentsApi } from '@/lib/api'

const templates = [
  { id: 1, name: 'Monthly Salary', recipient: 'Company Account', amount: 5000 },
  { id: 2, name: 'Rent Payment', recipient: 'Landlord Wallet', amount: 2000 },
  { id: 3, name: 'Freelance Payment', recipient: 'Contractor Pool', amount: 1000 },
]

const isAuthenticated = () => {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('token')
}

export default function PaymentsPage() {
  const [showSendModal, setShowSendModal] = useState(false)
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [formData, setFormData] = useState({ recipient: '', asset: 'SOL', amount: '', description: '' })

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setIsLoading(false)
        return
      }
      try {
        const txs = await paymentsApi.getTransactions()
        setTransactions(txs.data || [])
      } catch (e: any) {
        if (e?.response?.status !== 401) {
          console.error("Failed to load transactions", e)
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchTransactions()
  }, [])

  const handleSendPaymentClick = () => {
    if (!isAuthenticated()) {
      setShowLoginPrompt(true)
      setTimeout(() => setShowLoginPrompt(false), 4000)
      return
    }
    setShowSendModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated()) {
      setShowLoginPrompt(true)
      setTimeout(() => setShowLoginPrompt(false), 4000)
      return
    }
    setIsSubmitting(true)
    try {
      await paymentsApi.createPayment({
        merchantId: formData.recipient || 'clfz01...mock...',
        amount: Number(formData.amount),
        description: formData.description,
        targetChain: 'SOLANA',
        destinationAddress: formData.recipient,
        token: formData.asset as any,
        upiId: 'test@upi'
      })
      setShowSendModal(false)
      
      const updated = await paymentsApi.getTransactions()
      setTransactions(updated.data || [])
    } catch (e: any) {
      if (e?.response?.status === 401) {
        setShowLoginPrompt(true)
        setTimeout(() => setShowLoginPrompt(false), 4000)
      } else {
        console.error("Payment error", e)
      }
    } finally {
      setIsSubmitting(false)
    }
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
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Payments</h1>
          <p className="text-foreground-secondary mt-1">Send and receive cryptocurrencies instantly</p>
        </motion.div>
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          {showLoginPrompt && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm animate-pulse">
              <AlertCircle size={16} />
              <Link href="/login" className="underline font-medium">Sign in</Link> to make payments
            </div>
          )}
          <button
            onClick={handleSendPaymentClick}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary-dark transition-colors w-full sm:w-auto"
          >
            <Send size={20} />
            Send Payment
          </button>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[
          { label: 'Payments Today', value: '$2,450.50' },
          { label: 'Monthly Total', value: '$8,920.00' },
          { label: 'Avg. Transaction', value: '$342.31' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            className="rounded-xl border border-border bg-secondary/30 p-6"
          >
            <p className="text-sm font-medium text-foreground-secondary mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-foreground">{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {showSendModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowSendModal(false)}
        >
          <motion.div
            className="w-full max-w-md rounded-xl border border-border bg-background p-8 space-y-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h2 className="text-2xl font-bold text-foreground">Send Payment</h2>
              <p className="text-foreground-secondary mt-1">Transfer crypto to another address</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Recipient Address</label>
                <input
                  type="text"
                  value={formData.recipient}
                  onChange={(e) => setFormData({...formData, recipient: e.target.value})}
                  placeholder="Enter Solana address or ENS name"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Asset</label>
                  <select 
                    value={formData.asset}
                    onChange={(e) => setFormData({...formData, asset: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="SOL">SOL</option>
                    <option value="USDC">USDC</option>
                    <option value="JUP">JUP</option>
                    <option value="ORCA">ORCA</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Amount</label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="0.00"
                    className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-2">Description (optional)</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Add a note..."
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowSendModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary-dark transition-colors font-medium disabled:opacity-50"
                >
                  {isSubmitting ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      <motion.div
        variants={itemVariants}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Payment Templates</h2>
          <button className="text-primary hover:text-primary-dark transition-colors">
            <Plus size={18} />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                if (!isAuthenticated()) {
                  setShowLoginPrompt(true)
                  setTimeout(() => setShowLoginPrompt(false), 4000)
                }
              }}
              className="rounded-xl border border-border bg-secondary/30 p-6 hover:border-primary transition-colors cursor-pointer group"
            >
              <h3 className="font-semibold text-foreground mb-2">{template.name}</h3>
              <p className="text-sm text-foreground-secondary mb-4">{template.recipient}</p>
              <div className="flex items-center justify-between">
                <p className="font-bold text-foreground">${template.amount.toLocaleString()}</p>
                <button className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="rounded-xl border border-border bg-secondary/30 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Recent Payments</h2>
          <button className="text-sm text-primary hover:text-primary-dark transition-colors">
            <Download size={18} />
          </button>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : transactions.length > 0 ? transactions.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-border transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  payment.status === 'COMPLETED' ? 'bg-accent-success/10' : 'bg-accent-warning/10'
                }`}>
                  {payment.status === 'COMPLETED' ? (
                    <CheckCircle2 className="w-5 h-5 text-accent-success" />
                  ) : (
                    <Clock className="w-5 h-5 text-accent-warning" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{payment.merchantId || payment.recipient || 'Withdrawal'}</p>
                  <p className="text-sm text-foreground-secondary">{new Date(payment.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-foreground">-{payment.amountINR || payment.amount} {payment.asset || 'INR'}</p>
                <span className={`text-xs inline-block px-2 py-1 rounded mt-1 ${
                  payment.status === 'COMPLETED' ? 'bg-accent-success/10 text-accent-success' : 'bg-accent-warning/10 text-accent-warning'
                }`}>
                  {payment.status === 'COMPLETED' ? 'Complete' : 'Pending'}
                </span>
              </div>
            </div>
          )) : (
            <div className="text-center py-12 space-y-2">
              <p className="text-foreground-secondary font-medium">No payments found</p>
              <p className="text-sm text-foreground-secondary/70">Sign in to view your payment history</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
