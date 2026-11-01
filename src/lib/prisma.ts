import { PrismaClient } from '@prisma/client';
import { PrismaNeonHTTP } from '@prisma/adapter-neon';

const FALLBACK_NEON_URL = 'postgresql://neondb_owner:npg_ay7TAzBC6vwr@ep-blue-mountain-anfdzi6q-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require';

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '') {
    return process.env.DATABASE_URL;
  }
  try {
    const { getCloudflareContext } = require('@opennextjs/cloudflare');
    const ctx = getCloudflareContext();
    if (ctx?.env?.DATABASE_URL) {
      return ctx.env.DATABASE_URL;
    }
  } catch {
    // Outside of Cloudflare request context
  }
  return FALLBACK_NEON_URL;
}

const prismaClientSingleton = () => {
  const connectionString = getDatabaseUrl();

  if (connectionString && connectionString.includes('neon.tech')) {
    // Remove channel_binding parameter if present as HTTP endpoint does not use it
    const cleanUrl = connectionString.replace(/&?channel_binding=[^&]*/g, '');
    const adapter = new PrismaNeonHTTP(cleanUrl);
    return new PrismaClient({ adapter });
  }

  return new PrismaClient();
};

// Global type safe declaration
declare const globalThis: {
  prisma: ReturnType<typeof prismaClientSingleton> | undefined;
} & typeof global;

// Yahan variable ka naam 'prismaClient' rakha hai taaki naam ka koi clash na ho
const prismaClient = globalThis.prisma ?? prismaClientSingleton();

export default prismaClient;

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prismaClient;
