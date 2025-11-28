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
          <div className="fixed bottom-6 right-6 z-40">
            <button
              onClick={() => setIsSupportOpen(true)}
              className="relative w-16 h-16 bg-gradient-to-r from-purple to-blue text-white rounded-full shadow-lg hover:shadow-2xl transition-all hover:scale-110 flex flex-col items-center justify-center group animate-bounce-slow"
              title="Contacter FormationPlace"
            >
              <i className="ph-bold ph-headset text-2xl mb-0.5"></i>
              <span className="text-[10px] font-semibold">Support</span>

              {/* Pulse animation ring */}
              <span className="absolute inset-0 rounded-full bg-purple animate-ping opacity-20"></span>
            </button>
          </div>

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
