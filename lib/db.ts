import Surreal from 'surrealdb';

declare global {
  var surreal: Surreal | undefined;
  var surrealConnected: boolean | undefined;
  var surrealLastLogin: number | undefined;
  var surrealConnectionPromise: Promise<Surreal> | undefined;
}

let db: Surreal;
let connectionPromise: Promise<Surreal> | undefined = globalThis.surrealConnectionPromise;

if (globalThis.surreal) {
  db = globalThis.surreal;
} else {
  db = new Surreal();
  if (process.env.NODE_ENV !== 'production') {
    globalThis.surreal = db;
  }
}

export async function getDB(): Promise<Surreal> {
  const now = Date.now();
  const lastLogin = globalThis.surrealLastLogin || 0;
  const isConnected = globalThis.surrealConnected || false;

  // Refresh token every 50 minutes to prevent "The token has expired" error
  const LOGIN_TIMEOUT = 50 * 60 * 1000;
  const shouldRelogin = isConnected && (now - lastLogin > LOGIN_TIMEOUT);

  // If there is an ongoing connection attempt, reuse it
  if (globalThis.surrealConnectionPromise) {
    if (!shouldRelogin) {
      return globalThis.surrealConnectionPromise;
    }
    // If relogin needed, we will overwrite the promise below
  }

  if (!isConnected || shouldRelogin) {
    connectionPromise = (async () => {
      try {
        if (shouldRelogin) {
          console.log('🔄 Refreshing SurrealDB connection token...');
        }

        if (!isConnected) {
          await db.connect(process.env.SURREALDB_URL!);
        }

        // Always signin to refresh/ensure token
        await db.signin({
          username: process.env.SURREALDB_USER!,
          password: process.env.SURREALDB_PASS!,
        });

        // Select namespace and database
        await db.use({
          namespace: process.env.SURREALDB_NAMESPACE!,
          database: process.env.SURREALDB_DATABASE!,
        });

        if (process.env.NODE_ENV !== 'production') {
          globalThis.surrealConnected = true;
          globalThis.surrealLastLogin = Date.now();
        }

        return db;
      } catch (error) {
        console.error('❌ SurrealDB connection error:', error);
        if (process.env.NODE_ENV !== 'production') {
          globalThis.surrealConnected = false;
          globalThis.surrealLastLogin = 0;
          globalThis.surrealConnectionPromise = undefined;
        }
        throw error;
      }
    })();

    if (process.env.NODE_ENV !== 'production') {
      globalThis.surrealConnectionPromise = connectionPromise;
    }
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  return db;
}

export async function closeDB() {
  await db.close();
  if (process.env.NODE_ENV !== 'production') {
    globalThis.surrealConnected = false;
    globalThis.surrealLastLogin = 0;
    globalThis.surrealConnectionPromise = undefined;
  }
}
