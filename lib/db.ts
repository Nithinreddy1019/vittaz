// lib/db.ts
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

declare global {
  var prisma: PrismaClient
}

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(withAccelerate())
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export const db = prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma