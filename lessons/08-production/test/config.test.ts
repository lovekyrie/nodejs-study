import { describe, expect, it } from 'vitest'
import { ConfigError, loadServiceConfig } from '../src/config'

describe('service configuration', () => {
  it('returns local defaults', () => {
    expect(loadServiceConfig({})).toEqual({
      environment: 'development',
      serviceName: 'lesson-08-production',
      host: '127.0.0.1',
      port: 3002,
      shutdownTimeoutMs: 10_000,
    })
  })

  it('rejects invalid numeric settings', () => {
    expect(() => loadServiceConfig({ PORT: 'zero' })).toThrow(ConfigError)
  })

  it('accepts production settings', () => {
    expect(
      loadServiceConfig({
        NODE_ENV: 'production',
        SERVICE_NAME: 'notes-api',
        PORT: '8080',
      }),
    ).toMatchObject({
      environment: 'production',
      serviceName: 'notes-api',
      port: 8080,
    })
  })
})
