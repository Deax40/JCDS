import Link from 'next/link';

export default function FormationCard({ formation, style = 'one' }) {
  const {
    id,
    slug,
    title,
    cover_image_url,
    price,
    promo_price,
    is_promo_active,
    average_rating,
    seller_name,
    category_name
  } = formation;

  const displayPrice = is_promo_active && promo_price ? promo_price : price;
  const hasPromo = is_promo_active && promo_price && promo_price < price;

  return (
    <div className={`sin-product style-${style}`}>
      <div className="pro-img">
        <img src={cover_image_url || '/assets/img/default-formation.jpg'} alt={title} />
        {hasPromo && (
          <span className="badge-promo">-{Math.round((1 - promo_price / price) * 100)}%</span>
        )}
      </div>

      <div className={`mid-wrapper ${style === 'two' ? 'style-two' : ''}`}>
        <h5 className="pro-title">
          <Link href={`/formations/${slug}`}>{title}</Link>
        </h5>

        {seller_name && (
          <p className="seller-name">
            <i className="fa fa-user"></i> {seller_name}
          </p>
        )}

        {style === 'two' && average_rating > 0 && (
          <div className="rating">
            <ul>
              {[1, 2, 3, 4, 5].map((star) => (
                <li key={star}>
                  <a href="#">
                    <i
                      className={
                        star <= Math.floor(average_rating)
                          ? 'fas fa-star'
                          : star - 0.5 <= average_rating
                          ? 'fas fa-star-half'
                          : 'far fa-star'
                      }
                    ></i>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="price-wrapper">
          {hasPromo && (
            <span className="old-price">{price.toFixed(2)}€</span>
          )}
          <span className="price">{displayPrice.toFixed(2)}€</span>
        </div>
      </div>

      <div className="pro-icon">
        <ul>
          <li>
            <a href="#" title="Ajouter aux favoris">
              <i className="flaticon-valentines-heart"></i>
            </a>
          </li>
          <li>
            <a href="#" title="Ajouter au panier">
              <i className="flaticon-shopping-cart"></i>
            </a>
          </li>
          <li>
            <Link href={`/formations/${slug}`} className="trigger" title="Voir les détails">
              <i className="flaticon-zoom-in"></i>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
