import './globals.css'
import Providers from './providers'
import FeedbackWidget from './components/FeedbackWidget'
import GlobalDemoButton from "./components/GlobalDemoButton";
export const metadata = {
  title: 'FreelanceShield',
  description: 'Get paid. Every time.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
        <GlobalDemoButton />
        <FeedbackWidget />
      </body>
    </html>
  )
}