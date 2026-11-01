import { PrismaClient } from '@prisma/client';
import { PrismaNeonHTTP } from '@prisma/adapter-neon';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL;

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
