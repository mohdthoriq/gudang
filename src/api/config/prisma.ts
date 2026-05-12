import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { config } from '../utils/env.js';
import { PrismaClient } from '../../generated/index.js';

const pool = new Pool({ connectionString: config.DATABASE_URL });
const adapter = new PrismaPg(pool);

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

if (config.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;