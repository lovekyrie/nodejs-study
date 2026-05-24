import { fileURLToPath } from 'node:url'

export interface RuntimeInfo {
  nodeVersion: string
  platform: NodeJS.Platform
  cwd: string
  mode: string
  args: string[],
  port: number
}

export function normalizeCliArgs(args: string[]): string[] {
  return args.filter((arg) => arg !== '--')
}

export function collectRuntimeInfo(
  // 命令行参数 1 是 node 存放的位置，2 是文件路径，3开始 是执行命令时传进去的参数
  args = normalizeCliArgs(process.argv.slice(2)),
  env: NodeJS.ProcessEnv = process.env,
): RuntimeInfo {
  return {
    nodeVersion: process.version,
    platform: process.platform,
    cwd: process.cwd(), // 当前工作目录
    mode: env.NODE_ENV ?? 'development', // 环境变量
    args: normalizeCliArgs(args), // 命令行参数 
    port: Number(env.PORT) ?? 3000,
  }
}

export function formatRuntimeInfo(info: RuntimeInfo): string {
  const args = info.args.length > 0 ? info.args.join(' ') : '(none)'

  return [
    `Node: ${info.nodeVersion}`,
    `Platform: ${info.platform}`,
    `Mode: ${info.mode}`,
    `CWD: ${info.cwd}`,
    `Args: ${args}`,
    `Port: ${info.port}`,
  ].join('\n')
}

export function isDirectRun(metaUrl: string, argv = process.argv): boolean {
  return argv[1] === fileURLToPath(metaUrl)
}

export function main(): void {
  console.log(formatRuntimeInfo(collectRuntimeInfo()))
}

if (isDirectRun(import.meta.url)) {
  main()
}
