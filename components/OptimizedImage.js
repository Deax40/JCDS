import Image from 'next/image';
import { useState } from 'react';

/**
 * OptimizedImage Component
 *
 * Composant d'image optimisé qui :
 * - Convertit automatiquement les images en WebP
 * - Génère des tailles responsives automatiquement
 * - Fait du lazy loading natif
 * - Affiche un fallback en cas d'erreur
 * - Support du placeholder blur
 */

export default function OptimizedImage({
  src,
  alt = '',
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  fill = false,
  sizes,
  fallback = null,
  objectFit = 'cover',
  onLoad,
  ...props
}) {
  const [imageError, setImageError] = useState(false);

  // Si erreur de chargement et fallback fourni
  if (imageError && fallback) {
    return <>{fallback}</>;
  }

  // Si erreur sans fallback, afficher placeholder
  if (imageError) {
    return (
      <div
        className={`bg-surface flex items-center justify-center ${className}`}
        style={fill ? {} : { width, height }}
      >
        <i className="ph ph-image text-4xl text-secondary opacity-50"></i>
      </div>
    );
  }

  // Props communes
  const imageProps = {
    src,
    alt,
    quality,
    priority,
    onError: () => setImageError(true),
    onLoad,
    className,
    ...props,
  };

  // Mode fill (pour absolute positioning)
  if (fill) {
    return (
      <Image
        {...imageProps}
        alt={alt}
        fill
        sizes={sizes || '100vw'}
        style={{ objectFit }}
      />
    );
  }

  // Mode avec dimensions explicites
  return (
    <Image
      {...imageProps}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      style={{ objectFit }}
    />
  );
}
