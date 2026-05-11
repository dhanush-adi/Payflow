'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { BrowserSDK, AddressType } from '@phantom/browser-sdk'
import { toast } from 'sonner'

interface PhantomContextType {
  sdk: BrowserSDK | null
  isConnected: boolean
  addresses: string[]
  address: string | null
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  isReady: boolean
  isConnecting: boolean
}

const PhantomContext = createContext<PhantomContextType>({
  sdk: null,
  isConnected: false,
  addresses: [],
  address: null,
  connect: async () => {},
  disconnect: async () => {},
  isReady: false,
  isConnecting: false,
})

export function usePhantom() {
  return useContext(PhantomContext)
}

interface PhantomProviderProps {
  children: ReactNode
}

export function PhantomProvider({ children }: PhantomProviderProps) {
  const [sdk, setSdk] = useState<BrowserSDK | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [addresses, setAddresses] = useState<string[]>([])
  const [isReady, setIsReady] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    const initSdk = async () => {
      try {
        const browserSdk = new BrowserSDK({
          providers: ['injected'],
          addressTypes: [AddressType.solana],
        })
        setSdk(browserSdk)
        setIsReady(true)

        if (browserSdk.isConnected()) {
          const addrs = await browserSdk.getAddresses()
          const solanaAddrs = addrs.map(a => a.address)
          setIsConnected(true)
          setAddresses(solanaAddrs)
        }
      } catch (error) {
        console.error('Failed to initialize Phantom SDK:', error)
        setIsReady(true)
      }
    }
    initSdk()
  }, [])

  const connect = useCallback(async () => {
    if (!sdk) {
      toast.error('Phantom wallet not initialized')
      return
    }

    setIsConnecting(true)
    try {
      const result = await sdk.connect({ provider: 'injected' })
      const solanaAddrs = result.addresses.map(a => a.address)
      setIsConnected(true)
      setAddresses(solanaAddrs)
      toast.success('Wallet connected!')
    } catch (error: any) {
      if (error?.message?.includes('User rejected')) {
        toast.info('Connection cancelled')
      } else {
        toast.error('Failed to connect wallet')
        console.error('Connection error:', error)
      }
    } finally {
      setIsConnecting(false)
    }
  }, [sdk])

  const disconnect = useCallback(async () => {
    if (!sdk) return
    try {
      sdk.disconnect()
      setIsConnected(false)
      setAddresses([])
      toast.success('Wallet disconnected')
    } catch (error) {
      console.error('Disconnect error:', error)
    }
  }, [sdk])

  const value: PhantomContextType = {
    sdk,
    isConnected,
    addresses,
    address: addresses[0] || null,
    connect,
    disconnect,
    isReady,
    isConnecting,
  }

  return (
    <PhantomContext.Provider value={value}>
      {children}
    </PhantomContext.Provider>
  )
}

export function truncateAddress(address: string, chars: number = 4): string {
  if (!address) return ''
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}
