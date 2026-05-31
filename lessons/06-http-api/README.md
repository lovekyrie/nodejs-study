# 06 HTTP API

示例主题：

- `node:http`
- Fastify
- 路由组织
- 错误处理
- 请求校验

交付：一个内存 Notes API，包含：

- `GET /notes`
- `GET /notes/:noteId`
- `POST /notes`
- JSON Schema body validation
- 统一错误响应
- `fastify.inject` 测试

运行：

```bash
pnpm lesson:06

pnpm --filter @nodejs-study/06-http-api test
```

启动后可请求：

```bash
curl http://localhost:3001/notes
```
