import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useCurrency } from '../context/CurrencyContext';
import { useAuth } from '../context/AuthContext';

export default function HeaderAnvogue() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currency, changeCurrency } = useCurrency();
  const { user, cart, wishlist, logout } = useAuth();
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <>
      {/* Top Nav Bar */}
      <div id="top-nav" className="top-nav style-one bg-black md:h-[44px] h-[30px]">
        <div className="container mx-auto h-full">
          <div className="top-nav-main flex justify-between max-md:justify-center h-full">
            <div className="left-content flex items-center gap-5 max-md:hidden">
              <div className="choose-type choose-language flex items-center gap-1.5">
                <div className="select relative">
                  <p className="caption2 text-white cursor-pointer">Français</p>
                </div>
                <i className="ph ph-caret-down text-xs text-white"></i>
              </div>
              <div
                className="choose-type choose-currency flex items-center gap-1.5 relative cursor-pointer"
                onMouseEnter={() => setShowCurrencyMenu(true)}
                onMouseLeave={() => setShowCurrencyMenu(false)}
              >
                <div className="select relative">
                  <p className="caption2 text-white cursor-pointer">{currency}</p>
                </div>
                <i className="ph ph-caret-down text-xs text-white"></i>

                {/* Menu déroulant devise */}
                {showCurrencyMenu && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg py-2 min-w-[80px] z-50">
                    <button
                      onClick={() => changeCurrency('EUR')}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-surface transition-colors ${
                        currency === 'EUR' ? 'font-bold text-purple' : 'text-secondary'
                      }`}
                    >
                      EUR (€)
                    </button>
                    <button
                      onClick={() => changeCurrency('USD')}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-surface transition-colors ${
                        currency === 'USD' ? 'font-bold text-purple' : 'text-secondary'
                      }`}
                    >
                      USD ($)
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="text-center text-button-uppercase text-white flex items-center">
              Nouveau : 10% de réduction avec le code FORMATION10
            </div>
            <div className="right-content flex items-center gap-5 max-md:hidden">
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                <i className="ph ph-twitter-logo text-white text-lg"></i>
              </a>
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                <i className="ph ph-instagram-logo text-white text-lg"></i>
              </a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                <i className="ph ph-linkedin-logo text-white text-lg"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div id="header" className="relative w-full bg-white">
        <div className="header-menu style-one w-full md:h-[74px] h-[56px] border-b border-line">
          <div className="container mx-auto h-full">
            <div className="header-main flex justify-between h-full">
              {/* Mobile Menu Icon */}
              <div className="menu-mobile-icon lg:hidden flex items-center">
                <button onClick={() => setIsMobileMenuOpen(true)}>
                  <i className="ph-bold ph-list text-2xl"></i>
                </button>
              </div>

              {/* Logo + Menu */}
              <div className="left flex items-center gap-16">
                <Link href="/" className="flex items-center max-lg:absolute max-lg:left-1/2 max-lg:-translate-x-1/2">
                  <div className="heading4">FormationPlace</div>
                </Link>

                {/* Desktop Menu */}
                <div className="menu-main h-full max-lg:hidden">
                  <ul className="flex items-center gap-8 h-full">
                    <li className="h-full relative group">
                      <Link href="/" className="text-button-uppercase duration-300 h-full flex items-center justify-center text-black hover:text-purple">
                        Accueil
                      </Link>
                    </li>

                    <li className="h-full relative group">
                      <Link href="/formations" className="text-button-uppercase duration-300 h-full flex items-center justify-center gap-1 text-black hover:text-purple">
                        Formations
                        <i className="ph ph-caret-down text-xs"></i>
                      </Link>
                      <div className="sub-menu py-3 px-5 -left-10 w-max absolute top-full bg-white rounded-b-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                        <ul className="w-full">
                          <li>
                            <Link href="/formations" className="link text-secondary duration-300 block py-2 hover:text-black whitespace-nowrap">
                              Toutes les formations
                            </Link>
                          </li>
                          <li>
                            <Link href="/formations?filter=populaires" className="link text-secondary duration-300 block py-2 hover:text-black whitespace-nowrap">
                              Formations populaires
                            </Link>
                          </li>
                          <li>
                            <Link href="/formations?filter=mieux-notees" className="link text-secondary duration-300 block py-2 hover:text-black whitespace-nowrap">
                              Mieux notées
                            </Link>
                          </li>
                          <li>
                            <Link href="/formations?filter=nouvelles" className="link text-secondary duration-300 block py-2 hover:text-black whitespace-nowrap">
                              Nouvelles formations
                            </Link>
                          </li>
                          <li>
                            <Link href="/formations?filter=promo" className="link text-secondary duration-300 block py-2 hover:text-black whitespace-nowrap">
                              En promotion
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </li>

                    <li className="h-full relative group">
                      <Link href="/categories" className="text-button-uppercase duration-300 h-full flex items-center justify-center gap-1 text-black hover:text-purple">
                        Catégories
                        <i className="ph ph-caret-down text-xs"></i>
                      </Link>
                      <div className="sub-menu py-3 px-5 -left-10 w-max absolute top-full bg-white rounded-b-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                        <ul className="w-full">
                          <li>
                            <Link href="/categories/developpement-web" className="link text-secondary duration-300 block py-2 hover:text-black whitespace-nowrap">
                              Développement Web
                            </Link>
                          </li>
                          <li>
                            <Link href="/categories/developpement-personnel-mindset" className="link text-secondary duration-300 block py-2 hover:text-black whitespace-nowrap">
                              Développement Personnel & Mindset
                            </Link>
                          </li>
                          <li>
                            <Link href="/categories/argent-business-independance" className="link text-secondary duration-300 block py-2 hover:text-black whitespace-nowrap">
                              Argent, Business & Indépendance
                            </Link>
                          </li>
                          <li>
                            <Link href="/categories/langues" className="link text-secondary duration-300 block py-2 hover:text-black whitespace-nowrap">
                              Langues
                            </Link>
                          </li>
                          <li>
                            <Link href="/categories/droit" className="link text-secondary duration-300 block py-2 hover:text-black whitespace-nowrap">
                              Droit
                            </Link>
                          </li>
                          <li>
                            <Link href="/categories/fitness-bien-etre-sante" className="link text-secondary duration-300 block py-2 hover:text-black whitespace-nowrap">
                              Fitness, Bien-être & Santé
                            </Link>
                          </li>
                          <li>
                            <Link href="/categories/carriere-competences-professionnelles" className="link text-secondary duration-300 block py-2 hover:text-black whitespace-nowrap">
                              Carrière & Compétences Professionnelles
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </li>

                    <li className="h-full">
                      <Link href="/formateurs" className="text-button-uppercase duration-300 h-full flex items-center justify-center text-black hover:text-purple">
                        Formateurs
                      </Link>
                    </li>

                    <li className="h-full">
                      <Link href="/comment-ca-marche" className="text-button-uppercase duration-300 h-full flex items-center justify-center text-black hover:text-purple">
                        Comment ça marche
                      </Link>
                    </li>

                    <li className="h-full">
                      <Link href="/contact" className="text-button-uppercase duration-300 h-full flex items-center justify-center text-black hover:text-purple">
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right Actions */}
              <div className="right flex gap-12">
                <div className="max-md:hidden search-icon flex items-center cursor-pointer relative">
                  <i className="ph-bold ph-magnifying-glass text-2xl"></i>
                  <div className="line absolute bg-line w-px h-6 -right-6"></div>
                </div>

                <div className="list-action flex items-center gap-4">
                  {/* User Icon */}
                  <div
                    className="user-icon flex items-center justify-center cursor-pointer relative group"
                    onClick={() => {
                      if (user) {
                        router.push('/mon-compte');
                      } else {
                        router.push('/login');
                      }
                    }}
                  >
                    <i className="ph-bold ph-user text-2xl"></i>
                    <div
                      className="login-popup absolute top-[74px] w-[320px] p-7 rounded-xl bg-white box-shadow-sm opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {user ? (
                        <>
                          {/* Utilisateur connecté */}
                          <div className="mb-4 pb-4 border-b border-line">
                            <p className="text-sm text-secondary mb-1">Connecté en tant que</p>
                            <p className="font-semibold">{user.pseudo}</p>
                            <p className="text-sm text-secondary">ID: {user.id}</p>
                          </div>
                          <Link href="/mon-compte" className="button-main w-full text-center block mb-3">
                            Mon compte
                          </Link>
                          <Link href="/mes-achats" className="button-white w-full text-center block mb-3">
                            Mes achats
                          </Link>
                          <div className="bottom mt-4 pt-4 border-t border-line"></div>
                          <Link href="/support" className="body1 hover:underline block mb-3">
                            Support
                          </Link>
                          <button
                            onClick={logout}
                            className="w-full text-left body1 text-red hover:underline"
                          >
                            Déconnexion
                          </button>
                        </>
                      ) : (
                        <>
                          {/* Utilisateur non connecté */}
                          <Link href="/login" className="button-main w-full text-center block">
                            Connexion
                          </Link>
                          <div className="text-secondary text-center mt-3 pb-4">
                            Pas de compte ?
                            <Link href="/register" className="text-black pl-1 hover:underline">
                              Inscription
                            </Link>
                          </div>
                          <div className="bottom mt-4 pt-4 border-t border-line"></div>
                          <Link href="/support" className="body1 hover:underline">
                            Support
                          </Link>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Wishlist Icon */}
                  {user ? (
                    <Link href="/favoris" className="max-md:hidden wishlist-icon flex items-center relative cursor-pointer">
                      <i className="ph-bold ph-heart text-2xl"></i>
                      {wishlist && wishlist.length > 0 && (
                        <span className="quantity wishlist-quantity absolute -right-1.5 -top-1.5 text-xs text-white bg-black w-4 h-4 flex items-center justify-center rounded-full">
                          {wishlist.length}
                        </span>
                      )}
                    </Link>
                  ) : (
                    <button
                      onClick={() => alert('Créez votre compte pour accéder aux favoris')}
                      className="max-md:hidden wishlist-icon flex items-center relative cursor-pointer"
                    >
                      <i className="ph-bold ph-heart text-2xl"></i>
                    </button>
                  )}

                  {/* Cart Icon */}
                  {user ? (
                    <Link href="/panier" className="max-md:hidden cart-icon flex items-center relative cursor-pointer">
                      <i className="ph-bold ph-handbag text-2xl"></i>
                      {cart && cart.length > 0 && (
                        <span className="quantity cart-quantity absolute -right-1.5 -top-1.5 text-xs text-white bg-black w-4 h-4 flex items-center justify-center rounded-full">
                          {cart.length}
                        </span>
                      )}
                    </Link>
                  ) : (
                    <button
                      onClick={() => alert('Créez votre compte pour accéder au panier')}
                      className="max-md:hidden cart-icon flex items-center relative cursor-pointer"
                    >
                      <i className="ph-bold ph-handbag text-2xl"></i>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="menu-mobile fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="menu-container bg-white h-full w-80 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="container h-full py-6">
              <div className="heading flex items-center justify-between mb-6">
                <Link href="/" className="logo text-2xl font-semibold">
                  FormationPlace
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="w-8 h-8 rounded-full bg-surface flex items-center justify-center">
                  <i className="ph ph-x text-lg"></i>
                </button>
              </div>

              <div className="form-search relative mb-6">
                <i className="ph ph-magnifying-glass text-xl absolute left-3 top-1/2 -translate-y-1/2"></i>
                <input type="text" placeholder="Rechercher une formation..." className="h-12 rounded-lg border border-line text-sm w-full pl-10 pr-4" />
              </div>

              <div className="list-nav">
                <ul className="space-y-4">
                  <li>
                    <Link href="/" className="text-lg font-semibold block py-2">Accueil</Link>
                  </li>
                  <li>
                    <Link href="/formations" className="text-lg font-semibold block py-2">Formations</Link>
                  </li>
                  <li>
                    <Link href="/categories" className="text-lg font-semibold block py-2">Catégories</Link>
                  </li>
                  <li>
                    <Link href="/formateurs" className="text-lg font-semibold block py-2">Formateurs</Link>
                  </li>
                  <li>
                    <Link href="/comment-ca-marche" className="text-lg font-semibold block py-2">Comment ça marche</Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-lg font-semibold block py-2">Contact</Link>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-8 border-t border-line">
                <Link href="/login" className="button-main w-full mb-4">
                  Connexion
                </Link>
                <Link href="/register" className="button-white w-full">
                  Inscription
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
