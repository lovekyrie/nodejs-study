import { EventEmitter } from 'node:events'

export interface LessonOffer {
  price: number
}

export class LessonFeed extends EventEmitter {
  private timer: NodeJS.Timeout | null = null

  constructor(
    private readonly intervalMs = 3000,
    private readonly random = Math.random,
  ) {
    super()
  }

  start(): this {
    if (this.timer) {
      return this
    }

    this.timer = setInterval(() => {
      this.emit('newlesson', this.createOffer())
    }, this.intervalMs)

    return this
  }

  stop(): this {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }

    return this
  }

  createOffer(): LessonOffer {
    return {
      price: Number((this.random() * 100).toFixed(2)),
    }
  }
}

export function shouldBuyLesson(offer: LessonOffer, maxPrice = 80): boolean {
  return offer.price < maxPrice
}
