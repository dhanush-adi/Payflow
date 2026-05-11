'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, Variants, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Send, 
  Loader2, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  Lightbulb,
  Target,
  Wallet,
  RefreshCw,
  Zap,
  ChevronDown,
  X,
  CheckCircle,
  MessageCircle,
  BarChart3,
  PiggyBank,
  Clock
} from 'lucide-react'
import { aiApi, paymentsApi } from '@/lib/api'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'insight' | 'recommendation' | 'alert'
}

const SUGGESTED_QUESTIONS = [
  "Show my spending analysis",
  "What are my top expenses?",
  "Suggest savings strategies",
  "Track my subscriptions",
  "Compare this month vs last",
]

const INITIAL_INSIGHTS = [
  { type: 'SAVINGS_SUGGESTION', title: 'Auto-Save Opportunity', desc: 'Round up transactions to save ₹1,250/month automatically', icon: PiggyBank, color: '#14F195' },
  { type: 'SUBSCRIPTION_ALERT', title: 'Subscription Found', desc: '3 active subscriptions worth ₹799/month detected', icon: Clock, color: '#9945FF' },
  { type: 'SPENDING_ALERT', title: 'High Spending Alert', desc: 'Your food expenses are 25% above average this week', icon: AlertCircle, color: '#FF6B6B' },
  { type: 'INVESTMENT_TIP', title: 'Investment Opportunity', desc: 'Consider allocating 10% to Jupiter SOL Index for diversification', icon: TrendingUp, color: '#00D4FF' },
]

