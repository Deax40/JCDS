import Link from 'next/link';

export default function FooterAnvogue() {
  return (
    <>
      <div id="footer" className="footer">
        <div className="footer-main bg-surface">
          <div className="container">
            <div className="content-footer md:py-[60px] py-10 flex justify-between flex-wrap gap-y-8">
              {/* Company Info */}
              <div className="company-infor basis-1/4 max-lg:basis-full pr-7">
                <Link href="/" className="logo inline-block">
                  <div className="heading4">FormationPlace</div>
                </Link>
                <div className="flex gap-3 mt-6">
                  <div className="flex flex-col">
                    <span className="text-button">Email:</span>
                    <span className="text-button mt-3">Téléphone:</span>
                    <span className="text-button mt-3">Adresse:</span>
                  </div>
                  <div className="flex flex-col">
                    <span>contact@formationplace.fr</span>
                    <span className="mt-3">+33 1 23 45 67 89</span>
                    <span className="mt-3">123 Rue de la Formation, 75001 Paris</span>
                  </div>
                </div>
              </div>

              {/* Right Content */}
              <div className="right-content flex flex-wrap gap-y-8 basis-3/4 max-lg:basis-full">
                {/* Navigation Links */}
                <div className="list-nav flex justify-between basis-2/3 max-md:basis-full gap-4">
                  {/* Information Column */}
                  <div className="item flex flex-col basis-1/3">
                    <div className="text-button-uppercase pb-3">Information</div>
                    <Link href="/about" className="caption1 has-line-before duration-300 w-fit hover:text-black">
                      À propos de nous
                    </Link>
                    <Link href="/formateurs" className="caption1 has-line-before duration-300 w-fit pt-2 hover:text-black">
                      Nos formateurs
                    </Link>
                    <Link href="/dashboard" className="caption1 has-line-before duration-300 w-fit pt-2 hover:text-black">
                      Mon compte
                    </Link>
                    <Link href="/support" className="caption1 has-line-before duration-300 w-fit pt-2 hover:text-black">
                      Support
                    </Link>
                    <Link href="/faqs" className="caption1 has-line-before duration-300 w-fit pt-2 hover:text-black">
                      FAQs
                    </Link>
                  </div>

                  {/* Quick Links Column */}
                  <div className="item flex flex-col basis-1/3">
                    <div className="text-button-uppercase pb-3">Découvrir</div>
                    <Link href="/formations" className="caption1 has-line-before duration-300 w-fit hover:text-black">
                      Toutes les formations
                    </Link>
                    <Link href="/categories/developpement-web" className="caption1 has-line-before duration-300 w-fit pt-2 hover:text-black">
                      Développement Web
                    </Link>
                    <Link href="/categories/business-marketing" className="caption1 has-line-before duration-300 w-fit pt-2 hover:text-black">
                      Business & Marketing
                    </Link>
                    <Link href="/categories/design" className="caption1 has-line-before duration-300 w-fit pt-2 hover:text-black">
                      Design
                    </Link>
                    <Link href="/blog" className="caption1 has-line-before duration-300 w-fit pt-2 hover:text-black">
                      Blog
                    </Link>
                  </div>

                  {/* Services Column */}
                  <div className="item flex flex-col basis-1/3">
                    <div className="text-button-uppercase pb-3">Services</div>
                    <Link href="/devenir-formateur" className="caption1 has-line-before duration-300 w-fit hover:text-black">
                      Devenir formateur
                    </Link>
                    <Link href="/politique-confidentialite" className="caption1 has-line-before duration-300 w-fit pt-2 hover:text-black">
                      Politique de confidentialité
                    </Link>
                    <Link href="/cgv" className="caption1 has-line-before duration-300 w-fit pt-2 hover:text-black">
                      CGV
                    </Link>
                    <Link href="/mentions-legales" className="caption1 has-line-before duration-300 w-fit pt-2 hover:text-black">
                      Mentions légales
                    </Link>
                  </div>
                </div>

                {/* Newsletter */}
                <div className="newsletter basis-1/3 pl-7 max-md:basis-full max-md:pl-0">
                  <div className="text-button-uppercase">Newsletter</div>
                  <div className="caption1 mt-3">
                    Inscrivez-vous à notre newsletter et recevez 10% de réduction sur votre première formation
                  </div>
                  <div className="input-block w-full h-[52px] mt-4">
                    <form className="w-full h-full relative" action="/subscribe" method="post">
                      <input
                        type="email"
                        placeholder="Entrez votre email"
                        className="caption1 w-full h-full pl-4 pr-14 rounded-xl border border-line focus:outline-none focus:border-black"
                        required
                      />
                      <button className="w-[44px] h-[44px] bg-black flex items-center justify-center rounded-xl absolute top-1 right-1 hover:bg-gray-800 transition-colors">
                        <i className="ph ph-arrow-right text-xl text-white"></i>
                      </button>
                    </form>
                  </div>

                  {/* Social Media */}
                  <div className="list-social flex items-center gap-4 mt-4">
                    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                      <i className="ph-bold ph-facebook-logo text-2xl text-black"></i>
                    </a>
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                      <i className="ph-bold ph-instagram-logo text-2xl text-black"></i>
                    </a>
                    <a href="https://www.twitter.com/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                      <i className="ph-bold ph-twitter-logo text-2xl text-black"></i>
                    </a>
                    <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                      <i className="ph-bold ph-youtube-logo text-2xl text-black"></i>
                    </a>
                    <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                      <i className="ph-bold ph-linkedin-logo text-2xl text-black"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom py-4 flex items-center justify-between gap-5 max-lg:justify-center max-lg:flex-col border-t border-line">
              <div className="left flex items-center gap-8 max-md:flex-col max-md:gap-4">
                <div className="copyright caption1 text-secondary">
                  © {new Date().getFullYear()} FormationPlace. Tous droits réservés.
                </div>
                <div className="select-block flex items-center gap-5 max-md:hidden">
                  <div className="choose-language flex items-center gap-1.5">
                    <select className="caption2 bg-transparent cursor-pointer">
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                    </select>
                    <i className="ph ph-caret-down text-xs"></i>
                  </div>
                  <div className="choose-currency flex items-center gap-1.5">
                    <select className="caption2 bg-transparent cursor-pointer">
                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                      <option value="GBP">GBP</option>
                    </select>
                    <i className="ph ph-caret-down text-xs"></i>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="right flex items-center gap-2">
                <div className="caption1 text-secondary">Paiement:</div>
                <div className="flex items-center gap-2">
                  <div className="payment-img bg-white rounded border border-line p-1">
                    <span className="text-xs font-semibold">SumUp</span>
                  </div>
                  <div className="payment-img bg-white rounded border border-line p-1">
                    <span className="text-xs font-semibold">Visa</span>
                  </div>
                  <div className="payment-img bg-white rounded border border-line p-1">
                    <span className="text-xs font-semibold">MC</span>
                  </div>
                  <div className="payment-img bg-white rounded border border-line p-1">
                    <span className="text-xs font-semibold">PayPal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <a
        href="#top-nav"
        className="scroll-to-top-btn fixed bottom-8 right-8 w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all duration-300 z-40 opacity-0 invisible"
        id="scroll-to-top"
      >
        <i className="ph-bold ph-caret-up text-xl"></i>
      </a>

      {/* Add scroll behavior with a script tag or useEffect */}
      <script dangerouslySetInnerHTML={{
        __html: `
          window.addEventListener('scroll', function() {
            const scrollBtn = document.getElementById('scroll-to-top');
            if (window.scrollY > 300) {
              scrollBtn.classList.remove('opacity-0', 'invisible');
            } else {
              scrollBtn.classList.add('opacity-0', 'invisible');
            }
          });
        `
      }} />
    </>
  );
}
