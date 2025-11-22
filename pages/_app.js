import '../styles/globals.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { CurrencyProvider } from '../context/CurrencyContext'
import { AuthProvider } from '../context/AuthContext'
import Script from 'next/script'

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <Script src="https://unpkg.com/@phosphor-icons/web" strategy="afterInteractive" />
        <Component {...pageProps} />
      </CurrencyProvider>
    </AuthProvider>
  )
}

export default MyApp
