'use client'

import React, { useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { Settings, Bell, Lock, Shield, Eye, Globe, Zap, Save, AlertCircle } from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')

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

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'nodes', label: 'Custom Nodes', icon: Zap },
  ]

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
          Account Settings
        </motion.h1>
        <motion.p variants={itemVariants} className="text-foreground-secondary">
          Configure your trading environment and personal preferences
        </motion.p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-4 gap-8"
      >
        {/* Sidebar Tabs */}
        <motion.div variants={itemVariants} className="md:col-span-1 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                    : 'text-foreground-secondary hover:text-foreground hover:bg-secondary/50'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            )
          })}
        </motion.div>

        {/* Content Area */}
        <motion.div variants={itemVariants} className="md:col-span-3">
          <div className="rounded-2xl border border-border bg-secondary/30 overflow-hidden shadow-xl shadow-black/20">
            <div className="p-8 space-y-8">
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Regional Settings</h3>
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground-secondary">Currency Display</label>
                        <select className="w-full p-3 rounded-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary outline-none transition-all">
                          <option>USD ($)</option>
                          <option>EUR (€)</option>
                          <option>INR (₹)</option>
                          <option>SOL</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground-secondary">Language</label>
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background text-foreground">
                          <Globe size={18} className="text-foreground-secondary" />
                          <span>English (US)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Theme Preferences</h3>
                    <div className="flex gap-4">
                      {['Dark', 'Light', 'System'].map((theme) => (
                        <button
                          key={theme}
                          className={`flex-1 py-3 px-4 rounded-xl border transition-all ${
                            theme === 'Dark'
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border bg-background hover:bg-secondary/50 text-foreground-secondary'
                          }`}
                        >
                          {theme}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-accent-warning/10 border border-accent-warning/20 flex gap-4 items-start">
                    <AlertCircle className="text-accent-warning flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">Security Recommendation</p>
                      <p className="text-xs text-foreground-secondary">Your account is missing Two-Factor Authentication. Enable it now to protect your assets.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">Authentication</h3>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-background/50 hover:bg-secondary/30 transition-all text-sm group">
                        <div className="flex items-center gap-3">
                          <Lock size={18} className="text-foreground-secondary" />
                          <span>Change Password</span>
                        </div>
                        <span className="text-primary group-hover:underline">Update</span>
                      </button>
                      <button className="w-full flex items-center justify-between p-4 rounded-xl border border-border bg-background/50 hover:bg-secondary/30 transition-all text-sm group">
                        <div className="flex items-center gap-3">
                          <Shield size={18} className="text-foreground-secondary" />
                          <span>Privacy Shield</span>
                        </div>
                        <span className="text-accent-success">Enabled</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground">Notification Channels</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Transaction Alerts', desc: 'Instant push for every trade' },
                      { label: 'Market Movers', desc: 'Big market shifts notifications' },
                      { label: 'Login Notifications', desc: 'Security alerts for new logins' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-border bg-background/50">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium text-foreground">{item.label}</p>
                          <p className="text-xs text-foreground-secondary">{item.desc}</p>
                        </div>
                        <div className="w-10 h-6 rounded-full bg-primary relative cursor-pointer">
                          <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-foreground" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-8 flex justify-end gap-4 border-t border-border mt-8">
                <button className="px-6 py-2.5 rounded-xl border border-border hover:bg-secondary transition-colors font-medium text-sm">
                  Cancel
                </button>
                <button className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground flex items-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 font-medium text-sm">
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
