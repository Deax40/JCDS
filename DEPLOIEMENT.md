# Guide de Déploiement Automatique - FormationPlace

## Déploiement Automatique avec Vercel

### ⚠️ IMPORTANT : Configuration vercel.json

**Le fichier `vercel.json` doit être MINIMAL :**
```json
{
  "framework": "nextjs"
}
```

**NE PAS mettre dans vercel.json :**
- ❌ `rewrites` (casse le routing Next.js et le chargement CSS/JS)
- ❌ `buildCommand` (Vercel détecte automatiquement Next.js)
- ❌ `env` (mettre dans Dashboard à la place)

### Configuration initiale

1. **Connecter le projet à Vercel**
   - Va sur [vercel.com](https://vercel.com)
   - Clique sur "Add New Project"
   - Importe ton repo GitHub `Deax40/JCDS`
   - Vercel détectera automatiquement Next.js

2. **Configurer les variables d'environnement**
   Dans Vercel Dashboard → Project → Settings → Environment Variables, ajoute :

   ```
   DATABASE_URL = postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
   NEXTAUTH_SECRET = [générer avec: openssl rand -base64 32]
   NEXTAUTH_URL = https://ton-site.vercel.app
   SMTP_HOST = smtp.gmail.com
   SMTP_PORT = 587
   SMTP_USER = ton_email@gmail.com
   SMTP_PASSWORD = ton_mot_de_passe_app
   SMTP_FROM = noreply@formationplace.com
   ```

   **Important :** Sélectionne "Production", "Preview" et "Development" pour chaque variable.

3. **Vérifier les Build Settings**
   - Framework Preset : **Next.js** (auto-détecté)
   - Build Command : Laisser vide (auto-detect)
   - Output Directory : Laisser vide (auto-detect)
   - Install Command : Laisser vide (auto-detect)

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
