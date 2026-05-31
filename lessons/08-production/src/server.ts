import { randomUUID } from 'node:crypto'
import { createServer, type Server } from 'node:http'
import { performance } from 'node:perf_hooks'
import type { ServiceConfig } from './config'
import type { Logger } from './logger'

export interface RouteResponse {
  statusCode: number
  body: {
    data?: Record<string, unknown>
    error?: {
      code: string
      message: string
      requestId: string
    }
    requestId?: string
  }
}

export function createHealthServer(config: ServiceConfig, logger: Logger): Server {
  return createServer((request, response) => {
    const startedAt = performance.now()
    const requestId = readRequestId(request.headers['x-request-id'])
    const routeResponse = resolveRoute(config, request.method, request.url, requestId)

    response.once('finish', () => {
      logger.info('request completed', {
        requestId,
        method: request.method,
        url: request.url,
        statusCode: response.statusCode,
        durationMs: Number((performance.now() - startedAt).toFixed(2)),
      })
    })

    response.setHeader('content-type', 'application/json; charset=utf-8')
    response.setHeader('x-request-id', requestId)
    response.statusCode = routeResponse.statusCode
    response.end(JSON.stringify(routeResponse.body))
  })
}

export function resolveRoute(
  config: ServiceConfig,
  method: string | undefined,
  url: string | undefined,
  requestId: string,
): RouteResponse {
  if (method === 'GET' && url === '/health') {
    return {
      statusCode: 200,
      body: { data: { status: 'ok' }, requestId },
    }
  }

  if (method === 'GET' && url === '/ready') {
    return {
      statusCode: 200,
      body: {
        data: {
          status: 'ready',
          environment: config.environment,
        },
        requestId,
      },
    }
  }

  return {
    statusCode: 404,
    body: {
      error: {
        code: 'NOT_FOUND',
        message: 'Route not found',
        requestId,
      },
    },
  }
}

export function closeServer(server: Server, timeoutMs = 10_000): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      server.closeAllConnections()
      reject(new Error('Server shutdown timed out'))
    }, timeoutMs)
    timeout.unref()

    server.close((error) => {
      clearTimeout(timeout)

      if (error !== undefined) {
        reject(error)
        return
      }

      resolve()
    })
  })
}

function readRequestId(header: string | string[] | undefined): string {
  if (Array.isArray(header)) {
    return header[0] ?? randomUUID()
  }

  return header ?? randomUUID()
}
