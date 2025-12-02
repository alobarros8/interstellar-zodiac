/**
 * Layout principal de la aplicación
 * Incluye estilos globales y estructura base
 */

import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Header from '@/components/layout/Header'
import CartButton from '@/components/cart/CartButton'
import { CartProvider } from '@/contexts/CartContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Teatro Estrella - Venta de Tickets Online',
  description: 'Compra tus entradas para las mejores funciones de teatro',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${playfair.variable}`}>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <CartButton />
        </CartProvider>
      </body>
    </html>
  )
}
