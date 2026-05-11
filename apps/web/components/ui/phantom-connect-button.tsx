'use client'

import React from 'react'
import { usePhantom } from '@/components/providers/phantom-provider'
import { Loader2 } from 'lucide-react'

interface PhantomConnectButtonProps {
  onConnected?: () => void
  fullWidth?: boolean
  showDisconnect?: boolean
}

export function PhantomConnectButton({
  onConnected,
  fullWidth = false,
  showDisconnect = true,
}: PhantomConnectButtonProps) {
  const { isConnected, address, connect, disconnect, isReady, isConnecting } = usePhantom()

  const handleClick = async () => {
    if (isConnected) {
      if (showDisconnect) {
        await disconnect()
      }
    } else {
      await connect()
      if (onConnected) {
        onConnected()
      }
    }
  }

  if (!isReady) {
    return (
      <button
        disabled
        className={`flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0F0F1A] border border-[#2D2D42] text-[#6B6B7B] text-sm font-medium ${fullWidth ? 'w-full' : ''} opacity-50 cursor-not-allowed`}
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading...
      </button>
    )
  }

  if (isConnected && address) {
    return (
      <div className={`flex items-center justify-between gap-2 py-3 px-4 rounded-xl bg-[#14F195]/10 border border-[#14F195]/20 ${fullWidth ? 'w-full' : ''}`}>
        <div className="flex items-center gap-2">
          <span className="text-[#14F195] font-bold text-sm">◎</span>
          <span className="font-mono text-xs text-[#E0E0E8]">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
        </div>
        {showDisconnect && (
          <button
            onClick={handleClick}
            className="text-xs text-[#6B6B7B] hover:text-red-400 transition-colors"
          >
            Disconnect
          </button>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={isConnecting}
      className={`flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0F0F1A] border border-[#2D2D42] hover:border-[#3D3D52] hover:bg-[#1F1F2E] transition-all text-sm text-[#E0E0E8] font-medium ${fullWidth ? 'w-full' : ''} ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isConnecting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <span className="text-[#00D4FF] font-bold text-sm">◎</span>
          Phantom
        </>
      )}
    </button>
  )
}
