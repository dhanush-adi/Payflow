import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'
import { Providers } from '@/components/providers/auth-provider'
import { PhantomProvider } from '@/components/providers/phantom-provider'

export const metadata: Metadata = {
  title: 'PayFlow - UPI to Crypto Payment Infrastructure',
  description: 'The hybrid payment system that bridges UPI and crypto. Users pay with INR via UPI while merchants receive USDC on Solana, powered by AI financial automation.',
  keywords: ['UPI', 'crypto', 'payments', 'Solana', 'USDC', 'India', 'fintech', 'blockchain'],
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased font-sans">
        <PhantomProvider>
          <Providers>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </Providers>
        </PhantomProvider>
      </body>
    </html>
  )
}
