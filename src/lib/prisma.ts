// src/lib/prisma.ts
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../../prisma/generated/client'

const prismaClientSingleton = () => {
  // 1. Buat koneksi pool dari library native database
  const pool = new Pool({ connectionString: process.env.DATABASE_URL })
  
  // 2. Bungkus pool ke dalam adapter Prisma 7
  const adapter = new PrismaPg(pool)
  
  // 3. Masukkan adapter ke constructor
  return new PrismaClient({ adapter })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
