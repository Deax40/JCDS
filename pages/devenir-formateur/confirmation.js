import Head from 'next/head';
import Link from 'next/link';
import HeaderAnvogue from '../../components/HeaderAnvogue';
import FooterAnvogue from '../../components/FooterAnvogue';

export default function ConfirmationFormateur() {
  return (
    <>
      <Head>
        <title>Candidature Envoyée - FormationPlace</title>
      </Head>

      <div className="overflow-x-hidden">
        <HeaderAnvogue />

        <div className="min-h-screen bg-surface py-20">
          <div className="container">
            <div className="max-w-2xl mx-auto">
              {/* Success Card */}
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
                {/* Success Icon */}
                <div className="w-24 h-24 bg-green bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ph-bold ph-check-circle text-green text-6xl"></i>
                </div>

                <h1 className="heading3 mb-4">Candidature envoyée avec succès !</h1>

                <p className="text-lg text-secondary mb-8">
                  Votre demande pour devenir formateur a bien été reçue par notre équipe.
                </p>

                {/* Timeline */}
                <div className="bg-surface rounded-xl p-6 mb-8 text-left">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <i className="ph-bold ph-clock-countdown text-purple mr-2 text-xl"></i>
                    Prochaines étapes
                  </h3>

                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-green text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                        1
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-1">Traitement de votre candidature</p>
                        <p className="text-sm text-secondary">Notre équipe examine votre demande - En cours</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple bg-opacity-20 text-purple flex items-center justify-center flex-shrink-0 text-sm font-bold">
                        2
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-1">Email de confirmation</p>
                        <p className="text-sm text-secondary">Vous recevrez un email dans les 24 heures</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple bg-opacity-20 text-purple flex items-center justify-center flex-shrink-0 text-sm font-bold">
                        3
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-1">Formulaire complet</p>
                        <p className="text-sm text-secondary">Remplissez le formulaire détaillé pour finaliser votre inscription</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple bg-opacity-20 text-purple flex items-center justify-center flex-shrink-0 text-sm font-bold">
                        4
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-1">Activation du compte formateur</p>
                        <p className="text-sm text-secondary">Commencez à créer et vendre vos formations !</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Alert */}
                <div className="bg-blue bg-opacity-5 border border-blue border-opacity-20 rounded-xl p-4 mb-8 text-left">
                  <div className="flex gap-3">
                    <i className="ph-bold ph-info text-blue text-xl flex-shrink-0 mt-0.5"></i>
                    <div className="text-sm">
                      <p className="font-semibold mb-1">Vérifiez votre boîte email</p>
                      <p className="text-secondary">
                        Notre équipe vous enverra un email de confirmation sous 24h. Pensez à vérifier vos spams si vous ne le recevez pas.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/mon-compte"
                    className="px-8 py-3 bg-gradient-to-r from-purple to-blue text-white rounded-xl font-semibold hover:from-purple hover:to-purple transition-all duration-300 text-center"
                  >
                    <i className="ph-bold ph-user-circle mr-2"></i>
                    Retour à mon compte
                  </Link>

                  <Link
                    href="/"
                    className="px-8 py-3 bg-surface text-primary rounded-xl font-semibold hover:bg-opacity-80 transition-all duration-300 text-center"
                  >
                    <i className="ph-bold ph-house mr-2"></i>
                    Retour à l'accueil
                  </Link>
                </div>
              </div>

              {/* Additional Info */}
              <div className="mt-8 text-center">
                <p className="text-sm text-secondary mb-2">Besoin d'aide ?</p>
                <Link href="/contact" className="text-purple hover:underline font-medium">
                  Contactez notre équipe support
                </Link>
              </div>
            </div>
          </div>
        </div>

        <FooterAnvogue />
      </div>
    </>
  );
}
