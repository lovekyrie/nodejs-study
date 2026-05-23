import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { listFilesRecursiveSync, measureAsyncListing } from './async-io'
import { LessonFeed, shouldBuyLesson } from './lesson-feed'

export async function describeAsyncDemo(rootDir: string): Promise<string> {
  const syncFiles = listFilesRecursiveSync(rootDir)
  const asyncResult = await measureAsyncListing(rootDir)

  return [
    `Sync files: ${syncFiles.length}`,
    `Async files: ${asyncResult.files.length}`,
    `Async duration: ${asyncResult.durationMs.toFixed(2)}ms`,
  ].join('\n')
}

export async function main(): Promise<void> {
  const lessonRoot = join(dirname(fileURLToPath(import.meta.url)), '..')
  const feed = new LessonFeed(1000, () => 0.5)
  const offer = feed.createOffer()

  console.log(shouldBuyLesson(offer) ? 'buy!' : 'not buy, too expensive!')
  console.log(await describeAsyncDemo(lessonRoot))
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main()
}
