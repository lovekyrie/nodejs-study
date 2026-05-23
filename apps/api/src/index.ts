import { loadConfig } from '@nodejs-study/config'
import { buildApp } from './server'

const config = loadConfig()
const app = await buildApp({ config, logger: true })

const close = async (signal: NodeJS.Signals) => {
  app.log.info({ signal }, 'shutting down api')
  await app.close()
}

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    close(signal)
      .then(() => process.exit(0))
      .catch((error: unknown) => {
        app.log.error({ error }, 'failed to shut down api')
        process.exit(1)
      })
  })
}

await app.listen({ host: config.host, port: config.port })
