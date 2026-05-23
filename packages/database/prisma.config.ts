import { defineConfig } from 'prisma/config'

const databaseUrl =
  process.env.DATABASE_URL ?? 'postgresql://nodejs-study:nodejs-study@localhost:5432/nodejs_study'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: databaseUrl,
  },
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
})
