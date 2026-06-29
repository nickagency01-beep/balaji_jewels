import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient;
  prismaUrl: string;
};

const currentUrl = process.env.DATABASE_URL ?? "";

if (globalForPrisma.prisma && globalForPrisma.prismaUrl !== currentUrl) {
  globalForPrisma.prisma.$disconnect();
  globalForPrisma.prisma = undefined as unknown as PrismaClient;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
    datasources: { db: { url: currentUrl } },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaUrl = currentUrl;
}
