import { describe, expect, it } from 'vitest'
import { collectRuntimeInfo, formatRuntimeInfo, normalizeCliArgs } from '../src/index'

describe('runtime cli helpers', () => {
  it('collects runtime information with explicit args and env', () => {
    const info = collectRuntimeInfo(['hello', 'node'], { NODE_ENV: 'test' })

    expect(info.mode).toBe('test')
    expect(info.args).toEqual(['hello', 'node'])
    expect(info.nodeVersion).toMatch(/^v\d+\./)
    expect(info.cwd).toBe(process.cwd())
  })

  it('removes pnpm argument separators from cli args', () => {
    expect(normalizeCliArgs(['--', 'hello', 'node'])).toEqual(['hello', 'node'])
  })

  it('formats args and falls back when no args are provided', () => {
    const output = formatRuntimeInfo({
      nodeVersion: 'v22.0.0',
      platform: 'linux',
      cwd: '/project',
      mode: 'development',
      args: [],
    })

    expect(output).toContain('Node: v22.0.0')
    expect(output).toContain('Args: (none)')
  })
})
