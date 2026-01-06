# Instructions pour Push sur GitHub

Le repository Git est prêt, mais vous devez vous authentifier pour pusher sur GitHub.

## Option 1: Utiliser SSH (Recommandé)

### Étape 1: Vérifier si vous avez une clé SSH

```bash
ls -la ~/.ssh
```

Si vous voyez `id_rsa` ou `id_ed25519`, vous avez déjà une clé SSH.

### Étape 2: Si vous n'avez pas de clé, créez-en une

```bash
ssh-keygen -t ed25519 -C "votre-email@example.com"
```

Appuyez sur Entrée pour tout accepter par défaut.

### Étape 3: Copier votre clé SSH publique

```bash
cat ~/.ssh/id_ed25519.pub
```

### Étape 4: Ajouter la clé SSH à GitHub

1. Allez sur GitHub → Settings → SSH and GPG keys
2. Cliquez sur "New SSH key"
3. Collez votre clé publique
4. Cliquez sur "Add SSH key"

### Étape 5: Changer l'URL du remote pour SSH

```bash
cd /Users/juliencividin/Desktop/JCDS-master
git remote set-url origin git@github.com:Deax40/JCDS.git
git push -u origin main
```

---

## Option 2: Utiliser un Personal Access Token (PAT)

### Étape 1: Créer un token sur GitHub

1. Allez sur GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Cliquez sur "Generate new token (classic)"
3. Donnez un nom au token (ex: "JCDS Project")
4. Cochez la case `repo` (Full control of private repositories)
5. Cliquez sur "Generate token"
6. **IMPORTANT**: Copiez le token immédiatement (vous ne pourrez plus le voir après)

### Étape 2: Pusher avec le token

```bash
cd /Users/juliencividin/Desktop/JCDS-master
git push https://VOTRE_TOKEN@github.com/Deax40/JCDS.git main
```

Remplacez `VOTRE_TOKEN` par le token que vous avez copié.

### Étape 3: Ou configurer Git pour sauvegarder les credentials

```bash
cd /Users/juliencividin/Desktop/JCDS-master
git config credential.helper store
git push -u origin main
```

Quand on vous demandera :
- Username: Votre nom d'utilisateur GitHub
- Password: Votre Personal Access Token (pas votre mot de passe GitHub !)

---

## Vérifier que le push a fonctionné

Une fois le push réussi, allez sur :
https://github.com/Deax40/JCDS

Vous devriez voir tous vos fichiers !

## Déploiement automatique sur Vercel

Si votre projet est connecté à Vercel, le déploiement se fera automatiquement après le push.

Vérifiez sur : https://vercel.com/dashboard
