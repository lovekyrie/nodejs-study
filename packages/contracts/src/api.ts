export interface ApiSuccess<T> {
  data: T
  requestId: string
}

export interface ApiError {
  error: {
    code: string
    message: string
    details?: unknown
    requestId: string
  }
}

export interface CursorPage<T> {
  data: T[]
  pageInfo: {
    limit: number
    nextCursor: string | null
  }
}

export const errorCodes = {
  internalError: 'INTERNAL_ERROR',
  validationError: 'VALIDATION_ERROR',
  unauthenticated: 'UNAUTHENTICATED',
  forbidden: 'FORBIDDEN',
  notFound: 'NOT_FOUND',
  conflict: 'CONFLICT',
  rateLimited: 'RATE_LIMITED',
} as const

export type ErrorCode = (typeof errorCodes)[keyof typeof errorCodes]

export function ok<T>(data: T, requestId: string): ApiSuccess<T> {
  return { data, requestId }
}

export function fail(
  code: ErrorCode | string,
  message: string,
  requestId: string,
  details?: unknown,
): ApiError {
  return {
    error: {
      code,
      message,
      ...(details === undefined ? {} : { details }),
      requestId,
    },
  }
}
