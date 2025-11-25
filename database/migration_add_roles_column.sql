-- Migration: Ajout de la colonne roles (tableau de rôles)
-- À exécuter sur votre base de données Supabase/PostgreSQL
-- Date: 2025-11-25

-- Vérifier si la colonne existe déjà, sinon l'ajouter
DO $$
BEGIN
    -- Ajouter la colonne roles si elle n'existe pas
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'roles'
    ) THEN
        -- Ajouter la colonne roles comme tableau de texte
        ALTER TABLE users ADD COLUMN roles TEXT[] DEFAULT ARRAY['acheteur'];

        RAISE NOTICE 'Colonne roles ajoutée avec succès';
    ELSE
        RAISE NOTICE 'La colonne roles existe déjà';
    END IF;

    -- Si une ancienne colonne 'role' (singulier) existe, migrer les données
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
        AND column_name = 'role'
    ) THEN
        -- Copier les données de 'role' vers 'roles'
        UPDATE users
        SET roles = ARRAY[role]
        WHERE role IS NOT NULL AND (roles IS NULL OR array_length(roles, 1) IS NULL);

        RAISE NOTICE 'Migration des données de role vers roles effectuée';

        -- Optionnel: Supprimer l'ancienne colonne 'role' (décommenter si nécessaire)
        -- ALTER TABLE users DROP COLUMN IF EXISTS role;
    END IF;
END $$;

-- Créer un index pour améliorer les performances des recherches par rôle
CREATE INDEX IF NOT EXISTS idx_users_roles ON users USING GIN(roles);

-- Mettre à jour les utilisateurs existants qui n'ont pas de rôles
UPDATE users
SET roles = ARRAY['acheteur']
WHERE roles IS NULL OR array_length(roles, 1) IS NULL;

-- Commentaires pour documentation
COMMENT ON COLUMN users.roles IS 'Tableau de rôles de l''utilisateur (acheteur, formateur, admin). Un utilisateur peut avoir plusieurs rôles.';

-- Afficher un message de succès
DO $$
BEGIN
    RAISE NOTICE '✅ Migration terminée avec succès!';
    RAISE NOTICE 'La colonne roles a été ajoutée/vérifiée dans la table users';
    RAISE NOTICE 'Valeurs possibles: acheteur, formateur, admin';
END $$;
