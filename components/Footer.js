import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer-widget-area">
      <div className="container-fluid custom-container">
        <div className="row">
          <div className="col-md-6 col-lg-3 col-xl-3">
            <div className="footer-widget">
              <div className="logo">
                <Link href="/">
                  <img src="/assets/img/logo2.png" alt="FormationPlace" />
                </Link>
              </div>
              <p>
                FormationPlace est la marketplace de formations en ligne qui connecte
                les formateurs passionnés avec les apprenants motivés. Développez vos
                compétences ou partagez votre expertise avec notre communauté.
              </p>
              <div className="social">
                <ul>
                  <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                  <li><a href="#"><i className="fab fa-twitter"></i></a></li>
                  <li><a href="#"><i className="fab fa-pinterest-p"></i></a></li>
                  <li><a href="#"><i className="fab fa-instagram"></i></a></li>
                  <li><a href="#"><i className="fab fa-linkedin-in"></i></a></li>
                  <li><a href="#"><i className="fab fa-youtube"></i></a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-md-6 col-lg-3 col-xl-3">
            <div className="footer-widget">
              <h3>Découvrir</h3>
              <div className="footer-menu">
                <ul>
                  <li><Link href="/about">À propos de nous</Link></li>
                  <li><Link href="/formations">Parcourir les formations</Link></li>
                  <li><Link href="/formateurs">Nos formateurs</Link></li>
                  <li><Link href="/devenir-formateur">Devenir formateur</Link></li>
                  <li><Link href="/blog">Notre blog</Link></li>
                  <li><Link href="/contact">Nous contacter</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-md-6 col-lg-3 col-xl-3">
            <div className="footer-widget">
              <h3>Catégories Populaires</h3>
              <div className="footer-menu">
                <ul>
                  <li><Link href="/categories/developpement-web">Développement Web</Link></li>
                  <li><Link href="/categories/business-marketing">Business &amp; Marketing</Link></li>
                  <li><Link href="/categories/design">Design Graphique</Link></li>
                  <li><Link href="/categories/photographie">Photographie</Link></li>
                  <li><Link href="/categories/developpement-personnel">Développement Personnel</Link></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-6 col-lg-3 col-xl-3">
            <div className="footer-widget">
              <h3>Moyens de paiement</h3>
              <p>
                Paiements sécurisés via SumUp. Toutes vos transactions sont protégées
                et cryptées pour garantir la sécurité de vos données.
              </p>
              <div className="payment-link">
                <ul>
                  <li><a href="#"><img src="/assets/img/payment/p1.png" alt="Visa" /></a></li>
                  <li><a href="#"><img src="/assets/img/payment/p2.png" alt="Mastercard" /></a></li>
                  <li><a href="#"><img src="/assets/img/payment/p3.png" alt="PayPal" /></a></li>
                  <li><a href="#"><img src="/assets/img/payment/p4.png" alt="SumUp" /></a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="row">
            <div className="col-12">
              <p>
                Copyright © <span>{new Date().getFullYear()}</span> FormationPlace •
                Tous droits réservés •{' '}
                <Link href="/mentions-legales">Mentions légales</Link> •{' '}
                <Link href="/cgv">CGV</Link> •{' '}
                <Link href="/politique-confidentialite">Politique de confidentialité</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
