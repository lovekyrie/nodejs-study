import { describe, expect, it } from 'vitest'
import { errorCodes, fail, ok } from '../src/api'

describe('api contracts', () => {
  it('wraps successful payloads with a request id', () => {
    expect(ok({ id: 'project_1' }, 'req_1')).toEqual({
      data: { id: 'project_1' },
      requestId: 'req_1',
    })
  })

  it('omits details when an error has no details payload', () => {
    expect(fail(errorCodes.notFound, 'Project not found', 'req_2')).toEqual({
      error: {
        code: 'NOT_FOUND',
        message: 'Project not found',
        requestId: 'req_2',
      },
    })
  })
})
