import Head from 'next/head';
import Link from 'next/link';

/**
 * AuthLayout Component
 *
 * Layout moderne pour les pages d'authentification (login, register, forgot-password, etc.)
 *
 * Features:
 * - Background avec gradient moderne
 * - Éléments décoratifs floutés en arrière-plan
 * - Design centré et responsive
 * - Effet 3D léger avec ombres
 */
export default function AuthLayout({ children, title = "FormationPlace" }) {
  return (
    <>
      <Head>
        <title>{title} - FormationPlace</title>
        <meta name="description" content="Accédez à votre compte FormationPlace" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 relative overflow-hidden flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Decorative Blurred Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green opacity-10 rounded-full blur-3xl"></div>

        {/* Logo / Brand (Top) */}
        <div className="absolute top-8 left-8 z-20">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary hover:text-purple transition-colors">
            <i className="ph-bold ph-graduation-cap"></i>
            <span>FormationPlace</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="relative z-10 w-full max-w-md">
          {children}
        </div>

        {/* Decorative Pattern Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>
    </>
  );
}
