# 架构说明

## Workspace

```text
apps/api
apps/worker
packages/config
packages/contracts
packages/database
```

`apps/*` 是进程入口，`packages/*` 是共享能力。正式业务代码不依赖 `lessons/00-foundation-warmup`。

## API 进程

`apps/api` 使用 Fastify：

- plugin 组织路由和横切能力。
- JSON Schema 做请求校验和响应序列化。
- `genReqId` 生成 request id，并写入统一响应。
- `setErrorHandler` 把未知错误和校验错误转换为统一错误响应。
- `/docs` 暴露 OpenAPI UI。

当前已实现：

- `GET /health`
- `GET /ready`

## Worker 进程

`apps/worker` 使用 BullMQ：

- API 负责 enqueue。
- worker 负责 handler、retry 和失败处理。
- job id 必须稳定，重复请求能做到幂等。

当前已建立：

- `invitation-email` queue 名称
- `audit-log` queue 名称
- 稳定 job id helper
- Redis URL 解析 helper

## 配置

`packages/config` 是唯一的配置解析入口。默认开发环境可以直接跑本地 PostgreSQL 和 Redis；生产环境必须显式提供 access/refresh token secrets。

业务代码不要散落读取 `process.env`，统一通过 `loadConfig()` 获得配置对象。

## 数据模型

`packages/database/prisma/schema.prisma` 是初始 SaaS 多租户模型：

- `User`
- `Organization`
- `Role`
- `Membership`
- `Invitation`
- `Project`
- `RefreshToken`
- `AuditLog`

关键约束：

- 用户邮箱唯一。
- 组织 slug 唯一。
- 同一组织内 role key 唯一。
- 同一用户在同一组织内只有一个 membership。
- 同一组织内 project slug 唯一。
- refresh token 和 invitation token 只存 hash。

## 边界

- API 层不直接拼数据库表结构响应，经过 DTO。
- Repository 层负责 Prisma query，service 层负责业务事务。
- Redis 缓存不能成为唯一事实来源。
- Worker handler 必须能重复执行，不能假设 job 只跑一次。
