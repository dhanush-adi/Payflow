'use client'

import React, { useEffect, useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { Copy, Download, Eye, EyeOff, Plus, Send, ArrowUpRight, ArrowDownLeft, Check, Loader2, RefreshCw, Zap, Wallet as WalletIcon } from 'lucide-react'
import { paymentsApi } from '@/lib/api'
import { usePhantom, truncateAddress } from '@/components/providers/phantom-provider'
import { PhantomConnectButton } from '@/components/ui/phantom-connect-button'
import { PhantomStatus } from '@/components/ui/phantom-status'
import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from '@solana/web3.js'
import { toast } from 'sonner'

export default function WalletPage() {
  const { isConnected, address, isReady, connect, disconnect } = usePhantom()
  const [balance, setBalance] = useState(0)
  const [showBalance, setShowBalance] = useState(true)
  const [copied, setCopied] = useState(false)
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoadingTxs, setIsLoadingTxs] = useState(true)
  const [isAirdroping, setIsAirdroping] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')

  useEffect(() => {
    if (address) {
      fetchBalance()
      fetchTransactions()
    }
  }, [address])

  const fetchBalance = async () => {
    if (!address) return
    try {
      const pubKey = new PublicKey(address)
      const bal = await connection.getBalance(pubKey)
      setBalance(bal / LAMPORTS_PER_SOL)
    } catch (err) {
      console.error('Failed to fetch balance:', err)
    }
  }

  const fetchTransactions = async () => {
    // Skip if not authenticated
    const token = localStorage.getItem('token')
    if (!token) {
      setIsLoadingTxs(false)
      return
    }
    try {
      const txData = await paymentsApi.getTransactions(10, 0)
      setTransactions(txData.data?.items || txData.items || [])
    } catch (err: any) {
      // Silently handle 401 - user not authenticated
      if (err?.response?.status !== 401) {
        console.error('Failed to fetch wallet data:', err)
      }
    } finally {
      setIsLoadingTxs(false)
    }
  }

  const handleCopy = (addr: string) => {
    if (!addr) return
    navigator.clipboard.writeText(addr)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchBalance()
    await fetchTransactions()
    setIsRefreshing(false)
  }

  const handleAirdrop = async () => {
    if (!address) return
    setIsAirdroping(true)
    try {
      const pubKey = new PublicKey(address)
      const airdropSignature = await connection.requestAirdrop(pubKey, LAMPORTS_PER_SOL)
      await connection.confirmTransaction(airdropSignature, 'confirmed')
      toast.success('Airdropped 1 SOL successfully!')
      await fetchBalance()
    } catch (err: any) {
      toast.error('Airdrop failed. Try again in a few seconds.')
      console.error(err)
    } finally {
      setIsAirdroping(false)
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

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-[1200px] mx-auto">
      <PhantomStatus />

      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Wallet</h1>
          <p className="text-foreground-secondary mt-1">Manage your Solana assets and transactions</p>
        </motion.div>
        {isConnected && (
          <motion.div variants={itemVariants} className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-secondary transition-colors text-sm font-medium"
            >
              <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Wallet Connection Card */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-secondary/10 p-8 shadow-xl shadow-black/20"
      >
        {!isConnected ? (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary mx-auto flex items-center justify-center">
              <WalletIcon size={40} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Connect Your Wallet</h2>
              <p className="text-foreground-secondary max-w-md mx-auto">
                Connect your Phantom wallet to manage USDC on Solana and track your transactions
              </p>
            </div>
            <div className="flex justify-center">
              <PhantomConnectButton
                onConnected={() => {}}
                showDisconnect={false}
              />
            </div>
            <p className="text-xs text-foreground-secondary">
              Don&apos;t have Phantom?{' '}
              <a href="https://phantom.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Download here
              </a>
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Main Wallet</h2>
                <p className="text-foreground-secondary text-sm">Connected via Phantom</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent-success/10 text-accent-success border border-accent-success/20 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-accent-success animate-pulse" />
                Connected
              </span>
            </div>

            {/* Balance Display */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground-secondary">SOL Balance</p>
              <div className="flex items-center gap-4">
                <p className="text-5xl font-extrabold text-foreground tracking-tight">
                  {showBalance ? `${balance.toFixed(4)} SOL` : '••••••'}
                </p>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-2 rounded-lg hover:bg-secondary/50 text-foreground-secondary hover:text-foreground transition-all"
                >
                  {showBalance ? <Eye size={24} /> : <EyeOff size={24} />}
                </button>
              </div>
              <p className="text-sm text-foreground-secondary">≈ ${(balance * 180).toFixed(2)} USD</p>
            </div>

            {/* Address Copy */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground-secondary">Wallet Address</p>
              <button
                onClick={() => handleCopy(address!)}
                className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-background/50 hover:border-primary transition-all group backdrop-blur-sm"
              >
                <code className="text-sm font-mono text-foreground break-all mr-4 text-left">
                  {truncateAddress(address!, 12)}
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
                    <Download size={18} />
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
                    <span className="text-sm font-medium text-foreground">Devnet</span>
                  </div>
                  <button
                    onClick={handleAirdrop}
                    disabled={isAirdroping}
                    className="text-xs text-primary hover:text-primary-dark font-bold flex items-center gap-1"
                  >
                    {isAirdroping ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Zap size={12} />
                    )}
                    Airdrop SOL
                  </button>
                </div>
              </div>
            </div>

            <PhantomConnectButton showDisconnect={true} />
          </div>
        )}
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
          {isLoadingTxs ? (
            <div className="flex justify-center p-4">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : transactions.length > 0 ? (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-secondary/40 transition-all border border-transparent hover:border-border/50"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    tx.amountUSDC > 0 ? 'bg-accent-success/10' : 'bg-accent-warning/10'
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
                    ${tx.amountUSDC?.toFixed(2) || '0.00'}
                  </p>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mt-1 inline-block ${
                    tx.status === 'COMPLETED' 
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
              <WalletIcon size={40} className="text-muted-foreground/50 mx-auto" />
              <p className="text-foreground-secondary font-medium">No transactions found</p>
              <p className="text-xs text-muted-foreground">Connect your wallet and make your first payment</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
