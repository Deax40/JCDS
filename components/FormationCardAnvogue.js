import Link from 'next/link';
import { useState } from 'react';

export default function FormationCardAnvogue({ formation }) {
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

  const displayPrice = is_promo_active && promo_price ? promo_price : price;
  const hasPromo = is_promo_active && promo_price && promo_price < price;
  const discountPercent = hasPromo ? Math.round((1 - promo_price / price) * 100) : 0;
  const progressPercent = total_capacity > 0 ? (total_sales / total_capacity) * 100 : 0;
  const available = total_capacity - total_sales;

  // Render stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<i key={i} className="ph-fill ph-star text-yellow-400"></i>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<i key={i} className="ph-fill ph-star-half text-yellow-400"></i>);
      } else {
        stars.push(<i key={i} className="ph ph-star text-gray-300"></i>);
      }
    }
    return stars;
  };

  return (
    <div className="product-item group">
      <div className="product-main cursor-pointer block">
        {/* Product Image with Hover */}
        <div className="product-thumb bg-white relative overflow-hidden rounded-2xl">
          {/* New Badge */}
          {formation.is_new && (
            <div className="product-tag text-button-uppercase bg-green px-3 py-0.5 inline-block rounded-full absolute top-3 left-3 z-[1]">
              Nouveau
            </div>
          )}

          {/* Discount Badge */}
          {hasPromo && (
            <div className="product-tag text-button-uppercase text-white bg-red px-3 py-0.5 inline-block rounded-full absolute top-3 left-3 z-[1]">
              -{discountPercent}%
            </div>
          )}

          {/* Wishlist Icon */}
          <div className="list-action-icon absolute top-3 right-3 z-[2]">
            <div className="add-wishlist-btn w-[32px] h-[32px] flex items-center justify-center rounded-full bg-white duration-300 relative hover:bg-black group/wishlist">
              <i className="ph ph-heart text-lg group-hover/wishlist:text-white"></i>
              <div className="tag-action bg-black text-white caption2 px-1.5 py-0.5 rounded-sm opacity-0 invisible absolute bottom-full mb-2 transition-all duration-300 group-hover/wishlist:opacity-100 group-hover/wishlist:visible whitespace-nowrap">
                Ajouter aux favoris
              </div>
            </div>
          </div>

          {/* Images with Hover Effect */}
          <div className="product-img w-full h-full aspect-[3/4]">
            <img
              className="w-full h-full object-cover duration-700"
              src={cover_image_url || '/assets/formations/default.jpg'}
              alt={title}
            />
            <img
              className="w-full h-full object-cover duration-700 absolute top-0 left-0 opacity-0 group-hover:opacity-100"
              src={cover_image_hover || cover_image_url || '/assets/formations/default-hover.jpg'}
              alt={`${title} - hover`}
            />
          </div>

          {/* Action Buttons */}
          <div className="list-action grid grid-cols-2 gap-3 px-5 absolute w-full bottom-5 max-lg:hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
            <Link
              href={`/formations/${slug}`}
              className="quick-view-btn w-full text-button-uppercase py-2 text-center rounded-full duration-300 bg-white hover:bg-black hover:text-white"
            >
              Voir détails
            </Link>
            <button className="add-cart-btn w-full text-button-uppercase py-2 text-center rounded-full duration-500 bg-white hover:bg-black hover:text-white">
              Ajouter au panier
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="product-infor mt-4 lg:mb-7">
          {/* Progress Bar (Sold/Available) */}
          {total_capacity > 0 && (
            <div className="product-sold sm:pb-4 pb-2">
              <div className="progress bg-line h-1.5 w-full rounded-full overflow-hidden relative">
                <div
                  className="progress-sold bg-red absolute left-0 top-0 h-full"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between gap-3 gap-y-1 flex-wrap mt-2">
                <div className="text-button-uppercase">
                  <span className="text-secondary2 max-sm:text-xs">Inscrits: </span>
                  <span className="max-sm:text-xs">{total_sales}</span>
                </div>
                <div className="text-button-uppercase">
                  <span className="text-secondary2 max-sm:text-xs">Places disponibles: </span>
                  <span className="max-sm:text-xs">{available}</span>
                </div>
              </div>
            </div>
          )}

          {/* Formation Title */}
          <Link href={`/formations/${slug}`}>
            <div className="product-name text-title duration-300 hover:text-black line-clamp-2">
              {title}
            </div>
          </Link>

          {/* Seller & Category */}
          <div className="flex items-center gap-2 mt-2">
            {seller_name && (
              <span className="caption1 text-secondary">
                <i className="ph ph-user text-xs"></i> {seller_name}
              </span>
            )}
            {category_name && seller_name && (
              <span className="caption1 text-secondary">•</span>
            )}
            {category_name && (
              <span className="caption1 text-secondary">{category_name}</span>
            )}
          </div>

          {/* Level Badge */}
          {level && (
            <div className="mt-2">
              <span className="caption1 bg-surface text-secondary px-2 py-1 rounded inline-block">
                {level}
              </span>
            </div>
          )}

          {/* Rating */}
          {average_rating > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <div className="flex items-center">
                {renderStars(average_rating)}
              </div>
              <span className="caption1 text-secondary">
                ({average_rating.toFixed(1)})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="product-price-block flex items-center gap-2 flex-wrap mt-2 duration-300 relative z-[1]">
            <div className="product-price text-title font-semibold">{displayPrice.toFixed(2)}€</div>
            {hasPromo && (
              <>
                <div className="product-origin-price caption1 text-secondary2">
                  <del>{price.toFixed(2)}€</del>
                </div>
                <div className="product-sale caption1 font-medium bg-green text-white px-3 py-0.5 inline-block rounded-full">
                  -{discountPercent}%
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
