import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'

export interface StoredNote {
  id: string
  title: string
  content: string
  createdAt: string
}

export interface CreateStoredNoteInput {
  title: string
  content?: string
}

export interface NoteRepository {
  list(): Promise<StoredNote[]>
  findById(noteId: string): Promise<StoredNote | undefined>
  create(input: CreateStoredNoteInput): Promise<StoredNote>
}

export class JsonNoteRepository implements NoteRepository {
  constructor(
    private readonly filePath: string,
    private readonly createId: () => string = randomUUID,
    private readonly now: () => Date = () => new Date(),
  ) {}

  async list(): Promise<StoredNote[]> {
    return this.readNotes()
  }

  async findById(noteId: string): Promise<StoredNote | undefined> {
    const notes = await this.readNotes()
    return notes.find((note) => note.id === noteId)
  }

  async create(input: CreateStoredNoteInput): Promise<StoredNote> {
    const notes = await this.readNotes()
    const note: StoredNote = {
      id: this.createId(),
      title: input.title,
      content: input.content ?? '',
      createdAt: this.now().toISOString(),
    }

    await this.writeNotes([...notes, note])

    return note
  }

  private async readNotes(): Promise<StoredNote[]> {
    try {
      const content = await readFile(this.filePath, 'utf8')
      const value: unknown = JSON.parse(content)

      if (!Array.isArray(value) || !value.every(isStoredNote)) {
        throw new Error(`Invalid notes database format: ${this.filePath}`)
      }

      return value
    } catch (error: unknown) {
      if (isNodeError(error) && error.code === 'ENOENT') {
        return []
      }

      throw error
    }
  }

  private async writeNotes(notes: StoredNote[]): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true })

    const temporaryPath = `${this.filePath}.${process.pid}.tmp`
    await writeFile(temporaryPath, `${JSON.stringify(notes, null, 2)}\n`, 'utf8')
    await rename(temporaryPath, this.filePath)
  }
}

function isStoredNote(value: unknown): value is StoredNote {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const note = value as Partial<StoredNote>

  return (
    typeof note.id === 'string' &&
    typeof note.title === 'string' &&
    typeof note.content === 'string' &&
    typeof note.createdAt === 'string'
  )
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error
}
