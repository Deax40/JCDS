# Configuration Web3Forms pour le Formulaire "Devenir Formateur"

## 🎯 Objectif

Le formulaire "Devenir Formateur" utilise Web3Forms pour envoyer les candidatures directement dans votre boîte email, sans serveur backend complexe.

## 📋 Étapes de Configuration

### 1. Créer un compte Web3Forms

1. Allez sur [https://web3forms.com](https://web3forms.com)
2. Cliquez sur **"Get Started Free"**
3. Inscrivez-vous avec votre adresse email (celle qui recevra les candidatures)
4. Vérifiez votre email

### 2. Obtenir votre Access Key

1. Une fois connecté, vous verrez votre **Access Key** dans le dashboard
2. Copiez cette clé (elle ressemble à: `a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6`)

### 3. Configurer la Clé dans le Projet

Ouvrez le fichier: `pages/devenir-formateur.js`

Trouvez la ligne 60:
```javascript
web3FormData.append('access_key', 'YOUR_WEB3FORMS_ACCESS_KEY');
```

Remplacez `'YOUR_WEB3FORMS_ACCESS_KEY'` par votre vraie clé:
```javascript
web3FormData.append('access_key', 'a1b2c3d4-e5f6-7g8h-9i0j-k1l2m3n4o5p6');
```

### 4. Configuration Avancée (Optionnel)

Dans le dashboard Web3Forms, vous pouvez configurer:

#### Email de Notification
- **Email de destination**: Où recevoir les candidatures
- **Notification par email**: Activé par défaut

#### Options Avancées
- **Auto-response**: Email automatique envoyé au candidat
- **Spam Protection**: Protection anti-spam intégrée
- **Webhook**: URL pour intégrer avec d'autres services

#### Template d'Email Personnalisé
Vous pouvez personnaliser le contenu des emails reçus dans:
Settings → Email Template

Exemple de template:
```
Nouvelle Candidature Formateur

Nom: {Nom}
Email: {Email}
Pseudo: {Pseudo}
Téléphone: {Téléphone}
ID Utilisateur: {ID Utilisateur}

Raison de la candidature:
{Raison de la candidature}

Type de formations:
{Type de formations}
```

## 🔒 Sécurité

- ✅ La clé Access Key peut être visible côté client (c'est normal)
- ✅ Web3Forms a une protection anti-spam intégrée
- ✅ Limite de 250 soumissions/mois sur le plan gratuit
- ✅ Passez au plan Pro pour plus de soumissions

## 📊 Plan Gratuit vs Pro

### Plan Gratuit (Free)
- 250 soumissions/mois
- Protection anti-spam
- Auto-réponses
- Webhooks
- Support par email

### Plan Pro ($8/mois)
- 10,000 soumissions/mois
- Tout du plan gratuit
- Support prioritaire
- Suppression du branding Web3Forms

## ✅ Test du Formulaire

1. Connectez-vous sur votre site avec un compte acheteur
2. Allez dans "Mon Compte"
3. Cliquez sur "Devenir Formateur"
4. Remplissez le formulaire de test
5. Soumettez
6. Vérifiez votre boîte email configurée dans Web3Forms

## 📧 Email Reçu

Vous recevrez un email contenant:
- **Subject**: Nouvelle demande formateur - [Nom du candidat]
- **From**: FormationPlace - Candidature Formateur
- **Content**:
  - Nom complet
  - Email
  - Pseudo
  - ID Utilisateur
  - Téléphone
  - Raison de la candidature
  - Type de formations souhaitées

## 🚨 Dépannage

### Le formulaire ne s'envoie pas
- Vérifiez que la clé Access Key est correcte
- Vérifiez la console du navigateur pour les erreurs
- Assurez-vous d'être connecté avant de soumettre

### Je ne reçois pas l'email
- Vérifiez vos spams
- Vérifiez l'email configuré dans Web3Forms
- Attendez jusqu'à 5 minutes (délai de livraison)

### Erreur "Invalid Access Key"
- La clé est incorrecte ou expirée
- Vérifiez votre dashboard Web3Forms
- Régénérez une nouvelle clé si nécessaire

## 📚 Documentation Web3Forms

- [Documentation officielle](https://docs.web3forms.com)
- [API Reference](https://docs.web3forms.com/api-reference)
- [Exemples](https://web3forms.com/examples)

## 🆘 Support

Si vous avez des questions:
- [Support Web3Forms](https://web3forms.com/contact)
- [Discord Web3Forms](https://discord.gg/web3forms)
