let calls = 0

export function incrementModuleCounter(): number {
  calls += 1
  return calls
}

export function getModuleCounter(): number {
  return calls
}

export function resetModuleCounter(): void {
  calls = 0
}
