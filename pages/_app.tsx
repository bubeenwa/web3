import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { WalletProvider } from '../components/WalletProvider'
import { ToasterProvider } from '../components/Toaster'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <ToasterProvider>
        <Component {...pageProps} />
      </ToasterProvider>
    </WalletProvider>
  )
}
