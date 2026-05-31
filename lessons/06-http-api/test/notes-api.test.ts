import type { FastifyInstance } from 'fastify'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { buildNotesApp } from '../src/app'
import { NotesStore } from '../src/notes'

let app: FastifyInstance

describe('notes api', () => {
  beforeEach(async () => {
    const store = new NotesStore(() => 'note_1', () => new Date('2026-05-24T00:00:00.000Z'))
    app = await buildNotesApp({ store })
  })

  afterEach(async () => {
    await app.close()
  })

  it('creates and lists notes', async () => {
    const createResponse = await app.inject({
      method: 'POST',
      url: '/notes',
      payload: {
        title: 'Learn Fastify',
        content: 'Use schemas and injection tests.',
      },
    })

    expect(createResponse.statusCode).toBe(201)
    expect(createResponse.json()).toEqual({
      data: {
        id: 'note_1',
        title: 'Learn Fastify',
        content: 'Use schemas and injection tests.',
        createdAt: '2026-05-24T00:00:00.000Z',
      },
    })

    const listResponse = await app.inject({ method: 'GET', url: '/notes' })
    expect(listResponse.json().data).toHaveLength(1)
  })

  it('validates create input', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/notes',
      payload: { content: 'missing title' },
    })

    expect(response.statusCode).toBe(400)
    expect(response.json()).toMatchObject({
      error: { code: 'VALIDATION_ERROR' },
    })
  })

  it('returns a stable not found response', async () => {
    const response = await app.inject({ method: 'GET', url: '/notes/missing' })

    expect(response.statusCode).toBe(404)
    expect(response.json()).toEqual({
      error: {
        code: 'NOTE_NOT_FOUND',
        message: 'Note not found',
      },
    })
  })
})
