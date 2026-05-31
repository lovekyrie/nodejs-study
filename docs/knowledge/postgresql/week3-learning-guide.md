# 第 3 周：PostgreSQL 学习指南（MySQL / SQL Server 背景）

> 对应路线图：[learning-roadmap.md](../../learning-roadmap.md) 第 3 周
> 项目 schema：[schema.prisma](../../../packages/database/prisma/schema.prisma)

## 你的起点

已有 MySQL、SQL Server 经验，SQL 基础（JOIN、索引、事务、约束）可以直接复用。本周重点不是「重新学 SQL」，而是：

1. **PostgreSQL 与 MySQL/SQL Server 的差异**
2. **Prisma 如何映射 PG 特性**
3. **在本项目里完成 migration → seed → Repository 闭环**

预计投入：**每天 1.5～2 小时，共 7 天**。

---

## 心智模型：三个数据库怎么对照

| 概念 | MySQL | SQL Server | PostgreSQL |
| --- | --- | --- | --- |
| 字符串主键 | `VARCHAR(36)` + 应用生成 | `UNIQUEIDENTIFIER` / `NVARCHAR` | `TEXT` / `UUID` / 应用侧 cuid |
| 自增主键 | `AUTO_INCREMENT` | `IDENTITY` | `SERIAL` / `GENERATED ALWAYS AS IDENTITY` |
| 布尔 | `TINYINT(1)` | `BIT` | 原生 `BOOLEAN` |
| JSON | `JSON`（5.7+） | `NVARCHAR` + JSON 函数 | 原生 `JSON` / `JSONB`（推荐 JSONB） |
| 数组 | 无原生类型 | 无原生类型 | 原生 `TEXT[]`、`INT[]` 等 |
| 枚举 | `ENUM` 类型 | 约束 / lookup 表 | 原生 `ENUM` 或 lookup 表 |
| 大小写 | 表名大小写随 OS | 默认不敏感 | 未加引号标识符自动转小写 |
| 标识符引用 | `` `backtick` `` | `[bracket]` | `"double-quote"` |
| 分页 | `LIMIT offset, count` | `OFFSET/FETCH` | `LIMIT count OFFSET offset` |
| UPSERT | `ON DUPLICATE KEY UPDATE` | `MERGE` | `ON CONFLICT ... DO UPDATE` |
| 字符串拼接 | `CONCAT()` | `+` | `\|\|` 或 `CONCAT()` |
| 当前时间 | `NOW()` | `GETDATE()` | `NOW()` / `CURRENT_TIMESTAMP` |
| 事务隔离 | InnoDB 默认可重复读 | 默认可读已提交 | 默认可读已提交 |
| 存储过程 | 常用 | 常用 | 有，但 Node 项目里较少直接写 |

**PostgreSQL 的核心差异**：类型系统更丰富（JSONB、数组、范围类型）、标准 SQL 兼容度更高、扩展生态强（如 `pg_trgm` 模糊搜索）。在 Node SaaS 项目里，ORM/Prisma 会帮你挡掉大部分方言差异，但**索引设计、JSON 查询、冲突处理**仍需要理解 PG 语义。

---

## 7 天学习计划

### Day 1：环境 + psql 基础（从「连上库」开始）

**目标**：本地 PostgreSQL 跑起来，会用 `\d` 看表结构。

**动手**：

```bash
docker compose up -d postgres
docker compose exec postgres psql -U nodejs-study -d nodejs_study
```

**psql 常用命令**（对照 SSMS / MySQL Workbench）：

| psql | 作用 | 类比 |
| --- | --- | --- |
| `\l` | 列出数据库 | SSMS 对象资源管理器 |
| `\c dbname` | 切换库 | USE db |
| `\dt` | 列出表 | 展开 Tables |
| `\d users` | 看表结构 + 索引 | 设计器 / sp_help |
| `\di` | 列出索引 | 索引节点 |
| `\q` | 退出 | 断开连接 |

**练习**：启动 postgres 后执行 `\dt`，此时应该还没有业务表（migration 尚未跑）。

