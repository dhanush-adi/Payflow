'use client'

import { useEffect, useState } from 'react'
import { waitForPhantomExtension } from '@phantom/browser-sdk'
import Link from 'next/link'

export function PhantomStatus() {
  const [isInstalled, setIsInstalled] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const check = async () => {
      try {
        const installed = await waitForPhantomExtension(2000)
        setIsInstalled(installed)
      } catch (error) {
        console.error('Error checking Phantom installation:', error)
        setIsInstalled(false)
      } finally {
        setIsChecking(false)
      }
    }
    check()
  }, [])

  if (isChecking) {
    return null
  }

  if (isInstalled === false) {
    return (
      <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/10">
        <p className="text-yellow-500 text-sm">
          Phantom wallet not detected. Please install the{' '}
          <Link 
            href="https://phantom.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline font-bold hover:text-yellow-400 transition-colors"
          >
            Phantom browser extension
          </Link>{' '}
          to connect your wallet.
        </p>
      </div>
    )
  }

  return null
}
