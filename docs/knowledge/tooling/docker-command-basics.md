# Docker 命令与本项目本地依赖

> Related source: [compose.yaml](../../../compose.yaml), [docs/deployment.md](../../deployment.md)

## Meaning

Docker 相关命令可以分为三类：检查工具安装、运行容器服务、构建应用镜像。它们验证的事情不同，不能互相替代。

### 可用性检查

```bash
docker --version
docker compose version
```

- `docker --version` 打印 Docker CLI 版本，用来确认命令已经安装且可以被 shell 找到。
- `docker compose version` 打印 Compose 插件版本，用来确认可以执行 Compose 工作流。

如果要进一步确认 CLI 能连接到 Docker Engine，可以执行：

```bash
docker version
```

该命令会分别输出 Client 与 Server 信息。只有 Server 部分能够正常返回，才说明当前终端可以连接运行中的 Docker Engine。

### 启动服务

```bash
docker compose up -d postgres redis
```

- `compose` 读取当前目录的 `compose.yaml`。
- `up` 创建并启动服务，必要时下载镜像和创建网络、数据卷。
- `-d` 表示后台运行，不占用当前终端。
- `postgres redis` 限定只启动这两个服务。

### 构建镜像

```bash
docker build -f apps/api/Dockerfile .
```

- `build` 根据 Dockerfile 生成 API 镜像。
- `-f apps/api/Dockerfile` 指定构建文件。
- `.` 是构建上下文，Docker 可以从仓库根目录读取构建所需文件。

构建成功只说明镜像可以生成，不代表 PostgreSQL、Redis 或 API 已经运行。

## In This Project

本项目的 API 使用 PostgreSQL 保存业务数据，worker 使用 Redis 支撑 BullMQ 队列，因此本地开发前需要启动 `compose.yaml` 中的 `postgres` 和 `redis`。

常用检查流程：

```bash
docker --version
docker compose version
docker compose up -d postgres redis
docker compose ps
```

前两个命令检查 Docker 工具链，第三个命令启动依赖，最后一个命令检查服务状态。完成开发后可以执行：

```bash
docker compose down
```

该命令停止并移除 Compose 创建的容器和网络；默认不会删除 PostgreSQL 数据卷。
