import { describe, expect, it } from 'vitest'
import { buildJobId, queueNames } from '../src/queues'
import { redisConnectionFromUrl } from '../src/redis'

describe('worker queue helpers', () => {
  it('builds stable job ids for idempotent enqueueing', () => {
    expect(buildJobId(queueNames.invitationEmail, 'inv_123')).toBe('invitation-email:inv_123')
  })

  it('parses redis URLs into BullMQ connection options', () => {
    expect(redisConnectionFromUrl('redis://user:pass@localhost:6380/2')).toEqual({
      host: 'localhost',
      port: 6380,
      username: 'user',
      password: 'pass',
      db: 2,
    })
  })
})
