# 部署手册

## 本地依赖

```bash
docker compose up -d postgres redis
```

默认连接：

- PostgreSQL: `postgresql://nodejs-study:nodejs-study@localhost:5432/nodejs_study`
- Redis: `redis://localhost:6379/0`

## 环境变量

复制 `.env.example` 并按环境修改：

```bash
cp .env.example .env
```

生产环境必须显式设置：

- `DATABASE_URL`
- `REDIS_URL`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`
- `LOG_LEVEL`

## 数据库

开发迁移：

```bash
pnpm --filter @nodejs-study/database migrate:dev
```

生产迁移：

```bash
pnpm --filter @nodejs-study/database migrate:deploy
```

Schema 验证：

```bash
pnpm db:validate
```

Seed：

```bash
pnpm --filter @nodejs-study/database seed
```

## API

开发运行：

```bash
pnpm dev:api
```

健康检查：

```bash
curl http://localhost:3000/health
curl http://localhost:3000/ready
```

OpenAPI UI：

```text
http://localhost:3000/docs
```

## Worker

开发运行：

```bash
pnpm dev:worker
```

Worker 必须和 API 使用同一个 Redis。部署时 API 和 worker 应作为两个独立进程扩缩容。

## CI 最低检查

CI 当前执行：

```bash
pnpm install --frozen-lockfile
pnpm typecheck
pnpm test
pnpm test:integration
pnpm db:validate
docker build -f apps/api/Dockerfile .
```

## 上线 Checklist

- Node runtime 使用 24 LTS。
- `NODE_ENV=production`。
- secrets 不使用 `.env.example` 示例值。
- 已执行 `prisma migrate deploy`。
- `/health` 和 `/ready` 接入平台 health check。
- 日志输出 JSON 到 stdout/stderr。
- Redis、PostgreSQL 有监控和备份策略。
- worker retry、失败告警和 dead-letter 处理策略已确认。
