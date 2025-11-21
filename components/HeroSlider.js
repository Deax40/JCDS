import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import Link from 'next/link';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

export default function HeroSlider() {
  const slides = [
    {
      id: 1,
      badge: '🚀 La plateforme #1 de formation',
      titlePrefix: 'Débloquez votre',
      titleHighlight: 'Potentiel',
      description: 'Accédez à des milliers de cours de qualité créés par des experts. Développement, Design, Business, et plus encore.',
      gradient: 'from-purple to-blue',
      imageIcon: 'ph-student',
      imageColor: 'bg-primary/20',
      stats: {
         top: { icon: 'ph-check-circle', text: 'Expert', sub: 'Certifié' },
         bottom: { count: '+2k inscrits' }
      },
      cta: { text: 'Explorer les cours', link: '/formations', secondary: 'Devenir Formateur', secondaryLink: '/devenir-formateur' }
    },
    {
      id: 2,
      badge: '💰 Gagnez des revenus',
      titlePrefix: 'Partagez votre',
      titleHighlight: 'Savoir',
      description: 'Créez votre formation en quelques clics et touchez des milliers d\'étudiants à travers le monde.',
      gradient: 'from-orange-500 to-red-500',
      imageIcon: 'ph-chalkboard-teacher',
      imageColor: 'bg-orange-500/20',
      stats: {
         top: { icon: 'ph-trend-up', text: 'Revenus', sub: 'Croissance' },
         bottom: { count: '+500 Formateurs' }
      },
      cta: { text: 'Je me lance', link: '/devenir-formateur', secondary: 'Comment ça marche ?', secondaryLink: '/aide' }
    },
    {
      id: 3,
      badge: '📱 Apprentissage mobile',
      titlePrefix: 'Apprenez sans',
      titleHighlight: 'Limites',
      description: 'Une expérience fluide sur tous vos appareils. Continuez votre formation où que vous soyez.',
      gradient: 'from-green-400 to-teal-500',
      imageIcon: 'ph-device-mobile',
      imageColor: 'bg-green-500/20',
      stats: {
         top: { icon: 'ph-wifi-high', text: 'Offline', sub: 'Mode' },
         bottom: { count: 'Accessible 24/7' }
      },
      cta: { text: 'Voir le catalogue', link: '/formations', secondary: 'Télécharger l\'app', secondaryLink: '#' }
    }
  ];

  return (
    <div className="relative w-full bg-surface overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1000}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletActiveClass: 'swiper-pagination-bullet-active !bg-primary !w-8 transition-all'
        }}
        className="w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full">
               {/* Abstract Background Shapes Dynamic */}
               <div className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl ${slide.gradient} opacity-10 rounded-bl-[100px] -z-0`}></div>

               <div className="container relative z-10 pt-20 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32">
                  <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                    {/* Text Content */}
                    <div className="flex-1 text-center lg:text-left">
                      <div className="inline-block px-4 py-2 mb-6 bg-white rounded-full shadow-sm border border-line animate-fade-in-up">
                        <span className="text-sm font-semibold text-primary tracking-wide uppercase">
                          {slide.badge}
                        </span>
                      </div>

                      <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary leading-tight mb-6">
                        {slide.titlePrefix} <br/>
                        <span className={`text-transparent bg-clip-text bg-gradient-to-r ${slide.gradient}`}>
                          {slide.titleHighlight}
                        </span>
                      </h1>

                      <p className="text-lg md:text-xl text-secondary leading-relaxed mb-8 max-w-2xl mx-auto lg:mx-0">
                        {slide.description}
                      </p>

                      <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                        <Link href={slide.cta.link} className="button-main px-10 py-4 text-base w-full sm:w-auto shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                          {slide.cta.text}
                        </Link>
                        <Link href={slide.cta.secondaryLink} className="px-8 py-4 bg-white text-primary border border-line rounded-full hover:bg-surface hover:border-primary transition-all duration-300 font-semibold w-full sm:w-auto shadow-sm hover:shadow-md">
                          {slide.cta.secondary}
                        </Link>
                      </div>

                      {/* Stats Row (Static for stability or dynamic if preferred) */}
                      <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 opacity-80 grayscale hover:grayscale-0 transition-all duration-500">
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

                    {/* Visual Content */}
                    <div className="flex-1 w-full relative lg:h-[600px] h-[400px] flex items-center justify-center hidden md:flex">
                       <div className="relative w-full max-w-lg mx-auto">
                          {/* Main Card Shadow */}
                          <div className={`absolute top-0 left-10 right-0 bottom-10 bg-gradient-to-br ${slide.gradient} rounded-3xl rotate-3 opacity-20 blur-2xl`}></div>

                          {/* Card Content */}
                          <div className="relative bg-white p-4 rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                             <div className="aspect-[4/3] bg-surface rounded-2xl overflow-hidden relative">
                                <div className={`absolute inset-0 bg-gradient-to-br ${slide.gradient} opacity-10 flex items-center justify-center`}>
                                  <i className={`ph-bold ${slide.imageIcon} text-8xl text-primary/20`}></i>
                                </div>

                                {/* Floating elements */}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg flex items-center gap-3 animate-bounce" style={{animationDuration: '3s'}}>
                                  <div className="w-10 h-10 bg-green/10 rounded-full flex items-center justify-center text-green">
                                    <i className={`ph-bold ${slide.stats.top.icon} text-xl`}></i>
                                  </div>
                                  <div>
                                    <div className="text-xs text-secondary font-medium">{slide.stats.top.sub}</div>
                                    <div className="text-sm font-bold">{slide.stats.top.text}</div>
                                  </div>
                                </div>

                                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg flex items-center gap-3">
                                   <div className="flex -space-x-2">
                                      <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white"></div>
                                      <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
                                      <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white"></div>
                                   </div>
                                   <div className="text-xs font-bold">{slide.stats.bottom.count}</div>
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
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
