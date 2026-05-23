# Node.js 8 周学习路线

## 第 1 周：Node 运行时与 CLI

- 理解 `node` 命令、`process.argv`、`process.env`、退出码和当前工作目录。
- 完成 `lessons/01-runtime-cli`，能从命令行读取参数并输出运行时信息。

## 第 2 周：TypeScript 与可测试业务逻辑

- 用类型建模输入、输出和错误状态。
- 把 CLI 输入输出与核心逻辑拆开。
- 完成 `lessons/02-rps-cli`，覆盖胜、负、平和非法输入测试。

## 第 3 周：模块系统

- 对比 CommonJS 与 ESM。
- 理解命名导出、默认导出、模块缓存和加载时副作用。
- 完成 `lessons/03-modules`。

## 第 4 周：事件、异步 I/O 与事件循环

- 学习 timers、callback、Promise、`async/await` 和 `EventEmitter`。
- 完成 `lessons/04-events-async-io`，示例必须可停止、可测试。

## 第 5 周：文件系统与 Stream

- 学习 `node:fs/promises`、`node:path`、Buffer、Readable/Writable 和 `pipeline`。
- 交付一个文件扫描或文本统计工具。

## 第 6 周：HTTP API

- 先理解 `node:http`，再引入 Fastify 做工程化 API。
- 交付一个 Todo 或 Notes API，包含路由、错误处理和请求校验。

## 第 7 周：数据持久化

- 从 JSON 文件存储过渡到 SQLite 或 PostgreSQL。
- 给第 6 周 API 接入持久化存储。

## 第 8 周：生产化基础

- 学习配置管理、日志、测试分层、构建和部署前检查。
- 补全项目 README、运行命令、测试命令和复盘文档。
