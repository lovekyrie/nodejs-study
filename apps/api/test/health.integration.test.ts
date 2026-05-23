import { describe, expect, it } from 'vitest'
import { buildApp } from '../src/server'

const testConfig = {
  env: 'test',
  host: '127.0.0.1',
  port: 0,
  databaseUrl: 'postgresql://nodejs-study:nodejs-study@localhost:5432/nodejs_study_test',
  redisUrl: 'redis://localhost:6379/1',
  accessTokenSecret: 'test-access-secret',
  refreshTokenSecret: 'test-refresh-secret',
  logLevel: 'silent',
  shutdownGraceMs: 1_000,
} as const

describe('system routes', () => {
  it('returns a health response with a request id', async () => {
    const app = await buildApp({ config: testConfig, logger: false })

    const response = await app.inject({ method: 'GET', url: '/health' })
    await app.close()

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({
      data: { status: 'ok' },
      requestId: expect.any(String),
    })
  })

  it('returns readiness shape without opening database or redis connections', async () => {
    const app = await buildApp({ config: testConfig, logger: false })

    const response = await app.inject({ method: 'GET', url: '/ready' })
    await app.close()

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject({
      data: {
        status: 'ready',
        env: 'test',
        dependencies: {
          database: 'not_checked',
          redis: 'not_checked',
        },
      },
      requestId: expect.any(String),
    })
  })
})
