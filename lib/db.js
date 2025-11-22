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
    // Vérifier que DATABASE_URL est définie
    if (!process.env.DATABASE_URL) {
      throw new Error(
        '❌ DATABASE_URL n\'est pas définie dans le fichier .env\n' +
        '📝 Consultez SETUP_DATABASE.md pour configurer votre base de données Supabase'
      );
    }

    // Vérifier que le mot de passe a été remplacé
    if (process.env.DATABASE_URL.includes('[YOUR-PASSWORD]')) {
      throw new Error(
        '❌ DATABASE_URL contient encore [YOUR-PASSWORD]\n' +
        '🔑 Remplacez [YOUR-PASSWORD] par votre vrai mot de passe Supabase\n' +
        '📝 Consultez SETUP_DATABASE.md pour les instructions'
      );
    }

    // Configuration SSL pour Supabase (production et développement)
    const isProduction = process.env.NODE_ENV === 'production';
    const sslConfig = process.env.DATABASE_URL.includes('supabase.co')
      ? { rejectUnauthorized: false }
      : false;

    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
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
      if (err.code === 'XX000' || err.message?.includes('Tenant or user not found')) {
        console.error('💡 Conseil : Votre projet Supabase est peut-être en pause ou l\'URL de connexion est incorrecte.');
      }
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
