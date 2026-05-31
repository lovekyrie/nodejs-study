# Fastify Route、Plugin Encapsulation、Request Lifecycle

> Related source: [server.ts](../../../apps/api/src/server.ts), [health.ts](../../../apps/api/src/routes/health.ts)

## Meaning

### Route（路由）

Route 是「URL + HTTP 方法 → 处理函数」的映射。客户端请求 `/health` + `GET` 时，Fastify 找到对应 handler 并执行。

### Plugin Encapsulation（插件封装）

Fastify 用 plugin 组织代码。每个 `app.register(plugin)` 会创建**独立作用域**：

- 在 plugin 内注册的 route、hook、decorator 默认只在该作用域可见
- 不同 plugin 之间不会互相污染（除非显式共享）
- 通过 `await app.register(...)` 保证 plugin 按顺序加载完成

这是 Fastify 模块化设计的核心：把 health、auth、user 等拆成独立 plugin，各自管理路由和中间件。

### Request Lifecycle（请求生命周期）

一次 HTTP 请求在 Fastify 中会依次经过多个阶段：

1. 接收请求，生成 `request.id`
2. `onRequest` hook
3. 路由匹配
4. `preParsing` → 解析 body → `preValidation`
5. JSON Schema validation（若配置了 `schema`）
6. `preHandler` → **route handler** → `preSerialization`
7. JSON Schema serialization（若配置了 response schema）
8. 发送响应；若出错则走 `setErrorHandler`

## In This Project

```ts
// server.ts — 根实例注册多个 plugin
await app.register(swagger, { ... })
await app.register(swaggerUi, { routePrefix: '/docs' })
await app.register(healthRoutes, { config })
```

```ts
// routes/health.ts — healthRoutes 是一个 plugin，内部注册 route
export const healthRoutes: FastifyPluginAsync<...> = async (app, options) => {
  app.get('/health', { schema: { ... } }, async (request) => ok(..., request.id))
  app.get('/ready', async (request) => ok(..., request.id))
}
```

- **Route**：`/health`、`/ready` 两个 GET 端点
- **Plugin encapsulation**：路由放在 `healthRoutes` plugin 里，与 swagger 插件隔离；通过 `{ config }` 传入选项
- **Request lifecycle**：`genReqId` 生成 id → schema 校验/序列化 → handler 返回 → 出错时 `setErrorHandler` 统一包装为 `fail(...)`
