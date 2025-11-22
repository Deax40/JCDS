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

// Singleton pattern pour éviter de multiplier les connexions lors du rechargement à chaud en dev
let pool;

if (process.env.NODE_ENV === 'production') {
  pool = createPool();
} else {
  if (!global.postgresPool) {
    global.postgresPool = createPool();
  }
  pool = global.postgresPool;
}

function createPool() {
  // Vérifier que DATABASE_URL est définie
  if (!process.env.DATABASE_URL) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('⚠️ DATABASE_URL manquante. Les requêtes DB échoueront.');
    }
  }

  const connectionString = process.env.DATABASE_URL || '';

  // Vérifier que le mot de passe a été remplacé (seulement si la string existe)
  if (connectionString.includes('[YOUR-PASSWORD]')) {
    console.error('❌ DATABASE_URL contient encore [YOUR-PASSWORD]');
  }

  // Détermine si SSL est nécessaire
  // Supabase et Vercel Postgres nécessitent généralement SSL avec rejectUnauthorized: false
  const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

  const sslConfig = isLocalhost
    ? false
    : { rejectUnauthorized: false };

  const newPool = new Pool({
    connectionString: connectionString,
    ssl: sslConfig,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  // Log de connexion réussie (optionnel, mais utile en dev)
  newPool.on('connect', () => {
    if (process.env.NODE_ENV !== 'production') {
      // console.log('✅ Connexion PostgreSQL établie');
    }
  });

  // IMPORTANT: Gestion des erreurs sur le pool pour éviter les crashs inattendus
  newPool.on('error', (err) => {
    console.error('❌ Erreur de connexion PostgreSQL (Pool):', err.message);
    // On ne throw pas ici pour ne pas crasher le process
  });

  return newPool;
}

/**
 * Obtenir une connexion au pool de base de données
 */
export function getPool() {
  if (!pool) {
     // Fallback de sécurité
     if (process.env.NODE_ENV !== 'production' && global.postgresPool) {
        pool = global.postgresPool;
     } else {
        pool = createPool();
     }
  }

  if (!process.env.DATABASE_URL) {
     throw new Error(
        '❌ DATABASE_URL n\'est pas définie dans le fichier .env\n' +
        '📝 Consultez SETUP_DATABASE.md pour configurer votre base de données Supabase'
      );
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

    if (process.env.NODE_ENV !== 'production') {
      // console.log('Executed query', { text, duration, rows: res.rowCount });
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
