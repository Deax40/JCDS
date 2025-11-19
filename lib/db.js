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
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
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
