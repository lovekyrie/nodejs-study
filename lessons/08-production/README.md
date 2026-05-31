# 08 Production

示例主题：

- 配置管理
- 日志
- 测试分层
- 构建
- 部署前检查

交付：一个生产化基础服务示例，包含：

- 集中式环境变量解析
- JSON structured logging
- `x-request-id`
- `GET /health` 与 `GET /ready`
- `SIGINT` / `SIGTERM` 优雅关闭

运行：

```bash
pnpm lesson:08

pnpm --filter @nodejs-study/08-production test
```

启动后可请求：

```bash
curl http://localhost:3002/health
curl http://localhost:3002/ready
```
