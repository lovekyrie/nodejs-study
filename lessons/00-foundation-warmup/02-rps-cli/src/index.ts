import { fileURLToPath } from 'node:url'
import { formatRound, parseAction, playRound } from './game'

export function getUsage(): string {
  return 'Usage: pnpm lesson:02 <rock|paper|scissor>'
}

export function normalizeCliArgs(args: string[]): string[] {
  return args.filter((arg) => arg !== '--')
}

export function runRoundFromInput(input: string): string {
  const action = parseAction(input)

  if (!action) {
    throw new Error(getUsage())
  }

  return formatRound(playRound(action))
}

export function isDirectRun(metaUrl: string, argv = process.argv): boolean {
  return argv[1] === fileURLToPath(metaUrl)
}

export function main(argv = process.argv.slice(2)): void {
  const [input] = normalizeCliArgs(argv)

  if (!input) {
    console.error(getUsage())
    process.exitCode = 1
    return
  }

  try {
    console.log(runRoundFromInput(input))
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}

if (isDirectRun(import.meta.url)) {
  main()
}
