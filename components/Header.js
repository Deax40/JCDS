import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [cartCount, setCartCount] = useState(0);

  return (
    <>
      {/* Header Desktop */}
      <header id="header" className="header-area headroom headroom--not-bottom headroom--pinned headroom--top">
        <div className="container-fluid custom-container menu-rel-container">
          <div className="row">
            {/* Logo */}
            <div className="col-lg-6 col-xl-2">
              <div className="logo">
                <Link href="/">
                  <img src="/assets/img/logo.png" alt="FormationPlace" />
                </Link>
              </div>
            </div>

            {/* Menu principal */}
            <div className="col-lg-12 col-xl-7 order-lg-3 order-xl-2 menu-container">
              <div className="mainmenu">
                <ul id="navigation">
                  <li>
                    <Link href="/" className="active">Accueil</Link>
                  </li>
                  <li className="has-child">
                    <Link href="/formations">Formations</Link>
                    <ul className="sub-menu">
                      <li><Link href="/formations">Toutes les formations</Link></li>
                      <li><Link href="/formations?filter=populaires">Formations populaires</Link></li>
                      <li><Link href="/formations?filter=mieux-notees">Mieux notées</Link></li>
                      <li><Link href="/formations?filter=nouvelles">Nouvelles formations</Link></li>
                      <li><Link href="/formations?filter=promo">En promotion</Link></li>
                    </ul>
                  </li>
                  <li className="has-child">
                    <Link href="/categories">Catégories</Link>
                    <ul className="sub-menu">
                      <li><Link href="/categories/developpement-web">Développement Web</Link></li>
                      <li><Link href="/categories/business-marketing">Business &amp; Marketing</Link></li>
                      <li><Link href="/categories/design">Design</Link></li>
                      <li><Link href="/categories/photographie">Photographie</Link></li>
                      <li><Link href="/categories/developpement-personnel">Développement Personnel</Link></li>
                    </ul>
                  </li>
                  <li>
                    <Link href="/formateurs">Formateurs</Link>
                  </li>
                  <li className="has-child">
                    <Link href="/blog">Blog</Link>
                    <ul className="sub-menu">
                      <li><Link href="/blog">Articles récents</Link></li>
                      <li><Link href="/blog/conseils">Conseils formation</Link></li>
                    </ul>
                  </li>
                  <li>
                    <Link href="/contact">Contact</Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Actions header */}
            <div className="col-lg-6 col-xl-3 order-lg-2 order-xl-3">
              <div className="header-right-one">
                <ul>
                  <li className="language">
                    <select className="custom-select">
                      <option value="fr" defaultValue>FR</option>
                      <option value="en">EN</option>
                    </select>
                  </li>
                  <li className="curency">
                    <select className="custom-select">
                      <option value="eur" defaultValue>EUR</option>
                      <option value="usd">USD</option>
                    </select>
                  </li>
                  <li className="user-login">
                    <Link href="/login">
                      <i className="fa fa-user" aria-hidden="true"></i>
                    </Link>
                  </li>
                  <li className="top-cart">
                    <Link href="/panier">
                      <i className="fa fa-shopping-cart" aria-hidden="true"></i> ({cartCount})
                    </Link>
                    <div className="cart-drop">
                      {/* Dropdown panier - à implémenter dynamiquement */}
                      <div className="cart-bottom">
                        <div className="cart-sub-total">
                          <p>Total <span>0,00€</span></p>
                        </div>
                        <div className="cart-checkout">
                          <Link href="/panier">
                            <i className="fa fa-shopping-cart"></i>Voir le panier
                          </Link>
                        </div>
                        <div className="cart-share">
                          <Link href="/checkout">
                            <i className="fa fa-share"></i>Commander
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="top-search">
                    <a href="javascript:void(0)">
                      <i className="fa fa-search" aria-hidden="true"></i>
                    </a>
                    <input type="text" className="search-input" placeholder="Rechercher une formation..." />
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Header Mobile */}
      <header className="mobile-header headroom headroom--not-bottom headroom--pinned headroom--top">
        <div className="container-fluid custom-container">
          <div className="row">
            <div className="col-4">
              <div className="accordion-wrapper">
                <a href="#" className="mobile-open">
                  <i className="flaticon-menu-1"></i>
                </a>
              </div>
            </div>
            <div className="col-4">
              <div className="logo">
                <Link href="/">
                  <img src="/assets/img/logo.png" alt="FormationPlace" />
                </Link>
              </div>
            </div>
            <div className="col-4">
              <div className="top-cart">
                <Link href="/panier">
                  <i className="fa fa-shopping-cart" aria-hidden="true"></i> ({cartCount})
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Menu Mobile */}
      <div className="accordion-wrapper">
        <div id="mobilemenu" className="accordion">
          <ul>
            <li className="mob-logo">
              <Link href="/">
                <img src="/assets/img/logo.png" alt="FormationPlace" />
              </Link>
            </li>
            <li>
              <a href="#" className="closeme">
                <i className="flaticon-close"></i>
              </a>
            </li>
            <li>
              <Link href="/">Accueil</Link>
            </li>
            <li>
              <a href="#" className="link">
                Formations<i className="fa fa-chevron-down"></i>
              </a>
              <ul className="submenu">
                <li><Link href="/formations">Toutes les formations</Link></li>
                <li><Link href="/formations?filter=populaires">Formations populaires</Link></li>
                <li><Link href="/formations?filter=mieux-notees">Mieux notées</Link></li>
                <li><Link href="/formations?filter=nouvelles">Nouvelles formations</Link></li>
                <li><Link href="/formations?filter=promo">En promotion</Link></li>
              </ul>
            </li>
            <li>
              <a href="#" className="link">
                Catégories<i className="fa fa-chevron-down"></i>
              </a>
              <ul className="submenu">
                <li><Link href="/categories/developpement-web">Développement Web</Link></li>
                <li><Link href="/categories/business-marketing">Business &amp; Marketing</Link></li>
                <li><Link href="/categories/design">Design</Link></li>
                <li><Link href="/categories/photographie">Photographie</Link></li>
                <li><Link href="/categories/developpement-personnel">Développement Personnel</Link></li>
              </ul>
            </li>
            <li>
              <Link href="/formateurs">Formateurs</Link>
            </li>
            <li>
              <Link href="/blog">Blog</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
          <div className="mobile-login">
            <Link href="/login">Se connecter</Link> |
            <Link href="/register"> Créer un compte</Link>
          </div>
          <form action="#" id="moble-search">
            <input placeholder="Rechercher une formation..." type="text" />
            <button type="submit">
              <i className="fa fa-search"></i>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
