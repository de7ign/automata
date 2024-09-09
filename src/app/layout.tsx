import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { cn } from "../lib/utils"
import AutomataNavbar from '@/components/navbar/navbar'
import { ThemeProvider } from '@/components/theme-provider'
import { NetworkProvider } from "@/components/network-provider";
import { NfaProvider } from '@/components/nfa-provider'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
})

export const metadata: Metadata = {
  title: 'Automata Playground',
  description: 'Automata playground!, Create and play with finite state machines.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable
      )}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NetworkProvider>
            <NfaProvider>
              <AutomataNavbar />
              <div className="p-10">
                {children}
              </div>
            </NfaProvider>
          </NetworkProvider>

        </ThemeProvider>

      </body>
    </html>
  )
}