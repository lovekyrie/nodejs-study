import { fileURLToPath } from 'node:url'
import { loadServiceConfig } from './config'
import { createLogger } from './logger'
import { closeServer, createHealthServer } from './server'

export async function main(): Promise<void> {
  const config = loadServiceConfig()
  const logger = createLogger(config.serviceName)
  const server = createHealthServer(config, logger)

  server.listen(config.port, config.host, () => {
    logger.info('server started', {
      host: config.host,
      port: config.port,
      environment: config.environment,
    })
  })

  for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    process.once(signal, () => {
      logger.info('shutdown started', { signal })

      closeServer(server, config.shutdownTimeoutMs)
        .then(() => process.exit(0))
        .catch((error: unknown) => {
          logger.error('shutdown failed', { signal, error: String(error) })
          process.exit(1)
        })
    })
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main()
}