export default function AICopilotPage() {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "👋 Hi! I'm your Financial Copilot. I can help you analyze spending, track subscriptions, and optimize your savings. What would you like to explore?",
      timestamp: new Date()
    }
  ])
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [activeInsight, setActiveInsight] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async (message?: string) => {
    const text = message || input.trim()
    if (!text) return

    setInput('')
    setShowSuggestions(false)

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    setIsLoading(true)
    
    try {
      const response = await aiApi.chat(text)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message || getMockResponse(text),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      // Fallback to mock responses
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: getMockResponse(text),
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      }, 1000)
    } finally {
      setIsLoading(false)
    }
  }

  const getMockResponse = (query: string): string => {
    const q = query.toLowerCase()
    
    if (q.includes('spending') || q.includes('expense') || q.includes('analysis')) {
      return `📊 **Spending Analysis**

Based on your transactions this month:
- **Total Spent:** ₹28,450
- **Top Category:** Food & Dining (₹8,450 - 30%)
- **Avg Transaction:** ₹567

Your spending increased by 12% compared to last month. The main drivers were:
1. 🍔 Food delivery (₹4,200)
2. 🛍️ Shopping (₹3,800)
3. 🚗 Transportation (₹2,100)

💡 **Recommendation:** Consider setting a weekly food budget of ₹1,500 to stay on track.`
    }
    
    if (q.includes('save') || q.includes('saving')) {
      return `💰 **Savings Insights**

Great news! Here are your auto-save opportunities:

**Auto Round-Up:** You could save ₹452/month by rounding up transactions

**Subscription Audit:** 
- Netflix ₹199/month
- Spotify ₹129/month
- Amazon Prime ₹299/month
- **Total:** ₹627/month

**Savings Potential:**
- If you enable auto-save with 5% round-ups: +₹1,420/month
- By canceling unused subscriptions: +₹299/month

Would you like me to set up automatic savings rules?`
    }
    
    if (q.includes('subscription') || q.includes('recurring')) {
      return `📋 **Subscription Tracker**

I found 3 active subscriptions:

| Service | Amount | Frequency | Status |
|---------|--------|-----------|--------|
| Netflix Premium | ₹199 | Monthly | Active |
| Spotify Premium | ₹129 | Monthly | Active |
| Amazon Prime | ₹299 | Yearly | Active |

**Total Monthly:** ₹627

⏰ **Upcoming Renewals:**
- Netflix: Renews in 8 days
- Spotify: Renews in 12 days

💡 Want me to enable auto-pay from your USDC wallet for these?`
    }
    
    if (q.includes('compare') || q.includes('month')) {
      return `📈 **Month-over-Month Comparison**

| Category | This Month | Last Month | Change |
|----------|-----------|------------|--------|
| Food & Dining | ₹8,450 | ₹6,200 | +36% ⚠️ |
| Shopping | ₹3,800 | ₹4,100 | -7% ✅ |
| Transport | ₹2,100 | ₹1,900 | +11% |
| Entertainment | ₹1,200 | ₹1,500 | -20% ✅ |

**Summary:** Your overall spending is up 8% this month. Food expenses are the main contributor to the increase.

Would you like tips to reduce your food spending?`
    }
    
    if (q.includes('invest') || q.includes('portfolio')) {
      return `📊 **Portfolio Overview**

| Asset | Balance | Value (USD) | Change |
|-------|---------|-------------|--------|
| USDC | 854.23 | $854.23 | 0% |
| SOL | 12.34 | $1,234.50 | +12.5% |

**Current Strategy:** 100% stablecoin (conservative)

💡 **Recommendations:**
1. **Medium Risk:** Allocate 20% to SOL ($417) for potential gains
2. **Diversified:** Try Jupiter SOL Index for automatic diversification

The market sentiment is bullish. Consider allocating 10% to crypto assets.`
    }

    return `🤖 I'm here to help with all your financial questions!

I can analyze your:
- 💸 Spending patterns and trends
- 💰 Savings opportunities
- 📋 Subscription tracking
- 💳 Transaction insights

**Try asking:**
- "Show my spending analysis"
- "What can I save?"
- "Track my subscriptions"
- "Compare this month vs last"

What would you like to explore?`
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
    <div className="h-[calc(100vh-64px)] flex flex-col">
      <div className="p-4 sm:p-6 lg:p-8 pb-0 space-y-6">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground">Financial Copilot</h1>
              <p className="text-sm text-muted-foreground">AI-powered financial intelligence</p>
            </div>
          </motion.div>
          <motion.div variants={itemVariants} className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-success/10 text-accent-success text-xs font-bold">
              <div className="w-2 h-2 rounded-full bg-accent-success animate-pulse" />
              AI Active
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto px-4 sm:px-6 lg:p-8 pt-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Quick Insights Cards */}
            <motion.div
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {INITIAL_INSIGHTS.map((insight, index) => {
                const Icon = insight.icon
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="p-4 rounded-xl border border-border bg-card/50 hover:bg-card hover:border-primary/30 transition-all cursor-pointer group"
                    onClick={() => handleSend(`Tell me about ${insight.title.toLowerCase()}`)}
                  >
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ backgroundColor: `${insight.color}15` }}
                    >
                      <Icon size={20} style={{ color: insight.color }} />
                    </div>
                    <h4 className="font-semibold text-foreground text-sm mb-1 group-hover:text-primary transition-colors">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{insight.desc}</p>
                  </motion.div>
                )
              })}
            </motion.div>

            {/* Chat Messages */}
            <div className="space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-4 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-tr-sm'
                        : 'bg-card border border-border rounded-tl-sm'
                    }`}
                  >
                    <div 
                      className={`text-sm leading-relaxed whitespace-pre-wrap ${
                        message.role === 'user' ? 'text-white' : 'text-foreground'
                      }`}
                      dangerouslySetInnerHTML={{
                        __html: message.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n/g, '<br/>')
                          .replace(/\|/g, '')
                          .replace(/---/g, '')
                      }}
                    />
                    <p className={`text-[10px] mt-2 ${
                      message.role === 'user' ? 'text-white/60' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '200ms' }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '400ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Suggested Questions */}
              {showSuggestions && messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-wrap gap-2"
                >
                  {SUGGESTED_QUESTIONS.map((question, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(question)}
                      className="px-4 py-2 rounded-full bg-card border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 sm:px-6 lg:px-8 border-t border-border bg-card/50">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 bg-card border border-border rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-primary/50 transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your finances..."
                className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none py-2"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              AI responses are for informational purposes only. Always verify important financial decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
