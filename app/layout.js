import './globals.css'
import { Rajdhani, Exo_2, Bebas_Neue } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import SessionProvider from './components/SessionProvider'
import Navbar from './components/Navbar'
import AgeGate from './components/AgeGate'

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
})

const exo2 = Exo_2({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-logo',
  display: 'swap',
})

export const metadata = {
  title: 'DivisionHub — The Division 2 Community',
  description: 'Share your builds, find your team, dominate the Dark Zone.',
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" className={`${rajdhani.variable} ${exo2.variable} ${bebasNeue.variable}`}>
      <body>
        <SessionProvider session={session}>
          <AgeGate>
            <Navbar />
            <div className="page-content">
              {children}
            </div>
          </AgeGate>
        </SessionProvider>
      </body>
    </html>
  )
}
