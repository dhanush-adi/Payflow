'use client'

import React, { useEffect, useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { User, Mail, Shield, Wallet, Calendar, CheckCircle, Loader2, Camera } from 'lucide-react'
import { authApi } from '@/lib/api'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authApi.getProfile()
        setUser(data)
      } catch (err) {
        console.error('Failed to fetch profile:', err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-2"
      >
        <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl font-bold text-foreground">
          Profile Settings
        </motion.h1>
        <motion.p variants={itemVariants} className="text-foreground-secondary">
          Manage your account information and preferences
        </motion.p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-3 gap-8"
      >
        {/* Left Column - Avatar & Core Info */}
        <motion.div variants={itemVariants} className="md:col-span-1 space-y-6">
          <div className="rounded-2xl border border-border bg-secondary/30 p-8 text-center space-y-4">
            <div className="relative mx-auto w-32 h-32">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-black text-foreground shadow-xl shadow-primary/20">
                {user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <button className="absolute bottom-0 right-0 p-2 rounded-full bg-background border border-border text-foreground-secondary hover:text-foreground transition-colors shadow-lg">
                <Camera size={18} />
              </button>
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{user?.name || 'Anonymous User'}</h2>
              <p className="text-sm text-foreground-secondary">{user?.role || 'Basic Account'}</p>
            </div>
            <div className="flex justify-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent-success/10 text-accent-success flex items-center gap-1">
                <CheckCircle size={12} />
                Verified
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-secondary/30 p-6 space-y-4">
            <h3 className="text-sm font-semibold text-foreground-secondary uppercase tracking-wider">Account Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-foreground-secondary">Member since</span>
                <span className="text-foreground font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground-secondary">Security Level</span>
                <span className="text-accent-success font-medium">High</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column - Detailed Info */}
        <motion.div variants={itemVariants} className="md:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-secondary/30 overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-secondary/20">
              <h3 className="font-semibold text-foreground">Personal Information</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground-secondary flex items-center gap-2">
                    <User size={14} /> Full Name
                  </label>
                  <p className="p-3 rounded-lg border border-border bg-background text-foreground">
                    {user?.name || 'Not provided'}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground-secondary flex items-center gap-2">
                    <Mail size={14} /> Email Address
                  </label>
                  <p className="p-3 rounded-lg border border-border bg-background text-foreground">
                    {user?.email}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground-secondary flex items-center gap-2">
                    <Shield size={14} /> KYC Status
                  </label>
                  <p className="p-3 rounded-lg border border-border bg-background text-foreground">
                    {user?.kycStatus || 'Not Started'}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground-secondary flex items-center gap-2">
                    <Wallet size={14} /> Solana Address
                  </label>
                  <p className="p-3 rounded-lg border border-border bg-background text-foreground font-mono text-xs truncate">
                    {user?.solanaAddress || 'No address linked'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-secondary/30 overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-secondary/20 flex justify-between items-center">
              <h3 className="font-semibold text-foreground">Preferences</h3>
              <button className="text-sm text-primary hover:text-primary-dark transition-colors font-medium">
                Edit
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-foreground">Email Notifications</p>
                  <p className="text-xs text-foreground-secondary">Receive weekly portfolio updates</p>
                </div>
                <div className="w-10 h-6 rounded-full bg-primary relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-foreground shadow-sm" />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-xs text-foreground-secondary">Extra layer of security for withdrawals</p>
                </div>
                <div className="w-10 h-6 rounded-full bg-secondary/20 relative cursor-pointer">
                  <div className="absolute left-1 top-1 w-4 h-4 rounded-full bg-foreground shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
