'use client'

import React, { useState, useEffect } from 'react'
import { motion, Variants } from 'framer-motion'
import { Sparkles, Save, ShieldCheck, Zap, ArrowRight, Settings2, Plus, Info } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function AutomationPage() {
  const [rules, setRules] = useState([
    {
      id: 'round-up',
      name: 'Auto Round-up Savings',
      description: 'Round every UPI transaction to the nearest ₹10 and save the difference in USDC.',
      type: 'ROUND_UP',
      active: true,
      lastRun: '2 hours ago',
      totalSaved: '₹452.00 ($5.42)'
    },
    {
      id: 'fixed-percent',
      name: 'Fixed 5% Investment',
      description: 'Auto-invest 5% of every stablecoin settlement into the Jupiter SOL Index.',
      type: 'PERCENTAGE',
      active: false,
      lastRun: 'Never',
      totalSaved: '₹0.00'
    },
    {
      id: 'tax-vault',
      name: 'GST/Tax Reserve',
      description: 'Automatically move 18% of received payments to a dedicated Tax Reserve wallet.',
      type: 'PERCENTAGE',
      active: true,
      lastRun: '1 day ago',
      totalSaved: '₹12,450.00 ($149.20)'
    }
  ])

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div variants={itemVariants} initial="hidden" animate="visible">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-accent/20 rounded-lg">
            <Zap className="text-accent w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-foreground">Copilot Automation</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl">
          Let your Financial Copilot handle the heavy lifting. Enable rule-based automation to save, invest, and manage taxes in real-time.
        </p>
      </motion.div>

      {/* Rules Grid */}
      <motion.div
        className="grid gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {rules.map((rule) => (
          <motion.div
            key={rule.id}
            variants={itemVariants}
            className={cn(
              "p-6 rounded-2xl border transition-all duration-300",
              rule.active 
                ? "bg-secondary/40 border-primary/30 glow-primary/5" 
                : "bg-secondary/20 border-border opacity-70 grayscale-[0.5]"
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                  rule.active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                )}>
                  {rule.type === 'ROUND_UP' ? <Save size={24} /> : <ShieldCheck size={24} />}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-foreground">{rule.name}</h3>
                    {rule.active && (
                      <span className="px-2 py-0.5 rounded-full bg-accent/20 text-accent text-[10px] font-bold uppercase">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {rule.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1">Total Impact</p>
                  <p className="text-lg font-black text-foreground">{rule.totalSaved}</p>
                </div>
                <div className="h-10 w-[1px] bg-border hidden sm:block" />
                <div className="flex items-center gap-4">
                  {/* @ts-ignore */}
                  <Switch 
                    checked={rule.active} 
                    onCheckedChange={(val) => {
                      setRules(rules.map(r => r.id === rule.id ? { ...r, active: val } : r))
                    }}
                  />
                </div>
              </div>
            </div>

            {rule.active && (
              <div className="mt-6 pt-6 border-t border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                   <div className="flex items-center gap-1">
                     <Settings2 size={14} />
                     Configured to Wallet: 6kKz...7xQw
                   </div>
                   <div className="w-1 h-1 rounded-full bg-border" />
                   <div>Last run: {rule.lastRun}</div>
                </div>
                <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1 group">
                  Adjustment Log <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>
        ))}

        {/* Create Custom Rule */}
        <motion.div
           variants={itemVariants}
           className="p-6 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center gap-4 text-center group hover:border-primary/50 transition-colors cursor-pointer"
        >
          <div className="w-12 h-12 rounded-full border border-dashed border-border flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 transition-all">
            <Plus size={24} />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Create Custom Rule</h3>
            <p className="text-sm text-muted-foreground">Design your own automated financial logic</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Info Card */}
      <motion.div
        variants={itemVariants}
        className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex gap-4 items-start"
      >
        <Info className="text-primary shrink-0 mt-0.5" size={20} />
        <div className="space-y-1">
          <p className="text-sm font-semibold text-foreground">How it works</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Automations are triggered specifically during the hybrid settlement phase. When a UPI payment is confirmed, the system calculates the rule requirements and submits an additional instruction to the blockchain alongside the primary merchant settlement.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
