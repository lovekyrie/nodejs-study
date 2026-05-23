import { describe, expect, it } from 'vitest'
import { ConfigError, loadConfig } from '../src/env'

describe('loadConfig', () => {
  it('loads local defaults for development', () => {
    expect(loadConfig({})).toMatchObject({
      env: 'development',
      port: 3000,
      databaseUrl: 'postgresql://nodejs-study:nodejs-study@localhost:5432/nodejs_study',
      redisUrl: 'redis://localhost:6379/0',
    })
  })

  it('rejects invalid ports', () => {
    expect(() => loadConfig({ PORT: 'abc' })).toThrow(ConfigError)
  })

  it('requires explicit secrets in production', () => {
    expect(() => loadConfig({ NODE_ENV: 'production' })).toThrow(ConfigError)
  })
})
