import { readdir, stat } from 'node:fs/promises'
import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { performance } from 'node:perf_hooks'

export interface ListingResult {
  files: string[]
  durationMs: number
}

export async function listFilesRecursive(rootDir: string): Promise<string[]> {
  const entries = await readdir(rootDir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = join(rootDir, entry.name)

      if (entry.isDirectory()) {
        return listFilesRecursive(fullPath)
      }

      if (entry.isFile()) {
        return [fullPath]
      }

      const entryStat = await stat(fullPath)
      return entryStat.isFile() ? [fullPath] : []
    }),
  )

  return files.flat().sort()
}

export function listFilesRecursiveSync(rootDir: string): string[] {
  return readdirSync(rootDir, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = join(rootDir, entry.name)

      if (entry.isDirectory()) {
        return listFilesRecursiveSync(fullPath)
      }

      if (entry.isFile()) {
        return [fullPath]
      }

      return statSync(fullPath).isFile() ? [fullPath] : []
    })
    .sort()
}

export async function measureAsyncListing(rootDir: string): Promise<ListingResult> {
  const start = performance.now()
  const files = await listFilesRecursive(rootDir)

  return {
    files,
    durationMs: performance.now() - start,
  }
}
