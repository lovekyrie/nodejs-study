export interface RedisConnectionOptions {
  host: string
  port: number
  username?: string
  password?: string
  db?: number
}

export function redisConnectionFromUrl(redisUrl: string): RedisConnectionOptions {
  const url = new URL(redisUrl)
  const db = url.pathname === '' ? undefined : Number(url.pathname.slice(1))

  return {
    host: url.hostname,
    port: Number(url.port || 6379),
    username: url.username || undefined,
    password: url.password || undefined,
    db: Number.isFinite(db) ? db : undefined,
  }
}
