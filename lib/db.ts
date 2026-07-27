import { Surreal, Table } from 'surrealdb';

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
  // On serverless, WebSocket connections die between invocations.
  // Force reconnect if last connection was > 60 seconds ago.
  const SERVERLESS_RECONNECT = 60 * 1000;
  const shouldRelogin = isConnected && (now - lastLogin > LOGIN_TIMEOUT);
  const shouldReconnect = isConnected && (now - lastLogin > SERVERLESS_RECONNECT);

  // If there is an ongoing connection attempt, reuse it
  if (globalThis.surrealConnectionPromise) {
    if (!shouldRelogin && !shouldReconnect) {
      return globalThis.surrealConnectionPromise;
    }
  }

  if (!isConnected || shouldRelogin || shouldReconnect) {
    connectionPromise = (async () => {
      try {
        if (shouldReconnect) {
          console.log('🔄 Serverless: reconnecting SurrealDB (WebSocket may be stale)...');
          try { await db.close(); } catch {}
          db = new Surreal();
          globalThis.surreal = db;
          await db.connect(process.env.SURREALDB_URL!);
        } else if (shouldRelogin) {
          console.log('🔄 Refreshing SurrealDB connection token...');
        } else {
          await db.connect(process.env.SURREALDB_URL!);
        }

        await db.signin({
          username: process.env.SURREALDB_USER!,
          password: process.env.SURREALDB_PASS!,
        });

        await db.use({
          namespace: process.env.SURREALDB_NAMESPACE!,
          database: process.env.SURREALDB_DATABASE!,
        });

        globalThis.surrealConnected = true;
        globalThis.surrealLastLogin = Date.now();

        console.log('✅ SurrealDB connected successfully');
        return db;
      } catch (error) {
        console.error('❌ SurrealDB connection error:', error);
        globalThis.surrealConnected = false;
        globalThis.surrealLastLogin = 0;
        globalThis.surrealConnectionPromise = undefined;
        throw error;
      }
    })();

    globalThis.surrealConnectionPromise = connectionPromise;
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

export async function createRecord(table: string, data: Record<string, any>) {
  const client = await getDB();
  return client.insert(new Table(table), data);
}
