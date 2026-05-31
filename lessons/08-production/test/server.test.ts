import { describe, expect, it } from 'vitest'
import type { ServiceConfig } from '../src/config'
import { createLogger } from '../src/logger'
import { resolveRoute } from '../src/server'

const config: ServiceConfig = {
  environment: 'test',
  serviceName: 'lesson-08-test',
  host: '127.0.0.1',
  port: 3002,
  shutdownTimeoutMs: 1_000,
}

describe('production health service', () => {
  it('reports health with a request id', () => {
    expect(resolveRoute(config, 'GET', '/health', 'req_lesson_08')).toEqual({
      statusCode: 200,
      body: {
        data: { status: 'ok' },
        requestId: 'req_lesson_08',
      },
    })
  })

  it('returns readiness and not found responses', () => {
    expect(resolveRoute(config, 'GET', '/ready', 'req_ready')).toEqual({
      statusCode: 200,
      body: {
        data: { status: 'ready', environment: 'test' },
        requestId: 'req_ready',
      },
    })

    expect(resolveRoute(config, 'GET', '/missing', 'req_missing')).toEqual({
      statusCode: 404,
      body: {
        error: {
          code: 'NOT_FOUND',
          message: 'Route not found',
          requestId: 'req_missing',
        },
      },
    })
  })

  it('writes JSON structured logs', () => {
    const lines: string[] = []
    const logger = createLogger(config.serviceName, (line) => lines.push(line), () => new Date(0))

    logger.info('request completed', {
      requestId: 'req_lesson_08',
      statusCode: 200,
    })

    expect(JSON.parse(lines[0] ?? '{}')).toEqual({
      timestamp: '1970-01-01T00:00:00.000Z',
      level: 'info',
      service: 'lesson-08-test',
      message: 'request completed',
      requestId: 'req_lesson_08',
      statusCode: 200,
    })
  })
})
