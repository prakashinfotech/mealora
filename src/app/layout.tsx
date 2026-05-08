import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Providers } from './providers'
import { RouteProgress } from '@/components/ui/RouteProgress'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Swiggy — Order Food Online',
    template: '%s | Swiggy',
  },
  description:
    'Order food online from the best restaurants near you. Fast delivery, great food.',
  icons: { icon: '/favicon.ico' },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers session={session}>
          <RouteProgress />
          {children}
        </Providers>
      </body>
    </html>
  )
}
