'use client'

import React from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'
import { AuroraBackground } from '@/components/ui/aurora-background'

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const res = await authApi.login(email, password)
      localStorage.setItem('token', res.access_token)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setIsLoading(false)
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
    <div className="min-h-screen bg-background">
      <Header />

      <AuroraBackground className="py-20">
        <div className="flex items-center justify-center px-4 w-full">
          <motion.div
            className="w-full max-w-md relative z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="rounded-3xl border border-white/10 bg-black/40 p-8 sm:p-10 space-y-8 backdrop-blur-xl shadow-2xl">
              {/* Header */}
              <motion.div variants={itemVariants} className="space-y-2 text-center">
                <h1 className="text-3xl font-black text-foreground tracking-tight">Welcome Back</h1>
                <p className="text-foreground-secondary text-sm">Sign in to your SolanaVault account</p>
              </motion.div>

              {/* Form */}
              <motion.form variants={itemVariants} className="space-y-6" onSubmit={handleLogin}>
                {error && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                    {error}
                  </div>
                )}
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-foreground-secondary pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background/50 text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-foreground">Password</label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-primary hover:text-primary-dark transition-colors font-bold uppercase tracking-wider"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-foreground-secondary pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background/50 text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-foreground-secondary hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border border-border bg-background checked:bg-primary checked:border-primary accent-primary transition-all"
                  />
                  <span className="text-xs text-foreground-secondary group-hover:text-foreground transition-colors">Remember my session</span>
                </label>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:scale-[1.02] transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.form>

              {/* Divider */}
              <motion.div variants={itemVariants} className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-transparent text-foreground-secondary font-medium">Or continue with</span>
                </div>
              </motion.div>

              {/* Social Logins */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-background/30 hover:bg-secondary/20 transition-all text-sm font-bold">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.91 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-background/30 hover:bg-secondary/20 transition-all text-sm font-bold">
                  <span className="text-secondary font-black">◎</span>
                  Phantom
                </button>
              </motion.div>

              {/* Sign Up Link */}
              <motion.div variants={itemVariants} className="text-center pt-4">
                <p className="text-sm text-foreground-secondary">
                  Don&apos;t have an account?{' '}
                  <Link href="/signup" className="text-primary hover:text-primary-dark font-black transition-colors">
                    Sign Up
                  </Link>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </AuroraBackground>
    </div>
  )
}
