import { describe, expect, it, vi } from 'vitest'
import { LessonFeed, shouldBuyLesson } from '../src/lesson-feed'

describe('lesson feed', () => {
  it('creates deterministic offers when random is injected', () => {
    const feed = new LessonFeed(1000, () => 0.42)

    expect(feed.createOffer()).toEqual({ price: 42 })
  })

  it('decides whether a lesson should be bought by price', () => {
    expect(shouldBuyLesson({ price: 79.99 })).toBe(true)
    expect(shouldBuyLesson({ price: 80 })).toBe(false)
  })

  it('emits events on an interval and stops cleanly', () => {
    vi.useFakeTimers()

    const feed = new LessonFeed(1000, () => 0.5)
    const listener = vi.fn()

    feed.on('newlesson', listener)
    feed.start()

    vi.advanceTimersByTime(1000)
    expect(listener).toHaveBeenCalledWith({ price: 50 })

    feed.stop()
    vi.advanceTimersByTime(3000)
    expect(listener).toHaveBeenCalledTimes(1)

    vi.useRealTimers()
  })
})
