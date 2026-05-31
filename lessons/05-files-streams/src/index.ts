import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { countFileStats } from './text-stats'

export async function main(args = process.argv.slice(2)): Promise<void> {
  const [inputPath] = args

  if (inputPath === undefined) {
    console.error('Usage: pnpm lesson:05 <text-file>')
    process.exitCode = 1
    return
  }

  const filePath = resolve(inputPath)
  const stats = await countFileStats(filePath)

  console.log(`File: ${filePath}`)
  console.log(`Bytes: ${stats.bytes}`)
  console.log(`Lines: ${stats.lines}`)
  console.log(`Words: ${stats.words}`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main()
}
