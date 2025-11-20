# Guide de Déploiement Automatique - FormationPlace

## Déploiement Automatique avec Vercel

### Configuration initiale

1. **Connecter le projet à Vercel**
   - Va sur [vercel.com](https://vercel.com)
   - Clique sur "Add New Project"
   - Importe ton repo GitHub `Deax40/JCDS`
   - Vercel détectera automatiquement Next.js

2. **Configurer les variables d'environnement**
   Dans les settings Vercel, ajoute ces variables:
   ```
   DATABASE_URL=postgresql://...
   NEXTAUTH_SECRET=ton_secret_aleatoire
   NEXTAUTH_URL=https://ton-site.vercel.app
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=ton_email@gmail.com
   SMTP_PASSWORD=ton_mot_de_passe
   SMTP_FROM=noreply@formationplace.com
   ```

3. **Activer le déploiement automatique**
   - Dans Vercel → Settings → Git
   - Assure-toi que "Production Branch" est sur `main`
   - Active "Automatic deployments from Git"

### Comment ça marche maintenant

✅ **Chaque fois que tu push sur GitHub, Vercel déploiera automatiquement**

```bash
git add .
git commit -m "Mon message"
git push origin main
# Vercel détecte le push et déploie automatiquement!
```

### Workflow automatique

```
Push GitHub → Vercel détecte → Build → Tests → Déploiement → Site live!
```

### Vérifier les déploiements

- Va sur [vercel.com/dashboard](https://vercel.com/dashboard)
- Clique sur ton projet
- Onglet "Deployments" pour voir l'historique
- Chaque push crée un nouveau déploiement

### Rollback rapide

Si un déploiement a un problème:
1. Va dans Vercel → Deployments
2. Trouve le dernier déploiement qui fonctionnait
3. Clique sur "..." → "Promote to Production"

### Variables d'environnement

Pour ajouter/modifier des variables:
1. Vercel Dashboard → Ton projet → Settings → Environment Variables
2. Ajoute ou modifie
3. Redéploie pour que les changements prennent effet

### Preview Deployments

- Chaque PR GitHub crée un preview deployment automatique
- URL unique pour tester avant de merge
- Parfait pour tester de nouvelles features

## Monitoring

- **Logs**: Vercel → Ton projet → Functions → Logs en temps réel
- **Analytics**: Vercel → Ton projet → Analytics (visiteurs, performance)
- **Speed Insights**: Metrics de performance automatiques

## Domaine personnalisé (optionnel)

1. Vercel → Ton projet → Settings → Domains
2. Ajoute ton domaine personnalisé
3. Configure les DNS selon les instructions
4. HTTPS automatique avec certificat SSL

---

**C'est tout! Maintenant chaque `git push` déploie automatiquement ton site.** 🚀
