# Node.js Study

这是一个面向资深前端工程师的 Node.js 后端实战工作区。课程主线已经从入门 lesson 调整为 **12 周 Fastify SaaS 后台 API 项目**，目标是完成一个可以测试、部署、排障的 Node 后端。

技术栈固定为：

- Node 24 LTS
- TypeScript
- Fastify
- PostgreSQL + Prisma
- Redis + BullMQ
- Docker
- Vitest

## 快速开始

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm test:integration
pnpm db:validate
```

启动本地基础设施：

```bash
docker compose up -d postgres redis
```

运行 API：

```bash
pnpm dev:api
```

运行 worker：

```bash
pnpm dev:worker
```

## 课程结构

```text
apps/api                    Fastify HTTP API
apps/worker                 BullMQ 异步任务 worker
packages/config             环境变量与运行配置
packages/contracts          共享 DTO、错误码、响应类型
packages/database           Prisma schema、迁移入口、seed
docs                        课程路线、架构、API、部署和测试文档
lessons/*                    Node 入门 lesson（01-08）
legacy                      重构前的原始示例
```

旧 lesson 仍可运行：

```bash
pnpm lesson:01 hello node
pnpm lesson:02 rock
pnpm lesson:03
pnpm lesson:04
```

## 当前交付

- `GET /health`
- `GET /ready`
- 统一成功响应：`{ data, requestId }`
- 统一错误响应：`{ error: { code, message, details?, requestId } }`
- Fastify `inject` 集成测试
- Prisma 多租户 SaaS 初始数据模型
- Docker Compose PostgreSQL / Redis
- CI 验收骨架

## 学习路线

完整 12 周路线见 [docs/learning-roadmap.md](docs/learning-roadmap.md)。

项目约定见 [docs/conventions.md](docs/conventions.md)。
