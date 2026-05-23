# API 契约

## 统一响应

成功响应：

```ts
type ApiSuccess<T> = {
  data: T
  requestId: string
}
```

错误响应：

```ts
type ApiError = {
  error: {
    code: string
    message: string
    details?: unknown
    requestId: string
  }
}
```

分页响应：

```ts
type CursorPage<T> = {
  data: T[]
  pageInfo: {
    limit: number
    nextCursor: string | null
  }
}
```

当前类型定义位于 `packages/contracts/src/api.ts`。

## 错误码

基础错误码：

- `INTERNAL_ERROR`
- `VALIDATION_ERROR`
- `UNAUTHENTICATED`
- `FORBIDDEN`
- `NOT_FOUND`
- `CONFLICT`
- `RATE_LIMITED`

业务错误码新增时必须满足：

- 对客户端稳定，不暴露数据库或基础设施细节。
- 同一个业务场景不要复用多个 code。
- message 可以优化，code 不能随意改名。

## 核心 REST API

系统：

- `GET /health`
- `GET /ready`

认证：

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /me`

组织：

- `POST /orgs`
- `GET /orgs/:orgId`
- `POST /orgs/:orgId/invitations`

项目：

- `POST /orgs/:orgId/projects`
- `GET /orgs/:orgId/projects`
- `PATCH /orgs/:orgId/projects/:projectId`
- `DELETE /orgs/:orgId/projects/:projectId`

## 测试要求

- HTTP 测试优先使用 `fastify.inject`。
- 每个公开 API 至少覆盖成功、校验失败、认证失败和权限失败。
- 涉及分页的 API 必须覆盖空列表、刚好一页、超过一页和非法 cursor。
