import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/prisma/client'

const defaultDatabaseUrl =
  'postgresql://nodejs-study:nodejs-study@localhost:5432/nodejs_study'

export const databasePackage = {
  prismaSchemaPath: 'packages/database/prisma/schema.prisma',
} as const

export function createPrismaClient(databaseUrl = process.env.DATABASE_URL ?? defaultDatabaseUrl) {
  const adapter = new PrismaPg({ connectionString: databaseUrl })

  return new PrismaClient({ adapter })
}

export type { PrismaClient }
