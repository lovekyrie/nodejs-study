export interface Calculation {
  operator: 'add' | 'subtract'
  left: number
  right: number
  result: number
}

export function add(left: number, right: number): Calculation {
  return {
    operator: 'add',
    left,
    right,
    result: left + right,
  }
}

export function subtract(left: number, right: number): Calculation {
  return {
    operator: 'subtract',
    left,
    right,
    result: left - right,
  }
}