**自检**：能解释 `compose.yaml` 里 `POSTGRES_USER`、`POSTGRES_DB` 和 `.env` 里 `DATABASE_URL` 的对应关系。

---

### Day 2：PostgreSQL 类型与约束（对照你熟悉的库）

**目标**：读懂本项目 schema 里每个字段在 PG 里是什么。

**对照阅读** `packages/database/prisma/schema.prisma`：

| Prisma 类型 | PostgreSQL 列类型 | 说明 |
| --- | --- | --- |
| `String` | `TEXT` | PG 不区分 TEXT/VARCHAR 性能，Prisma 默认 TEXT |
| `String @id @default(cuid())` | `TEXT PRIMARY KEY` | cuid 在应用层生成，不是 PG 序列 |
| `DateTime` | `TIMESTAMP(3)` | 毫秒精度 |
| `DateTime?` | 可空 timestamp | 如 `deletedAt`、`acceptedAt` |
| `String[]` | `TEXT[]` | 如 `Role.permissions`，MySQL 无此原生类型 |
| `Json?` | `JSONB` | 如 `AuditLog.metadata`，适合键值查询 |
| `@updatedAt` | 带 trigger 或由 Prisma 维护 | 不是 PG 内置 ON UPDATE |

**约束对照**：

```prisma
@@unique([organizationId, key])   // UNIQUE 复合约束
@@unique([userId, organizationId]) // 一个用户在同一 org 只能有一条 membership
@@index([organizationId, deletedAt, createdAt]) // 复合索引，注意列顺序
onDelete: Cascade                   // 外键级联，类似 MySQL ON DELETE CASCADE
onDelete: SetNull                    // 删除父行时子行 FK 置 NULL
```

**练习 SQL**（migration 跑完后在 psql 执行）：
```bash
pnpm db:dev
```
> 但是为什么执行了这个之后，他就能成功的把sql同步进docker启动的容器里面

```sql
-- 看某张表的所有约束
\d+ memberships

-- 看索引是否被用到（Day 6 会深入）
EXPLAIN SELECT * FROM projects
WHERE organization_id = 'xxx' AND deleted_at IS NULL
ORDER BY created_at DESC
LIMIT 20;
```

**MySQL 迁移注意**：

- PG 没有 `utf8mb4`，默认 UTF-8 即完整 Unicode
- PG 单条 SQL 语句失败会**中止当前事务**（除非 SAVEPOINT），比 MySQL 更严格
- 字符串比较默认区分大小写；需要不区分时用 `ILIKE` 或 `LOWER()`

---

### Day 3：Prisma schema + migration 工作流

**目标**：理解「schema 是源码，migration 是 DDL 历史」。

**项目命令**：

```bash
pnpm db:validate          # 校验 schema 语法
pnpm db:generate          # 生成 Prisma Client
pnpm --filter @nodejs-study/database migrate:dev --name init
pnpm --filter @nodejs-study/database seed
```

**dev vs deploy**：

| 命令 | 场景 | 行为 |
| --- | --- | --- |
| `migrate dev` | 本地开发 | 对比 schema → 生成 SQL → 执行 → 更新 `_prisma_migrations` |
| `migrate deploy` | CI / 生产 | 只应用已有 migration，不自动生成 |

**对照 MySQL 经验**：

- Prisma migration ≈ Flyway/Liquibase 的版本化 SQL，或 Laravel migration
- 不要手改已提交的 migration 文件；改 schema 后新建 migration
- `prisma migrate reset` ≈ drop + migrate + seed（**仅开发环境**）

**练习**：

1. 跑 `migrate:dev --name init`，打开 `prisma/migrations/*/migration.sql` 读生成的 DDL
2. 对照 schema 里每个 `@@map("users")`，确认 PG 表名是 snake_case
3. 故意给 `User` 加一个可选字段 `avatarUrl String?`，再 `migrate dev`，观察增量 SQL

**自检**：能说出 `_prisma_migrations` 表的作用（记录已应用的 migration 版本）。

