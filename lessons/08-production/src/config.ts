export type RuntimeEnvironment = 'development' | 'test' | 'production'

export interface ServiceConfig {
  environment: RuntimeEnvironment
  serviceName: string
  host: string
  port: number
  shutdownTimeoutMs: number
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ConfigError'
  }
}

export function loadServiceConfig(env: NodeJS.ProcessEnv = process.env): ServiceConfig {
  return {
    environment: readEnvironment(env.NODE_ENV),
    serviceName: env.SERVICE_NAME ?? 'lesson-08-production',
    host: env.HOST ?? '127.0.0.1',
    port: readPositiveInteger(env.PORT, 3002, 'PORT'),
    shutdownTimeoutMs: readPositiveInteger(env.SHUTDOWN_TIMEOUT_MS, 10_000, 'SHUTDOWN_TIMEOUT_MS'),
  }
}

function readEnvironment(value: string | undefined): RuntimeEnvironment {
  if (value === undefined) {
    return 'development'
  }

  if (value === 'development' || value === 'test' || value === 'production') {
    return value
  }

  throw new ConfigError('NODE_ENV must be development, test, or production')
}

function readPositiveInteger(value: string | undefined, fallback: number, name: string): number {
  if (value === undefined) {
    return fallback
  }

  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ConfigError(`${name} must be a positive integer`)
  }

  return parsed
}
