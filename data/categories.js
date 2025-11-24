// Données des catégories avec thèmes visuels et compteurs
export const categories = [
  {
    name: 'Développement Web',
    slug: 'developpement-web',
    description: 'Apprenez les technologies web modernes : HTML, CSS, JavaScript, React, Node.js et plus',
    count: 0, // Nombre de formations (à mettre à jour dynamiquement)
    icon: 'ph-code',
    gradient: 'from-blue to-cyan-500',
    secondaryIcon: 'ph-brackets-curly',
    pattern: 'code' // Pour afficher des lignes de code en arrière-plan
  },
  {
    name: 'Développement Personnel & Mindset',
    slug: 'developpement-personnel-mindset',
    description: 'Développez votre confiance, votre état d\'esprit et atteignez vos objectifs personnels',
    count: 0,
    icon: 'ph-brain',
    gradient: 'from-purple to-pink',
    secondaryIcon: 'ph-lightbulb',
    pattern: 'dots'
  },
  {
    name: 'Argent, Business & Indépendance',
    slug: 'argent-business-independance',
    description: 'Entrepreneuriat, finance personnelle, création d\'entreprise et liberté financière',
    count: 0,
    icon: 'ph-currency-dollar',
    gradient: 'from-emerald-500 to-teal-500',
    secondaryIcon: 'ph-chart-line-up',
    pattern: 'grid'
  },
  {
    name: 'Langues',
    slug: 'langues',
    description: 'Apprenez de nouvelles langues : anglais, espagnol, allemand, japonais et plus',
    count: 0,
    icon: 'ph-translate',
    gradient: 'from-orange to-yellow',
    secondaryIcon: 'ph-globe',
    pattern: 'dots'
  },
  {
    name: 'Droit',
    slug: 'droit',
    description: 'Formations juridiques, droit des affaires, droit du travail et réglementations',
    count: 0,
    icon: 'ph-scales',
    gradient: 'from-indigo-500 to-purple',
    secondaryIcon: 'ph-gavel',
    pattern: 'lines'
  },
  {
    name: 'Fitness, Bien-être & Santé',
    slug: 'fitness-bien-etre-sante',
    description: 'Sport, nutrition, yoga, méditation et santé physique et mentale',
    count: 0,
    icon: 'ph-heart',
    gradient: 'from-red to-pink',
    secondaryIcon: 'ph-activity',
    pattern: 'grid'
  },
  {
    name: 'Carrière & Compétences Professionnelles',
    slug: 'carriere-competences-professionnelles',
    description: 'Management, leadership, communication et compétences pour réussir professionnellement',
    count: 0,
    icon: 'ph-briefcase',
    gradient: 'from-blue to-indigo-500',
    secondaryIcon: 'ph-user-focus',
    pattern: 'dots'
  }
];

// Fonction pour obtenir une catégorie par son slug
export function getCategoryBySlug(slug) {
  return categories.find(cat => cat.slug === slug);
}

// Fonction pour obtenir toutes les catégories
export function getAllCategories() {
  return categories;
}

// Fonction pour mettre à jour le compteur d'une catégorie (sera utilisée avec la DB plus tard)
export async function getCategoryCount(slug) {
  // TODO: Remplacer par une vraie requête DB
  // Pour l'instant, retourne 0 pour toutes les catégories
  return 0;
}
