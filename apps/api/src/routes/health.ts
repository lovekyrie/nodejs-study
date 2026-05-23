import type { AppConfig } from '@nodejs-study/config'
import { ok } from '@nodejs-study/contracts'
import type { FastifyPluginAsync } from 'fastify'

interface HealthRoutesOptions {
  config: AppConfig
}

export const healthRoutes: FastifyPluginAsync<HealthRoutesOptions> = async (app, options) => {
  app.get(
    '/health',
    {
      schema: {
        tags: ['system'],
        response: {
          200: {
            type: 'object',
            required: ['data', 'requestId'],
            properties: {
              data: {
                type: 'object',
                required: ['status'],
                properties: {
                  status: { type: 'string', enum: ['ok'] },
                },
              },
              requestId: { type: 'string' },
            },
          },
        },
      },
    },
    async (request) => ok({ status: 'ok' as const }, request.id),
  )

  app.get('/ready', async (request) =>
    ok(
      {
        status: 'ready' as const,
        env: options.config.env,
        dependencies: {
          database: 'not_checked' as const,
          redis: 'not_checked' as const,
        },
      },
      request.id,
    ),
  )
}
