import { describe, expect, it } from 'vitest'
import { compareActions, formatRound, parseAction, pickComputerAction, playRound } from '../src/game'

describe('rps game', () => {
  it('parses valid actions and rejects invalid input', () => {
    expect(parseAction('rock')).toBe('rock')
    expect(parseAction(' PAPER ')).toBe('paper')
    expect(parseAction('banana')).toBeNull()
  })

  it('maps random values to computer actions', () => {
    expect(pickComputerAction(() => 0)).toBe('rock')
    expect(pickComputerAction(() => 0.4)).toBe('paper')
    expect(pickComputerAction(() => 0.8)).toBe('scissor')
  })

  it('detects win, lose, and draw outcomes', () => {
    expect(compareActions('rock', 'scissor')).toBe('win')
    expect(compareActions('rock', 'paper')).toBe('lose')
    expect(compareActions('rock', 'rock')).toBe('draw')
  })

  it('plays a deterministic round with injected randomness', () => {
    expect(playRound('paper', () => 0)).toEqual({
      humanAction: 'paper',
      computerAction: 'rock',
      outcome: 'win',
    })
  })

  it('formats round output for the cli', () => {
    expect(formatRound({ humanAction: 'paper', computerAction: 'rock', outcome: 'win' })).toBe(
      '我出了 rock\n你赢了',
    )
  })
})
