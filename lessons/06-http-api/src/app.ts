import Fastify, { type FastifyError, type FastifyInstance, type FastifyPluginAsync } from 'fastify'
import { NotesStore, type CreateNoteInput } from './notes'

interface NotesRoutesOptions {
  store: NotesStore
}

export interface BuildNotesAppOptions {
  store?: NotesStore
  logger?: boolean
}

const notesRoutes: FastifyPluginAsync<NotesRoutesOptions> = async (app, options) => {
  app.get('/notes', async () => ({
    data: options.store.list(),
  }))

  app.get<{ Params: { noteId: string } }>('/notes/:noteId', async (request, reply) => {
    const note = options.store.findById(request.params.noteId)

    if (note === undefined) {
      return reply.status(404).send({
        error: {
          code: 'NOTE_NOT_FOUND',
          message: 'Note not found',
        },
      })
    }

    return { data: note }
  })

  app.post<{ Body: CreateNoteInput }>(
    '/notes',
    {
      schema: {
        body: {
          type: 'object',
          required: ['title'],
          additionalProperties: false,
          properties: {
            title: { type: 'string', minLength: 1, maxLength: 100 },
            content: { type: 'string', maxLength: 2000 },
          },
        },
      },
    },
    async (request, reply) => {
      const note = options.store.create(request.body)

      return reply.status(201).send({ data: note })
    },
  )
}

export async function buildNotesApp(options: BuildNotesAppOptions = {}): Promise<FastifyInstance> {
  const app = Fastify({ logger: options.logger ?? false })

  app.setErrorHandler((error: FastifyError, _request, reply) => {
    if (error.validation !== undefined) {
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message,
        },
      })
    }

    return reply.status(error.statusCode ?? 500).send({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    })
  })

  await app.register(notesRoutes, {
    store: options.store ?? new NotesStore(),
  })

  return app
}
