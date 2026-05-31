import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { JsonNoteRepository } from './note-repository'

export async function main(args = process.argv.slice(2)): Promise<void> {
  const repository = new JsonNoteRepository(resolve('.data/lesson-07-notes.json'))
  const [command, title, ...contentParts] = args

  if (command === 'add' && title !== undefined) {
    const note = await repository.create({
      title,
      content: contentParts.join(' '),
    })

    console.log(`Created ${note.id}: ${note.title}`)
    return
  }

  if (command === 'list') {
    const notes = await repository.list()

    for (const note of notes) {
      console.log(`${note.id}\t${note.title}`)
    }

    return
  }

  console.error('Usage: pnpm lesson:07 add <title> [content] | pnpm lesson:07 list')
  process.exitCode = 1
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main()
}
