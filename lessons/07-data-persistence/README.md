# 07 Data Persistence

示例主题：

- JSON 文件存储
- SQLite 或 PostgreSQL
- Repository 层
- 数据迁移基础

交付：一个 `JsonNoteRepository`，用 JSON 文件保存 Note 数据，展示：

- 存储文件不存在时初始化为空列表
- repository 的 `list`、`findById`、`create` 方法
- 临时文件加 `rename` 的原子写入模式
- 损坏数据的显式报错

运行：

```bash
pnpm lesson:07 add "first saved note" "persisted on disk"
pnpm lesson:07 list

pnpm --filter @nodejs-study/07-data-persistence test
```

这个 lesson 先展示文件持久化的边界；正式 SaaS 项目的 PostgreSQL/Prisma 模型位于 `packages/database`。
