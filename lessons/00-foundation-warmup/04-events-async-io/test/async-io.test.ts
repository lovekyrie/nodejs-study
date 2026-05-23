import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { listFilesRecursive, listFilesRecursiveSync, measureAsyncListing } from '../src/async-io'

let rootDir: string

describe('async io helpers', () => {
  beforeEach(async () => {
    rootDir = await mkdtemp(join(tmpdir(), 'nodejs-study-'))
    await mkdir(join(rootDir, 'nested'))
    await writeFile(join(rootDir, 'a.txt'), 'a')
    await writeFile(join(rootDir, 'nested', 'b.txt'), 'b')
  })

  afterEach(async () => {
    await rm(rootDir, { recursive: true, force: true })
  })

  it('returns the same files for sync and async implementations', async () => {
    await expect(listFilesRecursive(rootDir)).resolves.toEqual(listFilesRecursiveSync(rootDir))
  })

  it('measures async listing duration', async () => {
    const result = await measureAsyncListing(rootDir)

    expect(result.files).toHaveLength(2)
    expect(result.durationMs).toBeGreaterThanOrEqual(0)
  })
})
