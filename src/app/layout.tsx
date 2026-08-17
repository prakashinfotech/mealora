import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Providers } from './providers'
import { RouteProgress } from '@/components/ui/RouteProgress'
import { CityParamSync } from '@/components/ui/CityParamSync'
import '@/styles/globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Mealora — Order Food Online',
    template: '%s | Mealora',
  },
  description:
    'Mealora — Discover food. Order with ease. Fast delivery from the best restaurants near you.',
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
          <CityParamSync />
          {children}
        </Providers>
      </body>
    </html>
  )
}
