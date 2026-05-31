# genReqId 到 request.id 的链路

> Related source: [server.ts](../../../apps/api/src/server.ts), Fastify `lib/route.js`, `lib/request.js`, `lib/req-id-gen-factory.js`

## Meaning

`genReqId` 是 Fastify 的**启动配置项**，类型为 `(rawReq) => string`。它不会在 `Fastify()` 调用时立刻执行，而是在**每个 HTTP 请求到达、路由 handler 即将运行前**被调用一次，返回值成为该请求的 `request.id`。

## 调用链

```
Fastify({ genReqId: () => randomUUID() })
  ↓ processOptions → reqIdGenFactory
  ↓ 存到实例 fastify[kGenReqId]，通过 getter 暴露为 fastify.genReqId
  ↓
HTTP 请求到达 → routeHandler(rawReq, ...)
  ↓
const id = getGenReqId(context.server, rawReq)
  // 等价于 context.server.genReqId(rawReq)
  ↓
const request = new Request(id, params, rawReq, query, logger, context)
  // Request 构造函数: this.id = id
  ↓
route handler(request, reply)  →  request.id 可用
```

## 参数说明

- `genReqId` 收到的是 Node.js 原生 **`IncomingMessage`**（raw request），不是 Fastify 包装后的 `FastifyRequest`
- 你的写法 `() => randomUUID()` 忽略了第一个参数，每次请求仍会得到新 UUID
- 若配置 `requestIdHeader: 'x-request-id'`，会优先用请求头里的 id，没有时才调用 `genReqId`

## In This Project

```ts
// server.ts
const app = Fastify({
  genReqId: () => randomUUID(),
})

// health handler
async (request) => ok({ status: 'ok' }, request.id)

// error handler
reply.send(fail(code, message, request.id, details))
```

同一请求在整个 lifecycle 内共用同一个 `request.id`，用于响应体、日志关联和链路追踪。
