import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;

  if (connectionString && connectionString.includes('neon.tech')) {
    if (typeof WebSocket === 'undefined') {
      neonConfig.webSocketConstructor = ws;
    }
    const pool = new Pool({ connectionString });
    const adapter = new PrismaNeon(pool);
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
