'use client'

import React, { useEffect, useState } from 'react'
import { motion, Variants } from 'framer-motion'
import { Send, Zap, TrendingUp, AlertCircle, Lightbulb, Target, Brain, Loader2, Sparkles } from 'lucide-react'
import { aiApi } from '@/lib/api'

export default function AICopilotPage() {
  const [input, setInput] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [insights, setInsights] = useState<any[]>([])
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const data = await aiApi.getInsights()
        setInsights(data)
      } catch (err) {
        console.error('Failed to fetch AI insights:', err)
      } finally {
        setIsFetching(false)
      }
    }
    fetchInsights()
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

  const handleSend = () => {
    if (input.trim()) {
      setIsLoading(true)
      setTimeout(() => setIsLoading(false), 2000)
      setInput('')
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'SUBSCRIPTION_ALERT': return AlertCircle
      case 'BUDGET_WARNING': return Target
      case 'SAVINGS_SUGGESTION': return TrendingUp
      default: return Lightbulb
    }
  }

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    )
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
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Sparkles size={24} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tighter">Financial Copilot</h1>
          </div>
          <p className="text-foreground-secondary">Your intelligent agent for bridging UPI payments and Solana assets</p>
        </motion.div>
      </motion.div>

      {/* Smart Suggestions */}
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="text-primary" size={20} />
            Recent Insights
          </h2>
          <button className="text-sm text-primary hover:text-primary-dark font-medium transition-colors">
            Refresh Analysis
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {insights.length > 0 ? (
            insights.map((insight, index) => {
              const Icon = getIcon(insight.type)
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="rounded-xl border border-border bg-secondary/30 p-6 hover:border-primary/50 transition-all cursor-pointer group hover:bg-secondary/40 shadow-lg shadow-black/10"
                >
                  <div className="flex gap-4">
                    <div className="p-3 rounded-lg bg-background border border-border group-hover:border-primary/30 transition-colors h-fit">
                      <Icon className="w-6 h-6 text-primary flex-shrink-0" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {insight.title}
                      </h3>
                      <p className="text-sm text-foreground-secondary mb-4 leading-relaxed">
                        {insight.description}
                      </p>
                      <button className="text-xs text-primary hover:text-primary-dark font-bold uppercase tracking-wider transition-all opacity-0 group-hover:opacity-100 flex items-center gap-1">
                        Take Action <Zap size={12} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <div className="md:col-span-2 py-12 text-center rounded-xl border border-dashed border-border bg-secondary/10">
              <p className="text-foreground-secondary font-medium">No insights generated yet. Start trading to see AI recommendations!</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Chat Interface (Simplified Placeholder) */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl border border-border bg-secondary/30 overflow-hidden flex flex-col h-[500px] shadow-2xl shadow-black/40"
      >
        <div className="p-4 border-b border-border flex items-center justify-between bg-background/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-accent-success animate-pulse" />
            <span className="text-sm font-semibold text-foreground">AI Active Intelligence</span>
          </div>
          <button className="text-xs text-foreground-secondary hover:text-foreground">Clear Chat</button>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-secondary/10">
          <div className="flex justify-start">
            <div className="max-w-md rounded-2xl rounded-tl-none p-4 bg-background border border-border text-foreground shadow-sm">
              <p className="text-sm leading-relaxed">
                Hello! I'm your AI Trading Copilot. I've analyzed your recent transactions and wallet activity. How can I help you optimize your portfolio today?
              </p>
            </div>
          </div>
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-background border border-border rounded-xl p-4">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border bg-background/50">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Query your portfolio analytics..."
              className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="px-5 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
