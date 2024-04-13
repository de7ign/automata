import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { cn } from "../lib/utils"
import AutomataNavbar from '@/components/navbar/navbar'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
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
          <AutomataNavbar />

          <div className="p-10">
            {children}
          </div>
        </ThemeProvider>

      </body>
    </html>
  )
}
