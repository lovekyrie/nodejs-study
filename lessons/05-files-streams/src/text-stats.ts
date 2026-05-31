import { createReadStream } from 'node:fs'
import { StringDecoder } from 'node:string_decoder'
import { Writable } from 'node:stream'
import { pipeline } from 'node:stream/promises'

export interface TextStats {
  bytes: number
  lines: number
  words: number
}

export function countTextStats(text: string): TextStats {
  const buffer = Buffer.from(text)
  const words = text.match(/\S+/gu)?.length ?? 0
  const lines = text.length === 0 ? 0 : (text.match(/\n/gu)?.length ?? 0) + Number(!text.endsWith('\n'))

  return {
    bytes: buffer.byteLength,
    lines,
    words,
  }
}

class TextStatsSink extends Writable {
  private readonly decoder = new StringDecoder('utf8')
  private bytes = 0
  private newlineCount = 0
  private words = 0
  private hasText = false
  private insideWord = false
  private lastCharacter = ''

  override _write(
    chunk: Buffer | string,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void,
  ): void {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, encoding)
    this.bytes += buffer.byteLength
    this.consume(this.decoder.write(buffer))
    callback()
  }

  override _final(callback: (error?: Error | null) => void): void {
    this.consume(this.decoder.end())

    if (this.insideWord) {
      this.words += 1
    }

    callback()
  }

  result(): TextStats {
    const lines = this.hasText ? this.newlineCount + Number(this.lastCharacter !== '\n') : 0

    return {
      bytes: this.bytes,
      lines,
      words: this.words,
    }
  }

  private consume(text: string): void {
    for (const character of text) {
      this.hasText = true
      this.lastCharacter = character

      if (character === '\n') {
        this.newlineCount += 1
      }

      if (/\s/u.test(character)) {
        if (this.insideWord) {
          this.words += 1
          this.insideWord = false
        }
      } else {
        this.insideWord = true
      }
    }
  }
}

export async function countFileStats(filePath: string): Promise<TextStats> {
  const sink = new TextStatsSink()

  await pipeline(createReadStream(filePath), sink)

  return sink.result()
}
