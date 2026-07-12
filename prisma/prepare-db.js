const fs = require('fs');
const path = require('path');

// Manually parse .env if process.env.DATABASE_URL is not set
let databaseUrl = process.env.DATABASE_URL;
const envPath = path.join(process.cwd(), '.env');

if (!databaseUrl && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/^DATABASE_URL\s*=\s*["']?([^"'\r\n]+)/m);
  if (match) {
    databaseUrl = match[1];
  }
}

if (!databaseUrl) {
  databaseUrl = 'file:./dev.db';
}

const isPostgres = databaseUrl.startsWith('postgres://') || databaseUrl.startsWith('postgresql://');

const schemaPath = path.join(__dirname, 'schema.prisma');
if (fs.existsSync(schemaPath)) {
  let schemaContent = fs.readFileSync(schemaPath, 'utf8');

  // Replace the datasource provider dynamically to match the connection URL
  const currentProviderRegex = /provider\s*=\s*"[^"]*"/;
  const newProvider = isPostgres ? 'provider = "postgresql"' : 'provider = "sqlite"';

  if (currentProviderRegex.test(schemaContent)) {
    schemaContent = schemaContent.replace(currentProviderRegex, newProvider);
    fs.writeFileSync(schemaPath, schemaContent, 'utf8');
    console.log(`[DB Prepare] Dynamically set schema.prisma provider to: ${isPostgres ? 'postgresql' : 'sqlite'}`);
  } else {
    console.log('[DB Prepare] Could not find provider config in schema.prisma');
  }
} else {
  console.log('[DB Prepare] schema.prisma does not exist.');
}
