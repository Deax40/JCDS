import Link from 'next/link';

export default function HeroModern() {
  return (
    <div className="relative w-full bg-surface overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-purple/10 to-blue/10 rounded-bl-[100px] -z-0"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-gradient-to-tr from-green/5 to-transparent rounded-tr-[100px] -z-0"></div>

      <div className="container relative z-10 pt-20 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left animate-fade-in">
            <div className="inline-block px-4 py-2 mb-6 bg-white rounded-full shadow-sm border border-line">
              <span className="text-sm font-semibold text-purple tracking-wide uppercase">
                🚀 La plateforme #1 de formation
              </span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary leading-tight mb-6">
              Débloquez votre <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple to-blue">
                Potentiel
              </span>
            </h1>

            <p className="text-lg md:text-xl text-secondary leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
              Accédez à des milliers de cours de qualité créés par des experts.
              Développement, Design, Business, et plus encore.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link href="/formations" className="button-main px-10 py-4 text-base w-full sm:w-auto shadow-purple/20 hover:shadow-purple/40">
                Explorer les cours
              </Link>
              <Link href="/devenir-formateur" className="px-8 py-4 bg-white text-primary border border-line rounded-full hover:bg-surface hover:border-primary transition-all duration-300 font-semibold w-full sm:w-auto shadow-sm hover:shadow-md">
                Devenir Formateur
              </Link>
            </div>

            <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
               {/* Trust signals / Stats */}
               <div className="flex flex-col">
                 <span className="text-2xl font-bold text-primary">10k+</span>
                 <span className="text-sm text-secondary">Étudiants</span>
               </div>
               <div className="w-px h-10 bg-line"></div>
               <div className="flex flex-col">
                 <span className="text-2xl font-bold text-primary">500+</span>
                 <span className="text-sm text-secondary">Formateurs</span>
               </div>
               <div className="w-px h-10 bg-line"></div>
               <div className="flex flex-col">
                 <span className="text-2xl font-bold text-primary">4.8/5</span>
                 <span className="text-sm text-secondary">Satisfaction</span>
               </div>
            </div>
          </div>

          {/* Visual / Image Placeholder */}
          <div className="flex-1 w-full relative lg:h-[600px] h-[400px] flex items-center justify-center">
             <div className="relative w-full max-w-lg mx-auto">
                {/* Main Card */}
                <div className="absolute top-0 left-10 right-0 bottom-10 bg-gradient-to-br from-primary to-gray-800 rounded-3xl rotate-3 opacity-20 blur-2xl"></div>
                <div className="relative bg-white p-4 rounded-3xl shadow-2xl border border-white/50 overflow-hidden animate-fade-in" style={{animationDelay: '0.2s'}}>
                   <div className="aspect-[4/3] bg-surface rounded-2xl overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple/20 to-blue/20 flex items-center justify-center">
                        <i className="ph-bold ph-student text-6xl text-primary/20"></i>
                      </div>
                      {/* Floating elements */}
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg flex items-center gap-3 animate-bounce" style={{animationDuration: '3s'}}>
                        <div className="w-10 h-10 bg-green/10 rounded-full flex items-center justify-center text-green">
                          <i className="ph-bold ph-check-circle text-xl"></i>
                        </div>
                        <div>
                          <div className="text-xs text-secondary font-medium">Certifié</div>
                          <div className="text-sm font-bold">Expert</div>
                        </div>
                      </div>

                      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg flex items-center gap-3">
                         <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                            <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                            <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white"></div>
                         </div>
                         <div className="text-xs font-bold">+2k inscrits</div>
                      </div>
                   </div>

                   <div className="mt-6 px-2 pb-2">
                      <div className="h-4 w-2/3 bg-gray-100 rounded mb-3"></div>
                      <div className="h-3 w-full bg-gray-50 rounded mb-2"></div>
                      <div className="h-3 w-4/5 bg-gray-50 rounded"></div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
