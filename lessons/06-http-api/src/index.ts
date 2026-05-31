import { fileURLToPath } from 'node:url'
import { buildNotesApp } from './app'

export async function main(): Promise<void> {
  const app = await buildNotesApp({ logger: true })
  const port = Number(process.env.PORT ?? 3001)

  await app.listen({ host: '127.0.0.1', port })
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main()
}
