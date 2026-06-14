import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
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
