import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { cn } from "../lib/utils"
import AutomataNavbar from '@/components/navbar/navbar'
import { ThemeProvider } from '@/components/theme-provider'
import { NetworkProvider } from "@/components/network-provider";
import { NfaProvider } from '@/components/nfa-provider'
import Image from 'next/image'

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

          <div className="md:hidden flex flex-col justify-center items-center h-screen bg-gray-200 text-center p-4">
              <Image src={"/sad-cat.png"} 
                    width={200}
                    height={200} alt='picture of a silly cat' className='mb-6'/>
              <h1 className="text-2xl font-bold text-gray-800">Not Optimized for Mobile</h1>
              <p className="text-lg text-gray-600 mt-4">
                This website is not designed for mobile devices. Please use a tablet/desktop for the best experience.
              </p>
          </div>

          <div className="hidden md:block">
            <NfaProvider>
              <NetworkProvider>
                <AutomataNavbar />
                <div className="p-10">
                  {children}
                </div>
              </NetworkProvider>
            </NfaProvider>
          </div>

        </ThemeProvider>

      </body>
    </html>
  )
}