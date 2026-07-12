import { PrismaClient } from '@prisma/client';
import path from 'path';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prismaInstance: PrismaClient;
const connectionString = process.env.DATABASE_URL || 'file:./dev.db';

// Dynamically resolve driver adapters based on the connection string URL scheme
let adapter: any;

if (connectionString.startsWith('postgres://') || connectionString.startsWith('postgresql://')) {
  // Lazy-load pg and the PrismaPg adapter for production/PostgreSQL
  const { PrismaPg } = require('@prisma/adapter-pg');
  const { Pool } = require('pg');
  
  const pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
  
  adapter = new PrismaPg(pool);
} else {
  // Lazy-load better-sqlite3 and PrismaBetterSqlite3 for local SQLite development
  const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
  
  // Resolve local SQLite path
  const dbPath = path.join(process.cwd(), 'dev.db');
  const url = 'file:' + dbPath;
  
  adapter = new PrismaBetterSqlite3({ url });
}

if (process.env.NODE_ENV === 'production') {
  prismaInstance = new PrismaClient({ adapter });
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      adapter,
      log: ['error', 'warn'],
    });
  }
  prismaInstance = globalForPrisma.prisma;
}

export const prisma = prismaInstance;
