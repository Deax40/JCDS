import '../styles/globals.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { CurrencyProvider } from '../context/CurrencyContext'
import { AuthProvider } from '../context/AuthContext'

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <Component {...pageProps} />
      </CurrencyProvider>
    </AuthProvider>
  )
}

export default MyApp
