import './globals.css'
import Providers from './providers'

export const metadata = {
  title: 'FreelanceShield',
  description: 'Get paid. Every time.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}