# 项目约定

## 代码组织

- 正式课程代码放在 `apps/*` 和 `packages/*`，入门 lesson 放在 `lessons/*`。
- `apps/api` 只负责 HTTP 边界、Fastify plugin、request/response、认证中间件和 API composition。
- `apps/worker` 只负责 BullMQ worker 进程、job handler 和任务生命周期。
- `packages/config` 负责环境变量解析和运行配置，业务代码不要直接散落读取 `process.env`。
- `packages/contracts` 负责共享 DTO、错误码和响应类型。
- `packages/database` 负责 Prisma schema、migration、seed 和数据访问边界。
- 示例和业务代码默认使用 ESM 与 TypeScript。

## 测试

- 使用 Vitest。
- 单元测试文件使用 `*.test.ts`，默认由 `pnpm test` 执行。
- API component/integration 测试使用 `*.integration.test.ts`，由 `pnpm test:integration` 执行。
- Fastify API 测试优先使用 `fastify.inject`，避免依赖真实端口。
- 数据库测试使用独立 test database，每个测试文件自己准备数据，不共享全局 seed。
- 纯函数优先直接单测；计时器、事件和 retry 行为使用 fake timers 或明确的 fixture。

## 命令

- 根目录统一运行 `pnpm test`、`pnpm typecheck`。
- 集成测试统一运行 `pnpm test:integration`。
- Prisma schema 验证统一运行 `pnpm db:validate`。
- API 本地运行使用 `pnpm dev:api`。
- worker 本地运行使用 `pnpm dev:worker`。
- 热身 lesson 运行命令保留 `pnpm lesson:01` 这种固定入口。

## 命名

- workspace package 使用 `@nodejs-study/*`。
- 正式包目录使用职责名，例如 `api`、`worker`、`config`、`contracts`、`database`。
- 热身 lesson 目录使用数字前缀和 kebab-case，例如 `01-runtime-cli`。
- 导出的类型使用 PascalCase。
- 普通函数和变量使用 camelCase。

## API 契约

- 成功响应统一为 `{ data, requestId }`。
- 错误响应统一为 `{ error: { code, message, details?, requestId } }`。
- 分页响应统一为 `{ data, pageInfo: { limit, nextCursor } }`。
- route schema 必须和共享 DTO 一起维护，不能只靠运行时对象临时拼装。

## 数据库

- Prisma schema 是数据模型事实来源。
- migration 在开发环境使用 `prisma migrate dev`，生产环境使用 `prisma migrate deploy`。
- 事务必须包住跨表一致性写入，例如注册后创建默认组织、邀请接受、项目软删除审计。
- raw SQL 只能用于 Prisma 无法表达或性能明确需要的场景，并要写明原因。
