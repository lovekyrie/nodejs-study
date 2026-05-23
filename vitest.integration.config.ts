import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.integration.test.ts'],
    globals: false,
    restoreMocks: true,
    clearMocks: true,
  },
})
