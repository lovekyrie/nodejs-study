export type AppEnv = 'development' | 'test' | 'production'

export interface AppConfig {
  env: AppEnv
  host: string
  port: number
  databaseUrl: string
  redisUrl: string
  accessTokenSecret: string
  refreshTokenSecret: string
  logLevel: string
  shutdownGraceMs: number
}

export class ConfigError extends Error {
  constructor(readonly issues: string[]) {
    super(`Invalid configuration: ${issues.join('; ')}`)
    this.name = 'ConfigError'
  }
}

const appEnvs = new Set<AppEnv>(['development', 'test', 'production'])

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const issues: string[] = []
  const appEnv = readAppEnv(env.NODE_ENV, issues)

  const config: AppConfig = {
    env: appEnv,
    host: env.HOST ?? '0.0.0.0',
    port: readInteger(env.PORT, 'PORT', 3000, issues),
    databaseUrl:
      env.DATABASE_URL ?? 'postgresql://nodejs-study:nodejs-study@localhost:5432/nodejs_study',
    redisUrl: env.REDIS_URL ?? 'redis://localhost:6379/0',
    accessTokenSecret: readSecret(env.ACCESS_TOKEN_SECRET, 'ACCESS_TOKEN_SECRET', appEnv, issues),
    refreshTokenSecret: readSecret(
      env.REFRESH_TOKEN_SECRET,
      'REFRESH_TOKEN_SECRET',
      appEnv,
      issues,
    ),
    logLevel: env.LOG_LEVEL ?? (appEnv === 'production' ? 'info' : 'debug'),
    shutdownGraceMs: readInteger(env.SHUTDOWN_GRACE_MS, 'SHUTDOWN_GRACE_MS', 10_000, issues),
  }

  if (issues.length > 0) {
    throw new ConfigError(issues)
  }

  return config
}

function readAppEnv(value: string | undefined, issues: string[]): AppEnv {
  if (value === undefined) {
    return 'development'
  }

  if (appEnvs.has(value as AppEnv)) {
    return value as AppEnv
  }

  issues.push('NODE_ENV must be one of development, test, production')
  return 'development'
}

function readInteger(
  value: string | undefined,
  key: string,
  fallback: number,
  issues: string[],
): number {
  if (value === undefined || value === '') {
    return fallback
  }

  const parsed = Number(value)
  if (Number.isInteger(parsed) && parsed > 0) {
    return parsed
  }

  issues.push(`${key} must be a positive integer`)
  return fallback
}

function readSecret(
  value: string | undefined,
  key: string,
  appEnv: AppEnv,
  issues: string[],
): string {
  if (value !== undefined && value.length >= 16) {
    return value
  }

  if (appEnv === 'production') {
    issues.push(`${key} must be set to at least 16 characters in production`)
  }

  return `dev-only-${key.toLowerCase()}`
}