---

### Day 4：关系建模 — 读懂本项目的 7 张表

**目标**：从 ER 角度理解 User / Organization / Membership / Role / Project / Invitation / AuditLog。

**实体关系**：

```
Organization 1──N Role
Organization 1──N Membership N──1 User
Membership N──1 Role
Organization 1──N Project
Organization 1──N Invitation
Organization 1──N AuditLog
User 1──N RefreshToken
```

**设计意图**（SaaS 多租户前置）：

- **Organization**：租户边界，所有业务数据带 `organizationId`
- **Membership + Role**：用户在不同 org 可以有不同角色（第 5 周 RBAC 会用到）
- **Invitation**：待接受成员，`tokenHash` 存哈希不存明文
- **Project.deletedAt**：软删除，查询活跃项目加 `deletedAt: null`
- **AuditLog.metadata (Json)**：存操作上下文，append-only 审计

**Prisma 查询练习**（可用 `tsx` 或 seed 脚本试）：

```ts
// 查某 org 下所有成员及角色
await prisma.membership.findMany({
  where: { organizationId: orgId },
  include: { user: true, role: true },
})

// 查某 org 未删除的项目
await prisma.project.findMany({
  where: { organizationId: orgId, deletedAt: null },
  orderBy: { createdAt: 'desc' },
})
```

**对照 SQL Server**：Prisma `include` ≈ EF Core `.Include()`；MySQL 里你会写 JOIN，Prisma 帮你生成。

---

### Day 5：Seed + 数据初始化策略

**目标**：掌握 `upsert`、幂等 seed、测试数据边界。

**阅读** `packages/database/prisma/seed.ts`：

- `upsert` + 复合 unique key（如 `organizationId_key`）→ 重复跑 seed 不会 duplicate
- `passwordHash` 占位符 → 第 4 周 auth 会换成 Argon2id 真实哈希

**练习**：

1. 跑两次 `pnpm --filter @nodejs-study/database seed`，确认数据不重复
2. 在 seed 里加一个 `member` 角色和一条 `Project`
3. 用 psql 验证：`SELECT * FROM roles;`

**Seed vs Migration**：

| | Migration | Seed |
| --- | --- | --- |
| 内容 | 表结构、索引、约束 | 初始/测试数据 |
| 环境 | dev + prod 都要 | 通常 dev/staging；prod 谨慎 |
| 幂等 | 按版本号只跑一次 | 应设计为可重复执行 |

---

### Day 6：索引、EXPLAIN、JSONB（PG 进阶）

**目标**：会看查询计划，知道本项目索引为什么这样建。

**本项目索引解读**：

```prisma
@@index([organizationId, deletedAt, createdAt])  // projects：按租户列活跃项目
@@index([organizationId, email])                   // invitations：按 org 查邀请
@@index([organizationId, createdAt])               // audit_logs：按时间翻页
@@index([userId, revokedAt])                       // refresh_tokens：查有效 token
```

**复合索引列顺序原则**（MySQL/SQL Server 同样适用）：

- 等值条件列放前面（`organizationId`）
- 范围/排序列放后面（`createdAt`）
- 选择性高的列优先

**JSONB 练习**（AuditLog）：

```sql
-- 查 metadata 里某 key
SELECT * FROM audit_logs
WHERE metadata @> '{"ip": "127.0.0.1"}';

-- 建 GIN 索引（若 JSON 查询频繁，可在 raw migration 里加）
CREATE INDEX idx_audit_metadata ON audit_logs USING GIN (metadata);
```

Prisma 对 JSON 过滤支持有限，复杂 JSON 查询可能是 raw SQL 的候选场景。

**EXPLAIN 练习**：

```sql
EXPLAIN ANALYZE
SELECT * FROM memberships WHERE organization_id = '...';
```

关注 `Seq Scan` vs `Index Scan`——全表扫描在大表上是性能红灯。

---

### Day 7：Repository 层 + Prisma vs Raw SQL 边界

