/**
 * Composant UserAvatar
 *
 * Affiche l'avatar d'un utilisateur:
 * - Photo de profil si disponible
 * - Sinon avatar personnalisé avec couleur/forme
 * - Fallback sur initiales
 */

export default function UserAvatar({
  user,
  size = 'md',
  className = ''
}) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
    '2xl': 'w-32 h-32 text-4xl',
  };

  const getColorClass = (color) => {
    const colorMap = {
      purple: 'from-purple to-pink',
      blue: 'from-blue to-cyan',
      green: 'from-green to-emerald',
      red: 'from-red to-orange',
      orange: 'from-orange to-yellow',
      pink: 'from-pink to-rose',
      yellow: 'from-yellow to-orange',
      indigo: 'from-indigo to-purple',
      teal: 'from-teal-500 to-emerald-500',
    };
    return colorMap[color] || 'from-purple to-pink';
  };

  const getShapeClass = (shape) => {
    return shape === 'square' ? 'rounded-2xl' : 'rounded-full';
  };

  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user.pseudo) {
      return user.pseudo.substring(0, 2).toUpperCase();
    }
    return '??';
  };

  // Si photo de profil disponible
  if (user.avatar && user.avatar.trim() && !user.avatar.includes('/assets/avatars/')) {
    return (
      <img
        src={user.avatar}
        alt={user.pseudo || `${user.firstName} ${user.lastName}`}
        className={`${sizeClasses[size]} object-cover ${getShapeClass(user.avatarShape || 'circle')} ${className}`}
      />
    );
  }

  // Sinon, avatar personnalisé avec couleur/forme
  return (
    <div
      className={`${sizeClasses[size]} bg-gradient-to-br ${getColorClass(user.avatarColor || 'purple')} flex items-center justify-center text-white font-bold ${getShapeClass(user.avatarShape || 'circle')} ${className}`}
    >
      {getInitials()}
    </div>
  );
}
