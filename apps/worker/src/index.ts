import { loadConfig } from '@nodejs-study/config'
import { createInvitationEmailWorker } from './worker'

const config = loadConfig()
const worker = createInvitationEmailWorker(config)

const close = async (signal: NodeJS.Signals) => {
  console.info({ signal }, 'shutting down worker')
  await worker.close()
}

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    close(signal)
      .then(() => process.exit(0))
      .catch((error: unknown) => {
        console.error({ error }, 'failed to shut down worker')
        process.exit(1)
      })
  })
}
