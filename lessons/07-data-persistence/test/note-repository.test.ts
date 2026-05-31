import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { JsonNoteRepository } from '../src/note-repository'

let directory: string
let filePath: string

describe('JsonNoteRepository', () => {
  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'lesson-07-'))
    filePath = join(directory, 'notes.json')
  })

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true })
  })

  it('starts with an empty collection when the file is missing', async () => {
    const repository = new JsonNoteRepository(filePath)

    await expect(repository.list()).resolves.toEqual([])
  })

  it('persists created notes for a new repository instance', async () => {
    const repository = new JsonNoteRepository(
      filePath,
      () => 'note_1',
      () => new Date('2026-05-24T00:00:00.000Z'),
    )

    await repository.create({ title: 'Stored note', content: 'Saved to JSON' })

    const reloadedRepository = new JsonNoteRepository(filePath)
    await expect(reloadedRepository.findById('note_1')).resolves.toEqual({
      id: 'note_1',
      title: 'Stored note',
      content: 'Saved to JSON',
      createdAt: '2026-05-24T00:00:00.000Z',
    })
  })

  it('rejects an invalid storage file', async () => {
    await writeFile(filePath, '{"notes": []}', 'utf8')
    const repository = new JsonNoteRepository(filePath)

    await expect(repository.list()).rejects.toThrow('Invalid notes database format')
  })
})
