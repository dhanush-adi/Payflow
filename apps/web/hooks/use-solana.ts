'use client'

import { usePhantom } from '@/components/providers/phantom-provider'

export function useSolana() {
  const { sdk, isConnected, address, addresses, connect, disconnect } = usePhantom()

  const signMessage = async (message: string) => {
    if (!sdk || !isConnected) {
      throw new Error('Wallet not connected')
    }
    return sdk.solana.signMessage(message)
  }

  const signAndSendTransaction = async (transaction: any) => {
    if (!sdk || !isConnected) {
      throw new Error('Wallet not connected')
    }
    return sdk.solana.signAndSendTransaction(transaction)
  }

  const switchNetwork = async (network: 'mainnet' | 'devnet' | 'testnet') => {
    if (!sdk) {
      throw new Error('SDK not initialized')
    }
    return sdk.solana.switchNetwork(network)
  }

  return {
    isConnected,
    address,
    addresses,
    signMessage,
    signAndSendTransaction,
    switchNetwork,
    connect,
    disconnect,
    sdk,
  }
}
