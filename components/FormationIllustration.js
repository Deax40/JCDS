/**
 * FormationIllustration Component
 *
 * Affiche une illustration visuelle adaptée selon la catégorie de la formation.
 * Utilise des gradients modernes + icônes Phosphor pour un rendu cohérent.
 *
 * Catégories supportées :
 * - Entrepreneuriat : fusée, graphiques de croissance, business
 * - Développement Web / Codage : code, terminal, brackets
 * - Gestion d'entreprise : diagrammes, équipe, stratégie
 * - Business & Marketing : megaphone, target, trends
 * - Design : palette, pencil, artboard
 * - Autres : icône générique
 */

export default function FormationIllustration({ category, className = "" }) {
  // Mapping des catégories vers leurs configurations visuelles
  const categoryConfig = {
    'entrepreneuriat': {
      gradient: 'from-purple to-pink',
      icon: 'ph-rocket-launch',
      iconColor: 'text-white',
      secondaryIcon: 'ph-trend-up',
      pattern: 'dots'
    },
    'développement web': {
      gradient: 'from-blue to-cyan-500',
      icon: 'ph-code',
      iconColor: 'text-white',
      secondaryIcon: 'ph-terminal-window',
      pattern: 'grid'
    },
    'codage': {
      gradient: 'from-blue to-cyan-500',
      icon: 'ph-code',
      iconColor: 'text-white',
      secondaryIcon: 'ph-brackets-curly',
      pattern: 'grid'
    },
    'développement': {
      gradient: 'from-blue to-cyan-500',
      icon: 'ph-code',
      iconColor: 'text-white',
      secondaryIcon: 'ph-git-branch',
      pattern: 'grid'
    },
    'gestion': {
      gradient: 'from-orange to-red',
      icon: 'ph-chart-line',
      iconColor: 'text-white',
      secondaryIcon: 'ph-users-three',
      pattern: 'lines'
    },
    'gestion d\'entreprise': {
      gradient: 'from-orange to-red',
      icon: 'ph-chart-line',
      iconColor: 'text-white',
      secondaryIcon: 'ph-strategy',
      pattern: 'lines'
    },
    'business & marketing': {
      gradient: 'from-green to-emerald-500',
      icon: 'ph-megaphone',
      iconColor: 'text-white',
      secondaryIcon: 'ph-target',
      pattern: 'dots'
    },
    'design': {
      gradient: 'from-pink to-purple',
      icon: 'ph-palette',
      iconColor: 'text-white',
      secondaryIcon: 'ph-pencil-line',
      pattern: 'gradient'
    },
    'photographie': {
      gradient: 'from-yellow to-orange',
      icon: 'ph-camera',
      iconColor: 'text-white',
      secondaryIcon: 'ph-aperture',
      pattern: 'radial'
    },
    'langues': {
      gradient: 'from-indigo-500 to-purple',
      icon: 'ph-translate',
      iconColor: 'text-white',
      secondaryIcon: 'ph-globe',
      pattern: 'dots'
    },
    'développement personnel': {
      gradient: 'from-teal-500 to-green',
      icon: 'ph-brain',
      iconColor: 'text-white',
      secondaryIcon: 'ph-heart',
      pattern: 'radial'
    }
  };

  // Normaliser le nom de catégorie (lowercase, trim)
  const normalizedCategory = category?.toLowerCase().trim() || '';

  // Récupérer la config ou utiliser une config par défaut
  const config = categoryConfig[normalizedCategory] || {
    gradient: 'from-gray-400 to-gray-600',
    icon: 'ph-book-open',
    iconColor: 'text-white',
    secondaryIcon: 'ph-graduation-cap',
    pattern: 'gradient'
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient}`}></div>

      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        {config.pattern === 'dots' && (
          <div className="w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
        )}
        {config.pattern === 'grid' && (
          <div className="w-full h-full" style={{
            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}></div>
        )}
        {config.pattern === 'lines' && (
          <div className="w-full h-full" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, white, white 2px, transparent 2px, transparent 10px)',
          }}></div>
        )}
      </div>

      {/* Main Icon (Center) */}
      <div className="relative z-10 flex items-center justify-center h-full">
        <i className={`ph-bold ${config.icon} ${config.iconColor} text-6xl opacity-90`}></i>
      </div>

      {/* Secondary Icon (Bottom Right) */}
      <div className="absolute bottom-3 right-3 z-10">
        <i className={`ph ${config.secondaryIcon} ${config.iconColor} text-3xl opacity-60`}></i>
      </div>

      {/* Decorative Circle (Top Left) */}
      <div className="absolute -top-8 -left-8 w-24 h-24 bg-white opacity-10 rounded-full"></div>
    </div>
  );
}
