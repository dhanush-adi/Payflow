'use client'

import React from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Check } from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { authApi } from '@/lib/api'
import { AuroraBackground } from '@/components/ui/aurora-background'

export default function SignupPage() {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match")
      return
    }
    setIsLoading(true)
    try {
      const res = await authApi.register(formData.email, formData.password, formData.name)
      localStorage.setItem('token', res.access_token)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account')
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

  const passwordStrength = React.useMemo(() => {
    const password = formData.password
    if (!password) return { level: 0, text: '', color: '' }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++

    const levels = [
      { level: 0, text: '', color: '' },
      { level: 1, text: 'Weak', color: 'text-destructive' },
      { level: 2, text: 'Fair', color: 'text-yellow-500' },
      { level: 3, text: 'Good', color: 'text-primary' },
      { level: 4, text: 'Strong', color: 'text-green-500' },
    ]
    return levels[strength]
  }, [formData.password])

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
            <div className="rounded-3xl border border-white/10 bg-black/40 p-8 sm:p-10 space-y-6 backdrop-blur-xl shadow-2xl">
              {/* Header */}
              <motion.div variants={itemVariants} className="space-y-1 text-center">
                <h1 className="text-3xl font-black text-foreground tracking-tight">Create Account</h1>
                <p className="text-foreground-secondary text-sm">Join the next era of Solana trading</p>
              </motion.div>

              {/* Form */}
              <motion.form variants={itemVariants} className="space-y-4" onSubmit={handleSignup}>
                {error && (
                  <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20">
                    {error}
                  </div>
                )}
                {/* Name Input */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-foreground-secondary pointer-events-none" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background/50 text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-foreground-secondary pointer-events-none" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background/50 text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-foreground-secondary pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background/50 text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-foreground-secondary hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex gap-1 w-24">
                        {[...Array(4)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full ${
                              i < passwordStrength.level ? 'bg-primary' : 'bg-white/10'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${passwordStrength.color}`}>
                        {passwordStrength.text}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground ml-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-foreground-secondary pointer-events-none" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-background/50 text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-foreground-secondary hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <label className="flex items-start gap-3 cursor-pointer group pt-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border border-border bg-background checked:bg-primary checked:border-primary accent-primary mt-0.5 transition-all"
                  />
                  <span className="text-xs text-foreground-secondary group-hover:text-foreground transition-colors leading-tight">
                    I agree to the{' '}
                    <Link href="/terms" className="text-primary hover:text-primary-dark font-black">
                      Terms
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary hover:text-primary-dark font-black">
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                {/* Sign Up Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-primary text-primary-foreground font-bold hover:scale-[1.02] transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                >
                  {isLoading ? 'Creating...' : 'Create Account'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.form>

              {/* Divider */}
              <motion.div variants={itemVariants} className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-transparent text-foreground-secondary font-medium uppercase tracking-widest text-[10px]">Or sign up with</span>
                </div>
              </motion.div>

              {/* Social Signups */}
              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-sm font-bold">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.91 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-sm font-bold">
                  <span className="text-secondary font-black">◎</span>
                  Phantom
                </button>
              </motion.div>

              {/* Sign In Link */}
              <motion.div variants={itemVariants} className="text-center">
                <p className="text-xs text-foreground-secondary">
                  Already have an account?{' '}
                  <Link href="/login" className="text-primary hover:text-primary-dark font-black transition-colors">
                    Sign In
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
