import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import FormationIllustration from './FormationIllustration';
import OptimizedImage from './OptimizedImage';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';

export default function FormationCardAnvogue({ formation }) {
  const { formatPrice } = useCurrency();
  const { user, addToCart, addToWishlist, isInWishlist, isInCart } = useAuth();
  const router = useRouter();
  const {
    id,
    slug,
    title,
    cover_image_url,
    cover_image_hover,
    price,
    promo_price,
    is_promo_active,
    average_rating,
    seller_name,
    category_name,
    total_sales = 0,
    total_capacity = 100,
    level = 'Tous niveaux',
  } = formation;

  const [isHovered, setIsHovered] = useState(false);
  const displayPrice = is_promo_active && promo_price ? promo_price : price;
  const hasPromo = is_promo_active && promo_price && promo_price < price;
  const discountPercent = hasPromo ? Math.round((1 - promo_price / price) * 100) : 0;

  // Determiner si on a une vraie image
  const hasRealImage = cover_image_url && !cover_image_url.includes('/assets/formations/');

  // Render stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<i key={i} className="ph-fill ph-star text-yellow text-xs"></i>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<i key={i} className="ph-fill ph-star-half text-yellow text-xs"></i>);
      } else {
        stars.push(<i key={i} className="ph ph-star text-gray-300 text-xs"></i>);
      }
    }
    return stars;
  };

  return (
    <div className="group h-full">
      <Link href={`/formations/${slug}`} className="block h-full bg-white rounded-2xl overflow-hidden border border-transparent hover:border-line hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">

        {/* Image Container - Aspect Video (16:9) */}
        <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {formation.is_new && (
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-green text-white rounded-md shadow-sm">
                Nouveau
              </span>
            )}
            {hasPromo && (
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-red text-white rounded-md shadow-sm">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Wishlist Button - Always visible/accessible but subtle */}
          <button
            onClick={(e) => {
              e.preventDefault();
              if (!user) {
                router.push('/login');
                return;
              }
              if (isInWishlist(id)) {
                alert('Déjà dans les favoris !');
              } else {
                addToWishlist(formation);
                alert('Ajouté aux favoris !');
              }
            }}
            className={`absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm transition-all duration-300 hover:scale-110 ${
              isInWishlist(id) ? 'text-red' : 'text-gray-400 hover:text-red'
            }`}
            title={isInWishlist(id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <i className={`${isInWishlist(id) ? 'ph-fill' : 'ph-bold'} ph-heart text-lg`}></i>
          </button>

          {/* Image */}
          <div
            className="w-full h-full relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
             {hasRealImage ? (
              <OptimizedImage
                src={isHovered && cover_image_hover ? cover_image_hover : cover_image_url}
                alt={title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <FormationIllustration
                category={category_name}
                className="w-full h-full transition-transform duration-700 group-hover:scale-105"
              />
            )}
          </div>

          {/* Overlay on hover (Desktop) */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none"></div>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          {/* Category & Level */}
          <div className="flex items-center justify-between mb-2 text-xs text-secondary">
            <span className="font-medium text-primary/80 bg-surface px-2 py-0.5 rounded text-[10px] uppercase tracking-wide truncate max-w-[60%]">
              {category_name}
            </span>
            <div className="flex items-center gap-1">
               <i className="ph-bold ph-chart-bar"></i>
               <span>{level}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-lg leading-snug text-primary mb-2 group-hover:text-blue transition-colors line-clamp-2 flex-grow">
            {title}
          </h3>

          {/* Rating & Students */}
          <div className="flex items-center gap-3 mb-4 text-xs text-secondary">
             <div className="flex items-center gap-1 text-yellow">
                <span className="font-bold text-primary">{average_rating.toFixed(1)}</span>
                {renderStars(average_rating)}
             </div>
             <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
             <span>{total_sales} inscrits</span>
          </div>

          {/* Footer: Price & Action */}
          <div className="mt-auto pt-4 border-t border-line flex items-center justify-between">
             <div className="flex flex-col">
                {hasPromo && (
                   <span className="text-xs text-secondary line-through">{formatPrice(price)}</span>
                )}
                <span className={`font-bold text-lg ${hasPromo ? 'text-red' : 'text-primary'}`}>
                   {formatPrice(displayPrice)}
                </span>
             </div>

             <button
                onClick={(e) => {
                   e.preventDefault();
                   if (!user) {
                     router.push('/login');
                     return;
                   }
                   addToCart(formation);
                   alert('Ajouté au panier !');
                }}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 ${
                   isInCart(id)
                   ? 'bg-green text-white shadow-green/30 shadow-md'
                   : 'bg-surface text-primary hover:bg-primary hover:text-white'
                }`}
                title="Ajouter au panier"
             >
                <i className={`ph-bold ${isInCart(id) ? 'ph-check' : 'ph-shopping-cart'} text-xl`}></i>
             </button>
          </div>
        </div>
      </Link>
    </div>
  );
}
