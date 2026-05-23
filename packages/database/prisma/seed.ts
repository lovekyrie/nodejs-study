import { createPrismaClient } from '../src/index'

const prisma = createPrismaClient()

async function main(): Promise<void> {
  const organization = await prisma.organization.upsert({
    where: { slug: 'acme' },
    update: {},
    create: {
      slug: 'acme',
      name: 'Acme Inc.',
    },
  })

  const ownerRole = await prisma.role.upsert({
    where: {
      organizationId_key: {
        organizationId: organization.id,
        key: 'owner',
      },
    },
    update: {},
    create: {
      organizationId: organization.id,
      key: 'owner',
      name: 'Owner',
      permissions: ['org:read', 'org:update', 'member:invite', 'project:write'],
    },
  })

  const user = await prisma.user.upsert({
    where: { email: 'owner@example.com' },
    update: {},
    create: {
      email: 'owner@example.com',
      name: 'Example Owner',
      passwordHash: 'replace-with-argon2id-hash',
    },
  })

  await prisma.membership.upsert({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId: organization.id,
      },
    },
    update: { roleId: ownerRole.id },
    create: {
      userId: user.id,
      organizationId: organization.id,
      roleId: ownerRole.id,
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (error: unknown) => {
    console.error(error)
    await prisma.$disconnect()
    process.exit(1)
  })
