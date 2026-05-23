# 项目约定

## 代码组织

- 每个 lesson 是一个独立目录，优先把核心逻辑放在可导出的函数里。
- CLI 入口只负责解析输入、调用核心逻辑和输出结果。
- 示例代码默认使用 ESM 与 TypeScript。
- 需要演示 CommonJS 时使用 `.cjs` 文件，避免和主工程风格混在一起。

## 测试

- 使用 Vitest。
- 测试文件放在对应 lesson 的 `test/` 目录。
- 纯函数优先直接单测；计时器和事件使用 fake timers。

## 命令

- 根目录统一运行 `pnpm test`、`pnpm typecheck`。
- lesson 运行命令使用 `pnpm lesson:01` 这种固定入口。

## 命名

- lesson 目录使用数字前缀和 kebab-case，例如 `01-runtime-cli`。
- 导出的类型使用 PascalCase。
- 普通函数和变量使用 camelCase。
