export const actions = ['rock', 'paper', 'scissor'] as const

export type Action = (typeof actions)[number]
export type RoundOutcome = 'win' | 'lose' | 'draw'

export interface RoundResult {
  humanAction: Action
  computerAction: Action
  outcome: RoundOutcome
}

export function parseAction(input: string): Action | null {
  const normalized = input.trim().toLowerCase()
  return actions.includes(normalized as Action) ? (normalized as Action) : null
}

export function pickComputerAction(random = Math.random): Action {
  const index = Math.min(Math.floor(random() * actions.length), actions.length - 1)
  return actions[index]
}

export function compareActions(humanAction: Action, computerAction: Action): RoundOutcome {
  if (humanAction === computerAction) {
    return 'draw'
  }

  const humanWins =
    (humanAction === 'rock' && computerAction === 'scissor') ||
    (humanAction === 'scissor' && computerAction === 'paper') ||
    (humanAction === 'paper' && computerAction === 'rock')

  return humanWins ? 'win' : 'lose'
}

export function playRound(humanAction: Action, random = Math.random): RoundResult {
  const computerAction = pickComputerAction(random)

  return {
    humanAction,
    computerAction,
    outcome: compareActions(humanAction, computerAction),
  }
}

export function formatRound(result: RoundResult): string {
  const outcomeText: Record<RoundOutcome, string> = {
    win: '你赢了',
    lose: '你输了',
    draw: '平局',
  }

  return [`我出了 ${result.computerAction}`, outcomeText[result.outcome]].join('\n')
}
