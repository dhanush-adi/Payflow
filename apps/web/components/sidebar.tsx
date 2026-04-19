'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  Settings,
  LogOut,
  ChevronDown,
  BarChart3,
  Zap,
  User,
} from 'lucide-react'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Wallet, label: 'Wallet', href: '/dashboard/wallet' },
  { icon: TrendingUp, label: 'Payments', href: '/dashboard/payments' },
  { icon: Zap, label: 'AI Copilot', href: '/dashboard/ai-copilot' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-64 lg:flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
          S
        </div>
        <span className="text-base font-bold text-foreground">SolanaVault</span>
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
                className={`flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-border px-4 py-4 space-y-1">
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
        >
          <User size={18} />
          <span>Profile</span>
        </Link>
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
        >
          <Settings size={18} />
          <span>Settings</span>
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-secondary transition-all">
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
