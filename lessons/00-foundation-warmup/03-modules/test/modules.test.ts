import { beforeEach, describe, expect, it } from 'vitest'
import { getModuleCounter, incrementModuleCounter, resetModuleCounter } from '../src/cache'
import { add, subtract } from '../src/math'

describe('esm module examples', () => {
  beforeEach(() => {
    resetModuleCounter()
  })

  it('exports calculation helpers', () => {
    expect(add(1, 2)).toEqual({
      operator: 'add',
      left: 1,
      right: 2,
      result: 3,
    })

    expect(subtract(3, 2)).toEqual({
      operator: 'subtract',
      left: 3,
      right: 2,
      result: 1,
    })
  })

  it('keeps module state until explicitly reset', () => {
    expect(getModuleCounter()).toBe(0)
    expect(incrementModuleCounter()).toBe(1)
    expect(incrementModuleCounter()).toBe(2)
    expect(getModuleCounter()).toBe(2)
  })
})
