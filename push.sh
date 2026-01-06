#!/bin/bash

# Script de push rapide pour JCDS
# Usage: ./push.sh "votre message de commit"

# Couleurs pour les messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Push rapide JCDS${NC}"
echo ""

# Vérifier si un message a été fourni
if [ -z "$1" ]; then
    MESSAGE="Update: modifications automatiques"
else
    MESSAGE="$1"
fi

# Ajouter tous les fichiers
echo -e "${BLUE}📦 Ajout des fichiers...${NC}"
git add .

# Créer le commit
echo -e "${BLUE}💾 Création du commit...${NC}"
git commit -m "$MESSAGE

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>" || {
    echo -e "${RED}❌ Aucun changement à commiter${NC}"
    exit 0
}

# Push avec force (attention : écrase l'historique distant)
echo -e "${BLUE}⬆️  Push vers GitHub...${NC}"
git push -f origin main || {
    echo -e "${RED}❌ Erreur lors du push${NC}"
    echo ""
    echo -e "${BLUE}💡 Première utilisation ? Configurez vos credentials :${NC}"
    echo "   Option 1 (SSH) : git remote set-url origin git@github.com:Deax40/JCDS.git"
    echo "   Option 2 (HTTPS) : Voir INSTRUCTIONS_GIT_PUSH.md"
    exit 1
}

echo ""
echo -e "${GREEN}✅ Push réussi !${NC}"
echo -e "${GREEN}🎉 Vercel va déployer automatiquement${NC}"
echo ""
