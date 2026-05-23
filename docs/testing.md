# 测试策略

## 分层

- Unit test: 纯函数、配置解析、DTO helper、权限判断。
- Component test: 使用 `fastify.inject` 测试 HTTP API，不监听真实端口。
- Integration test: 需要 PostgreSQL、Redis、Prisma 或 BullMQ 的跨组件测试。
- Contract test: 锁定错误码、响应 shape、分页 shape。

## 命令

```bash
pnpm test
pnpm test:integration
pnpm typecheck
pnpm db:validate
```

## 数据库测试

- 使用独立 test database。
- 每个测试文件自己准备数据。
- 不依赖全局 seed。
- 测试结束后清理自己创建的数据。

## 必测场景

- 注册登录。
- token 刷新和 refresh token rotation。
- logout 后 refresh token 失效。
- 越权访问。
- 组织隔离。
- 事务回滚。
- 唯一约束冲突。
- cursor pagination 边界。
- 重复请求和幂等创建。
- Redis 不可用。
- worker retry。

## 当前覆盖

当前仓库已覆盖：

- config 默认值和生产环境 secrets 校验。
- API 统一成功和错误响应 helper。
- `/health` 和 `/ready` 的 Fastify component test。
- worker job id 和 Redis URL 解析 helper。
