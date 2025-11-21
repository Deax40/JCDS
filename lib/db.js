/**
 * Database Connection Utility
 *
 * Gère la connexion à PostgreSQL via pg (node-postgres)
 *
 * Installation requise:
 * npm install pg
 *
 * Configuration:
 * Variable d'environnement DATABASE_URL dans .env:
 * DATABASE_URL=postgresql://user:password@host:5432/database
 */

import { Pool } from 'pg';

let pool;

/**
 * Obtenir une connexion au pool de base de données
 */
export function getPool() {
  if (!pool) {
    // Récupérer la chaîne de connexion (support pour Vercel Postgres)
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

    // Vérifier que la connexion est définie
    if (!connectionString) {
      throw new Error(
        '❌ DATABASE_URL (ou POSTGRES_URL) n\'est pas définie dans les variables d\'environnement\n' +
        '📝 Consultez SETUP_DATABASE.md pour configurer votre base de données Supabase ou vérifiez la configuration Vercel'
      );
    }

    // Vérifier que le mot de passe a été remplacé
    if (connectionString.includes('[YOUR-PASSWORD]')) {
      throw new Error(
        '❌ DATABASE_URL contient encore [YOUR-PASSWORD]\n' +
        '🔑 Remplacez [YOUR-PASSWORD] par votre vrai mot de passe Supabase\n' +
        '📝 Consultez SETUP_DATABASE.md pour les instructions'
      );
    }

    // Détecter le type de base de données
    const isSupabase = connectionString.includes('supabase.co');
    const isNeon = connectionString.includes('neon.tech') || connectionString.includes('vercel-storage.com');

    // Configuration SSL
    // Supabase et Neon nécessitent SSL.
    // rejectUnauthorized: false est utilisé pour éviter les erreurs de certificat auto-signé
    // ou de chaîne incomplète, courant dans certains environnements cloud.
    const sslConfig = (isSupabase || isNeon)
      ? { rejectUnauthorized: false }
      : false;

    pool = new Pool({
      connectionString: connectionString,
      ssl: sslConfig,
      // Options supplémentaires pour la stabilité en production
      max: 20, // Nombre maximum de connexions dans le pool
      idleTimeoutMillis: 30000, // Timeout d'inactivité
      connectionTimeoutMillis: 10000, // Timeout de connexion
    });

    // Log de connexion réussie
    pool.on('connect', () => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('✅ Connexion PostgreSQL établie');
      }
    });

    // Log des erreurs de connexion
    pool.on('error', (err) => {
      console.error('❌ Erreur de connexion PostgreSQL:', err.message);
    });
  }
  return pool;
}

/**
 * Exécuter une requête SQL
 * @param {string} text - Requête SQL
 * @param {array} params - Paramètres de la requête
 * @returns {Promise} Résultat de la requête
 */
export async function query(text, params) {
  const pool = getPool();
  const start = Date.now();

  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;

    // Log en développement
    if (process.env.NODE_ENV !== 'production') {
      console.log('Executed query', { text, duration, rows: res.rowCount });
    }

    return res;
  } catch (error) {
    console.error('Database query error:', error);

    // Amélioration du message d'erreur pour "Tenant or user not found"
    if (error.message && error.message.includes('Tenant or user not found')) {
      console.error('🚨 ERREUR CRITIQUE BASE DE DONNÉES: Le projet semble inaccessible.');
      console.error('Causes possibles:');
      console.error('1. Le projet Supabase/Neon est en pause ou supprimé.');
      console.error('2. L\'ID du projet dans DATABASE_URL est incorrect.');
      console.error('3. La région spécifiée est incorrecte.');

      // On re-lance l'erreur pour qu'elle soit gérée par l'appelant, mais on peut enrichir le message si besoin
      // Cependant, modifier le message de l'objet erreur peut être risqué, on laisse le log parler.
    }

    throw error;
  }
}

/**
 * Helper pour obtenir un client avec transaction
 */
export async function getClient() {
  const pool = getPool();
  const client = await pool.connect();
  return client;
}