**目标**：完成路线图交付物「Repository 层」，并明确何时脱离 Prisma。

**Repository 职责**（建议结构）：

```
packages/database/src/repositories/
  user.repository.ts
  organization.repository.ts
  membership.repository.ts
  ...
```

**每层只做**：

- 封装 Prisma 调用，返回 domain 需要的 shape
- 处理 `PrismaClientKnownRequestError`（如 `P2002` unique violation）
- **不**包含 HTTP、业务规则（那些放 service 层）

**示例边界**：

```ts
// ✅ Repository：数据访问
async findMembership(userId: string, organizationId: string) {
  return this.prisma.membership.findUnique({
    where: { userId_organizationId: { userId, organizationId } },
    include: { role: true },
  })
}

// ✅ Service：业务规则
async assertUserCanAccessProject(userId, projectId) { ... }

// ⚠️ Raw SQL：Prisma 不好表达时
await prisma.$queryRaw`
  SELECT u.* FROM users u
  JOIN memberships m ON m.user_id = u.id
  WHERE m.organization_id = ${orgId}
  AND u.email ILIKE ${pattern}
`
```

**何时用 Prisma / 何时用 Raw SQL**：

| 场景 | 推荐 |
| --- | --- |
| CRUD、关系加载、简单过滤 | Prisma |
| 需要 compile-time 类型安全 | Prisma |
| 复杂报表、窗口函数、CTE | `$queryRaw` |
| JSONB 高级操作、全文搜索 | Raw SQL + 可能加 PG 扩展 |
| 批量 upsert 性能优化 | `$executeRaw` 或 Prisma `createMany` |

**本周验收清单**（对照路线图交付）：

- [ ] `schema.prisma` 七张表关系清晰，能画 ER 图
- [ ] `initial migration` 已生成并在本地 apply
- [ ] `seed.ts` 幂等，能造出演示 org/user/role
- [ ] Repository 层至少覆盖 User、Organization、Membership
- [ ] 能口头解释 3 个 PG 与 MySQL 的差异点
- [ ] 能对一个查询跑 `EXPLAIN` 并读懂是否走索引

---

## 推荐资料（按优先级）

1. **本项目文件**：`schema.prisma`、`seed.ts`、`compose.yaml`
2. [Prisma Docs — PostgreSQL](https://www.prisma.io/docs/orm/overview/databases/postgresql)
3. [PostgreSQL Tutorial](https://www.postgresqltutorial.com/) — 快速查语法
4. [PostgreSQL 官方文档 — Indexes](https://www.postgresql.org/docs/current/indexes.html)
5. 书：《PostgreSQL 14 Internals》选读索引/事务章节

---

## 常见坑（MySQL/SQL Server 老手易踩）

1. **忘记 PG 标识符小写**：`SELECT * FROM Users` 会报错，表名是 `users`
2. **事务里一条失败全部回滚**：批量 insert 要考虑 `ON CONFLICT` 或逐条 SAVEPOINT
3. **DateTime 时区**：Prisma `DateTime` 存 UTC 时间戳；应用层统一用 ISO 8601
4. **cuid 主键 vs 自增**：本项目选 cuid 是为了分布式友好、不暴露递增 id；JOIN 性能略逊于 bigint，SaaS 场景通常可接受
5. **Prisma 迁移与手工改库**：生产库禁止手改后不同步 schema，否则 drift
6. **数组/JSON 在 MySQL 里的写法不能直接搬**：`permissions String[]` 在 PG 是原生数组

---

## 与后续周次的衔接

| 周次 | 依赖第 3 周的什么 |
| --- | --- |
| 第 4 周 Auth | `User.passwordHash`、`RefreshToken` 表、Repository |
| 第 5 周 多租户 | `Organization` + `Membership` + `Role.permissions` |
| 第 6 周及以后 | `AuditLog`、软删除 `Project.deletedAt` |

第 3 周不必把 auth、RBAC 逻辑写进 Repository；**先把表、迁移、seed、数据访问边界打稳**。
