# Node.js Study

这是一个面向工程实战的 Node.js 学习工作区。项目从零散脚本重构为 `TypeScript + pnpm + Vitest` 的 lesson 结构，每个主题都尽量包含：

- 可直接运行的示例
- 可复用的业务函数
- 对应单元测试
- 简短的学习说明

## 快速开始

```bash
pnpm install
pnpm typecheck
pnpm test
```

运行前 4 个 lesson：

```bash
pnpm lesson:01 hello node
pnpm lesson:02 rock
pnpm lesson:03
pnpm lesson:04
```

## 目录

```text
docs/                  学习路线和项目约定
lessons/               主学习工作区
legacy/                重构前的原始示例
```

## 学习路线

完整 8 周路线见 [docs/learning-roadmap.md](docs/learning-roadmap.md)。

项目约定见 [docs/conventions.md](docs/conventions.md)。
