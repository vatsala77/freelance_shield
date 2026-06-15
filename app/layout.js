import './globals.css'

export const metadata = {
  title: 'FreelanceShield',
  description: 'Get paid. Every time.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}