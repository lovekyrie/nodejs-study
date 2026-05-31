import { randomUUID } from 'node:crypto'

export interface Note {
  id: string
  title: string
  content: string
  createdAt: string
}

export interface CreateNoteInput {
  title: string
  content?: string
}

export class NotesStore {
  private readonly notes = new Map<string, Note>()

  constructor(
    private readonly createId: () => string = randomUUID,
    private readonly now: () => Date = () => new Date(),
  ) {}

  list(): Note[] {
    return [...this.notes.values()]
  }

  findById(noteId: string): Note | undefined {
    return this.notes.get(noteId)
  }

  create(input: CreateNoteInput): Note {
    const note: Note = {
      id: this.createId(),
      title: input.title,
      content: input.content ?? '',
      createdAt: this.now().toISOString(),
    }

    this.notes.set(note.id, note)

    return note
  }
}
