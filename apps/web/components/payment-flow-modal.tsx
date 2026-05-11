'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { 
  X, 
  Smartphone, 
  Copy, 
  Check, 
  Loader2, 
  QrCode, 
  ArrowRight,
  Zap,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { paymentsApi, cryptoApi } from '@/lib/api'

interface PaymentFlowModalProps {
  isOpen: boolean
  onClose: () => void
  merchantId?: string
  merchantName?: string
  initialAmount?: number
}

type Step = 'amount' | 'qr' | 'processing' | 'success' | 'error'

const MOCK_MERCHANTS = [
  { id: 'merchant_1', name: 'TechMart India', address: '7xKXjg2e3VWsk1x2zddS7pDhJvDkBnP3mC5vC5cWjQ8Z' },
  { id: 'merchant_2', name: 'Food Paradise', address: '9fkj2Kjg2e3VWsk1x2zddS7pDhJvDkBnP3mC5vC5cWjQ8Z' },
  { id: 'merchant_3', name: 'Travel Express', address: '5mLKjg2e3VWsk1x2zddS7pDhJvDkBnP3mC5vC5cWjQ8Z' },
]

export function PaymentFlowModal({ isOpen, onClose, merchantId, merchantName, initialAmount }: PaymentFlowModalProps) {
  const [step, setStep] = useState<Step>('amount')
  const [amount, setAmount] = useState(initialAmount?.toString() || '')
  const [selectedMerchant, setSelectedMerchant] = useState(MOCK_MERCHANTS[0])
  const [upiId] = useState('payflow@upi')
  const [upiTxnId, setUpiTxnId] = useState('')
  const [paymentId, setPaymentId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [rate, setRate] = useState(83.45)
  const [usdcAmount, setUsdcAmount] = useState(0)

  useEffect(() => {
    if (initialAmount) {
      setAmount(initialAmount.toString())
    }
  }, [initialAmount])

  useEffect(() => {
    if (amount && !isNaN(parseFloat(amount))) {
      setUsdcAmount(parseFloat(amount) / rate)
    }
  }, [amount, rate])

  const handleAmountSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }
    
    setIsLoading(true)
    setError('')
    
    try {
      // Create payment
      const response = await paymentsApi.createPayment({
        amount: parseFloat(amount),
        merchantId: selectedMerchant.id,
        description: 'UPI to USDC payment',
      })
      
      setPaymentId(response.id)
      setUpiTxnId(response.upiTxnId || `UPI${Date.now().toString(36).toUpperCase()}`)
      setStep('qr')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create payment')
      setStep('error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSimulatePayment = async () => {
    setIsLoading(true)
    setStep('processing')
    
    // Simulate processing delays
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    try {
      if (paymentId) {
        await paymentsApi.simulateSuccess(paymentId)
      }
      setStep('success')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment processing failed')
      setStep('error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClose = () => {
    setStep('amount')
    setAmount('')
    setError('')
    setPaymentId('')
    setUpiTxnId('')
    onClose()
  }

  const generateQRData = () => {
    return `upi://pay?pa=${upiId}&pn=PayFlow&am=${amount}&cu=INR&tn=${upiTxnId}`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-white font-black text-sm">PF</span>
                </div>
                <div>
                  <h2 className="font-bold text-foreground">UPI to USDC Payment</h2>
                  <p className="text-xs text-muted-foreground">Powered by PayFlow</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-secondary/20 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Step Indicator */}
            <div className="flex items-center justify-between px-6 py-3 bg-card/50 border-b border-border">
              {['Amount', 'Pay', 'Confirm', 'Done'].map((label, i) => {
                const stepIndex = ['amount', 'qr', 'processing', 'success'].indexOf(step)
                const isActive = i <= stepIndex
                const isCurrent = i === stepIndex
                return (
                  <React.Fragment key={label}>
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                        isActive ? 'bg-primary text-white' : 'bg-border text-muted-foreground'
                      }`}>
                        {isActive && isCurrent ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : isActive && !isCurrent ? (
                          <Check size={12} />
                        ) : (
                          i + 1
                        )}
                      </div>
                      <span className={`text-xs font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {label}
                      </span>
                    </div>
                    {i < 3 && (
                      <div className={`flex-1 h-[2px] mx-2 rounded-full transition-all ${
                        i < stepIndex ? 'bg-primary' : 'bg-border'
                      }`} />
                    )}
                  </React.Fragment>
                )
              })}
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Step: Amount */}
              {step === 'amount' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">Enter amount to pay</p>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-muted-foreground">₹</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-4 text-5xl font-black text-foreground bg-transparent border-2 border-dashed border-border rounded-2xl focus:border-primary focus:outline-none transition-all text-center placeholder:text-muted-foreground/30"
                        autoFocus
                      />
                    </div>
                    {amount && (
                      <div className="mt-4 flex items-center justify-center gap-4 text-sm">
                        <span className="text-muted-foreground">≈</span>
                        <span className="text-primary font-bold">${usdcAmount.toFixed(2)} USDC</span>
                        <span className="text-xs text-muted-foreground">@ ₹{rate}/$</span>
                      </div>
                    )}
                  </div>

                  {/* Merchant Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Pay to</label>
                    <div className="space-y-2">
                      {MOCK_MERCHANTS.map((merchant) => (
                        <button
                          key={merchant.id}
                          onClick={() => setSelectedMerchant(merchant)}
                          className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                            selectedMerchant.id === merchant.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                              <span className="text-sm font-bold text-secondary">{merchant.name.charAt(0)}</span>
                            </div>
                            <div className="text-left">
                              <p className="font-semibold text-foreground">{merchant.name}</p>
                              <p className="text-xs text-muted-foreground font-mono">{merchant.address.slice(0, 12)}...</p>
                            </div>
                          </div>
                          {selectedMerchant.id === merchant.id && (
                            <Check size={20} className="text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}

                  <button
                    onClick={handleAmountSubmit}
                    disabled={!amount || parseFloat(amount) <= 0 || isLoading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:shadow-lg hover:shadow-primary/30 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating QR...
                      </>
                    ) : (
                      <>
                        Generate Payment
                        <QrCode size={20} />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Step: QR */}
              {step === 'qr' && (
                <div className="space-y-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">Scan QR code with any UPI app</p>
                    
                    {/* QR Code Display */}
                    <div className="relative mx-auto w-64 h-64 rounded-2xl bg-white p-4 shadow-inner">
                      <div className="w-full h-full bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl flex items-center justify-center">
                        {/* Mock QR Pattern */}
                        <div className="grid grid-cols-8 gap-1">
                          {Array.from({ length: 64 }).map((_, i) => (
                            <div
                              key={i}
                              className={`w-2 h-2 rounded-sm ${
                                Math.random() > 0.5 ? 'bg-primary' : 'bg-white'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-bold rounded-full">
                        PayFlow
                      </div>
                    </div>

                    {/* Amount Display */}
                    <div className="mt-6 p-4 rounded-xl border border-border bg-secondary/10">
                      <p className="text-3xl font-black text-foreground">₹{amount}</p>
                      <p className="text-sm text-muted-foreground">≈ ${usdcAmount.toFixed(2)} USDC</p>
                    </div>
                  </div>

                  {/* UPI ID */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50">
                    <div className="flex items-center gap-3">
                      <Smartphone size={20} className="text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Or pay to UPI ID</p>
                        <p className="font-mono font-semibold text-foreground">{upiId}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleCopyUPI}
                      className="p-2 rounded-lg hover:bg-secondary/20 transition-colors"
                    >
                      {copied ? (
                        <Check size={18} className="text-accent-success" />
                      ) : (
                        <Copy size={18} className="text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck size={14} className="text-accent-success" />
                    <span>Secured by PayFlow • TXN: {upiTxnId.slice(0, 12)}...</span>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={handleClose}
                      className="px-6 py-4 rounded-xl border border-border text-foreground font-semibold hover:bg-secondary/20 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSimulatePayment}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-accent to-accent/80 text-accent-foreground font-bold hover:shadow-lg hover:shadow-accent/30 hover:scale-[1.02] transition-all disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          I&apos;ve Paid
                          <Check size={20} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Step: Processing */}
              {step === 'processing' && (
                <div className="py-12 space-y-8">
                  <div className="text-center space-y-4">
                    <motion.div
                      className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-secondary mx-auto flex items-center justify-center"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      <Zap size={40} className="text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Processing Payment</h3>
                      <p className="text-sm text-muted-foreground mt-2">Converting INR to USDC on Solana...</p>
                    </div>
                  </div>

                  {/* Processing Steps */}
                  <div className="space-y-4">
                    {[
                      { label: 'UPI Payment Confirmed', status: 'done' },
                      { label: 'Converting to USDC', status: 'processing' },
                      { label: 'Settling on Solana', status: 'pending' },
                    ].map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.3 }}
                        className="flex items-center gap-4"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          item.status === 'done' ? 'bg-accent-success' : 
                          item.status === 'processing' ? 'bg-primary animate-pulse' : 'bg-border'
                        }`}>
                          {item.status === 'done' ? (
                            <Check size={16} className="text-white" />
                          ) : item.status === 'processing' ? (
                            <RefreshCw size={16} className="text-white animate-spin" />
                          ) : (
                            <span className="text-xs font-bold text-muted-foreground">{i + 1}</span>
                          )}
                        </div>
                        <span className={`font-medium ${
                          item.status === 'pending' ? 'text-muted-foreground' : 'text-foreground'
                        }`}>
                          {item.label}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step: Success */}
              {step === 'success' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-8 space-y-6"
                >
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', bounce: 0.5 }}
                      className="w-20 h-20 rounded-full bg-accent-success/20 mx-auto flex items-center justify-center mb-4"
                    >
                      <Check size={40} className="text-accent-success" />
                    </motion.div>
                    <h3 className="text-2xl font-black text-foreground">Payment Successful!</h3>
                    <p className="text-muted-foreground mt-2">Your payment has been processed</p>
                  </div>

                  {/* Transaction Details */}
                  <div className="space-y-4 p-4 rounded-xl border border-border bg-card/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Amount Paid</span>
                      <span className="font-bold text-foreground">₹{amount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">USDC Settled</span>
                      <span className="font-bold text-primary">${usdcAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Conversion Rate</span>
                      <span className="font-medium text-foreground">₹{rate}/$</span>
                    </div>
                    <div className="pt-4 border-t border-border">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Transaction ID</span>
                        <span className="font-mono text-xs text-foreground">{upiTxnId.slice(0, 16)}...</span>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-muted-foreground">Solana TXN</span>
                        <a
                          href={`https://explorer.solana.com/tx/${paymentId}?cluster=devnet`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 font-mono text-xs text-primary hover:underline"
                        >
                          View on Explorer
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={handleClose}
                      className="px-6 py-4 rounded-xl border border-border text-foreground font-semibold hover:bg-secondary/20 transition-colors"
                    >
                      Done
                    </button>
                    <button
                      onClick={() => {
                        setStep('amount')
                        setAmount('')
                      }}
                      className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:shadow-lg hover:shadow-primary/30 transition-all"
                    >
                      New Payment
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step: Error */}
              {step === 'error' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-8 space-y-6"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-destructive/20 mx-auto flex items-center justify-center mb-4">
                      <AlertCircle size={40} className="text-destructive" />
                    </div>
                    <h3 className="text-2xl font-black text-foreground">Payment Failed</h3>
                    <p className="text-muted-foreground mt-2">{error || 'Something went wrong'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={handleClose}
                      className="px-6 py-4 rounded-xl border border-border text-foreground font-semibold hover:bg-secondary/20 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setStep('amount')}
                      className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold hover:shadow-lg hover:shadow-primary/30 transition-all"
                    >
                      Try Again
                      <RefreshCw size={18} />
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            {step !== 'processing' && step !== 'success' && step !== 'error' && (
              <div className="px-6 py-4 border-t border-border bg-card/50 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-accent-success" />
                  Secured
                </span>
                <span>•</span>
                <span>Powered by Solana</span>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
