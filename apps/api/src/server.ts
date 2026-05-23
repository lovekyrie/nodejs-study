import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'
import { loadConfig, type AppConfig } from '@nodejs-study/config'
import { errorCodes, fail } from '@nodejs-study/contracts'
import Fastify, { type FastifyError, type FastifyInstance } from 'fastify'
import { randomUUID } from 'node:crypto'
import { healthRoutes } from './routes/health'

export interface BuildAppOptions {
  config?: AppConfig
  logger?: boolean
}

export async function buildApp(options: BuildAppOptions = {}): Promise<FastifyInstance> {
  const config = options.config ?? loadConfig()
  const app = Fastify({
    genReqId: () => randomUUID(),
    logger: options.logger ?? config.env !== 'test',
  })

  app.setErrorHandler((error: FastifyError, request, reply) => {
    const statusCode = error.statusCode ?? 500
    const isServerError = statusCode >= 500
    const code = isServerError ? errorCodes.internalError : errorCodes.validationError
    const message = isServerError ? 'Internal server error' : error.message
    const details = isServerError ? undefined : error.validation

    request.log.error({ error, code }, 'request failed')
    reply.status(statusCode).send(fail(code, message, request.id, details))
  })

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Node.js Study SaaS API',
        version: '0.1.0',
      },
    },
  })

  await app.register(swaggerUi, {
    routePrefix: '/docs',
  })

  await app.register(healthRoutes, { config })

  return app
}
