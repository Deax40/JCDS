import '../styles/globals.css'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { CurrencyProvider } from '../context/CurrencyContext'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { useState } from 'react'
import SupportChat from '../components/SupportChat'

function AppContent({ Component, pageProps }) {
  const { user } = useAuth();
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // Ne pas afficher le bouton support sur la page admin
  const isAdminPage = typeof window !== 'undefined' && window.location.pathname === '/admin';

  return (
    <>
      <Component {...pageProps} />

      {/* Bouton flottant de support (seulement si connecté et pas sur page admin) */}
      {user && !isAdminPage && (
        <>
          <button
            onClick={() => setIsSupportOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple to-blue text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-40"
            title="Contacter le support"
          >
            <i className="ph-bold ph-headset text-2xl"></i>
          </button>

          <SupportChat isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
        </>
      )}
    </>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <CurrencyProvider>
        <AppContent Component={Component} pageProps={pageProps} />
      </CurrencyProvider>
    </AuthProvider>
  )
}

export default MyApp
