/**
 * AuthCard Component
 *
 * Carte d'authentification moderne avec effet 3D
 *
 * Features:
 * - Ombre douce et bordures arrondies
 * - Effet hover avec transform subtil
 * - Design clean et professionnel
 */
export default function AuthCard({ children, title, subtitle, icon }) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-10 transform transition-all duration-300 hover:shadow-3xl hover:-translate-y-1">
      {/* Header avec icône */}
      {(icon || title || subtitle) && (
        <div className="text-center mb-8">
          {icon && (
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple to-blue rounded-2xl mb-4 shadow-lg">
              <i className={`ph-bold ${icon} text-white text-3xl`}></i>
            </div>
          )}
          {title && (
            <h2 className="text-3xl font-bold text-primary mb-2">{title}</h2>
          )}
          {subtitle && (
            <p className="text-secondary text-sm">{subtitle}</p>
          )}
        </div>
      )}

      {/* Content */}
      <div>
        {children}
      </div>
    </div>
  );
}
