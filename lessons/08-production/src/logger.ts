export type LogContext = Record<string, unknown>

export interface Logger {
  info(message: string, context?: LogContext): void
  error(message: string, context?: LogContext): void
}

export function createLogger(
  serviceName: string,
  write: (line: string) => void = console.log,
  now: () => Date = () => new Date(),
): Logger {
  const log = (level: 'info' | 'error', message: string, context: LogContext = {}) => {
    write(
      JSON.stringify({
        timestamp: now().toISOString(),
        level,
        service: serviceName,
        message,
        ...context,
      }),
    )
  }

  return {
    info: (message, context) => log('info', message, context),
    error: (message, context) => log('error', message, context),
  }
}
