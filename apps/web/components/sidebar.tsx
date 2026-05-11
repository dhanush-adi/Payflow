'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  Settings,
  LogOut,
  BarChart3,
  Zap,
  User,
  Building2,
  MessageCircle,
} from 'lucide-react'
import { usePhantom, truncateAddress } from '@/components/providers/phantom-provider'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Wallet, label: 'Wallet', href: '/dashboard/wallet' },
  { icon: TrendingUp, label: 'Payments', href: '/dashboard/payments' },
  { icon: Building2, label: 'Merchant', href: '/dashboard/merchant' },
  { icon: MessageCircle, label: 'AI Copilot', href: '/dashboard/ai-copilot' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { isConnected, address } = usePhantom()

  const handleSignOut = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  return (
    <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-40 w-64 bg-[#0F0F1A] border-r border-[#2D2D42]">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-6 border-b border-[#2D2D42]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#9945FF] to-[#00D4FF] flex items-center justify-center shadow-lg shadow-[#9945FF]/20">
          <span className="text-white font-black text-sm">PF</span>
        </div>
        <span className="text-lg font-black text-white">PayFlow</span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-auto px-4 py-6">
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#9945FF] text-white shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-[#1A1A2E]'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Wallet Status */}
      <div className="border-t border-[#2D2D42] px-4 py-4">
        <Link
          href="/dashboard/wallet"
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            pathname === '/dashboard/wallet'
              ? 'bg-[#14F195]/10 text-[#14F195]'
              : 'text-white/70 hover:text-white hover:bg-[#1A1A2E]'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#14F195] animate-pulse' : 'bg-white/30'}`} />
          <span className="flex-1 truncate">
            {isConnected && address ? truncateAddress(address, 4) : 'Connect Wallet'}
          </span>
          <span className="text-secondary font-black">◎</span>
        </Link>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-[#2D2D42] px-4 py-4 space-y-1">
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-[#1A1A2E] transition-all"
        >
          <User size={18} />
          <span>Profile</span>
        </Link>
        <Link
          href="/dashboard/automation"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-[#1A1A2E] transition-all"
        >
          <Zap size={18} />
          <span>Automation</span>
        </Link>
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-[#1A1A2E] transition-all"
        >
          <Settings size={18} />
          <span>Settings</span>
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/70 hover:text-[#FF6B6B] hover:bg-[#1A1A2E] transition-all"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
