# Node.js 后端 12 周实战路线

## 定位

这条路线面向已有多年经验的前端工程师，不再把正式课程时间花在 Node 语法入门上。`lessons/01-08` 可作为开课前热身，正式主线从 `apps/*` 和 `packages/*` 开始。

正式主线是一个多租户 SaaS 后台 API：

- 用户、组织、成员、角色、项目、邀请、审计日志
- 邮箱密码认证、refresh token rotation、登出
- 组织隔离、RBAC、资源级授权
- PostgreSQL 数据建模、Prisma migration、事务
- Redis 缓存与限流
- BullMQ 异步任务
- Docker、CI、日志、测试和上线 checklist

## 第 1 周：工程骨架与运行时

目标：

- 建立 `apps/api`、`apps/worker`、`packages/*` workspace。
- 配置 Node 24、TypeScript strict、Vitest、Docker Compose。
- 建立统一 config、优雅关闭和基础 health check。

交付：

- `GET /health`
- `GET /ready`
- `packages/config`
- `compose.yaml`
- `pnpm typecheck`
- `pnpm test`
- `pnpm test:integration`

## 第 2 周：Fastify HTTP 基础与 API 契约

目标：

- 理解 route、plugin encapsulation、request lifecycle。
- 用 JSON Schema 做 validation 和 serialization。
- 固化统一成功响应、统一错误响应和 request id。
- 输出 OpenAPI 文档。

交付：

- `packages/contracts`
- `/docs` OpenAPI UI
- 错误码表
- `fastify.inject` component tests

## 第 3 周：PostgreSQL 与 Prisma 数据建模

目标：

- 设计 User、Organization、Membership、Role、Project、Invitation、AuditLog。
- 掌握 Prisma schema、migration dev/deploy、seed 和 repository 边界。
- 明确 type-safe query 与 raw SQL 的使用边界。

交付：

- `packages/database/prisma/schema.prisma`
- initial migration
- seed
- Repository 层

## 第 4 周：认证系统

目标：

- 实现邮箱密码注册和登录。
- 使用 Argon2id 存储密码哈希。
- 实现 access token、refresh token rotation 和 logout。
- 区分认证错误、校验错误和系统错误。

交付：

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- refresh token 存储和撤销测试

## 第 5 周：多租户与权限

目标：

- 建立组织隔离模型。
- 实现 membership、role-based access control、资源级授权。
- 对越权访问做稳定错误响应。

交付：

- `POST /orgs`
- `GET /orgs/:orgId`
- `POST /orgs/:orgId/invitations`
- 成员邀请
- 角色校验
- 越权测试

## 第 6 周：业务 API 设计

目标：

- 实现 Project CRUD。
- 设计 cursor pagination、filter/sort、幂等创建和软删除。
- 固化业务 API 的 DTO 和错误码。

交付：

- `POST /orgs/:orgId/projects`
- `GET /orgs/:orgId/projects`
- `PATCH /orgs/:orgId/projects/:projectId`
- `DELETE /orgs/:orgId/projects/:projectId`
- 分页和软删除集成测试

## 第 7 周：事务、一致性与错误处理

目标：

- 用 Prisma transaction 处理跨表写入。
- 处理唯一约束冲突和并发邀请。
- 区分业务错误、基础设施错误和未知错误。

交付：

- 事务用例
- 冲突测试
- 事务回滚测试
- 稳定错误响应快照

## 第 8 周：缓存与限流

目标：

- 接入 Redis 缓存热点组织信息。
- 设计 cache invalidation。
- 给认证接口添加限流和登录防爆破策略。
- 明确 Redis 不可用时的降级行为。

交付：

- 组织信息缓存
- 认证接口限流
- Redis 不可用测试

## 第 9 周：异步任务

目标：

- 用 BullMQ 设计 job、queue 和 worker。
- 实现 retry、dead-letter 思路和任务幂等。
- 拆分 API enqueue 与 worker handler。

交付：

- 邀请邮件任务
- 审计日志异步写入
- worker retry 测试
- 幂等 job id

## 第 10 周：可观测性

目标：

- 使用 Pino JSON logs。
- 贯穿 request id 和 structured logging。
- 记录错误日志、慢查询、关键业务事件和基础 metrics。

交付：

- 请求日志
- 错误日志
- 性能埋点
- 故障排查文档

## 第 11 周：测试体系

目标：

- 建立 unit、integration、API component test 分层。
- 使用独立 test database。
- 使用 fixture 和外部服务 mock。
- 为认证、权限、事务、分页和任务重试补测试矩阵。

交付：

- 测试矩阵
- test database 初始化
- CI 测试任务拆分
- 覆盖关键业务路径的 component tests

## 第 12 周：部署与上线

目标：

- 完成 Dockerfile、Compose、migration deploy、health checks、CI。
- 梳理环境变量、密钥、日志、数据库迁移和回滚策略。
- 输出生产上线 checklist。

交付：

- 可本地一键启动
- 可 CI 校验
- 可部署 API 项目
- 部署手册

## 验收命令

每周必须保持以下命令可运行：

```bash
pnpm typecheck
pnpm test
pnpm test:integration
pnpm db:validate
```
