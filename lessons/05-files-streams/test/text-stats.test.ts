import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { countFileStats, countTextStats } from '../src/text-stats'

let directory: string | undefined

afterEach(async () => {
  if (directory !== undefined) {
    await rm(directory, { recursive: true, force: true })
    directory = undefined
  }
})

describe('text statistics', () => {
  it('counts text in memory', () => {
    expect(countTextStats('hello node\nstream demo\n')).toEqual({
      bytes: 23,
      lines: 2,
      words: 4,
    })
  })

  it('counts an utf-8 file through a stream pipeline', async () => {
    directory = await mkdtemp(join(tmpdir(), 'lesson-05-'))
    const filePath = join(directory, 'sample.txt')
    const content = 'Node stream\nhello 世界'
    await writeFile(filePath, content, 'utf8')

    await expect(countFileStats(filePath)).resolves.toEqual({
      bytes: Buffer.byteLength(content),
      lines: 2,
      words: 4,
    })
  })
})
