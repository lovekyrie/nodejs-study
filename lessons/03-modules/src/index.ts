import { fileURLToPath } from 'node:url'
import { add, subtract } from './math'
import { incrementModuleCounter } from './cache'

export function describeModuleDemo(): string {
  const addition = add(3, 2)
  const subtraction = subtract(3, 2)
  const firstCall = incrementModuleCounter()
  const secondCall = incrementModuleCounter()

  return [
    `ESM add: ${addition.left} + ${addition.right} = ${addition.result}`,
    `ESM subtract: ${subtraction.left} - ${subtraction.right} = ${subtraction.result}`,
    `Module cache counter: ${firstCall} -> ${secondCall}`,
    'CommonJS example: lessons/03-modules/src/commonjs-demo.cjs',
  ].join('\n')
}

export function isDirectRun(metaUrl: string, argv = process.argv): boolean {
  return argv[1] === fileURLToPath(metaUrl)
}

export function main(): void {
  console.log(describeModuleDemo())
}

if (isDirectRun(import.meta.url)) {
  main()
}
