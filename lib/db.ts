import Surreal from 'surrealdb';

declare global {
  var surreal: Surreal | undefined;
  var surrealConnected: boolean | undefined;
}

let db: Surreal;
let isConnected = globalThis.surrealConnected || false;

if (globalThis.surreal) {
  db = globalThis.surreal;
} else {
  db = new Surreal();
  if (process.env.NODE_ENV !== 'production') {
    globalThis.surreal = db;
  }
}

export async function getDB(): Promise<Surreal> {
  try {
    if (!isConnected) {
      // Connect to SurrealDB
      await db.connect(process.env.SURREALDB_URL!);

      // Sign in with root credentials
      await db.signin({
        username: process.env.SURREALDB_USER!,
        password: process.env.SURREALDB_PASS!,
      });

      // Select namespace and database
      await db.use({
        namespace: process.env.SURREALDB_NAMESPACE!,
        database: process.env.SURREALDB_DATABASE!,
      });

      isConnected = true;
      if (process.env.NODE_ENV !== 'production') {
        globalThis.surrealConnected = true;
      }
    }

    return db;
  } catch (error) {
    console.error('❌ SurrealDB connection error:', error);
    isConnected = false;
    if (process.env.NODE_ENV !== 'production') {
      globalThis.surrealConnected = false;
    }
    throw error;
  }
}

export async function closeDB() {
  await db.close();
}
