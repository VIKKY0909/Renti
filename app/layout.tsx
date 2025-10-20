import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { CartProvider } from "@/lib/cart-context"
import { Toaster } from "@/components/ui/sonner"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { SimpleLoading } from "@/components/ui/simple-loading"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Rentimade - Rent & Lend Designer Clothes in India",
  description: "Your dream outfit on rent. Explore designer sarees, lehengas, gowns, and more at affordable prices. Sustainable fashion made easy.",
  generator: "v0.app"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        <ErrorBoundary>
          <AuthProvider>
            <CartProvider>
              {children}
              <Toaster />
              <SimpleLoading />
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
