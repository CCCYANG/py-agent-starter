# Backend

Python 后端学习服务，使用 Python 3.12、uv、FastAPI 和 `src` 包布局。
当前仅提供 `GET /health`，返回 `{"status":"ok"}`，用于检查进程存活。
该接口不检查数据库、模型服务或其他外部依赖的可用性。

在仓库根目录执行：

```bash
uv sync --all-packages --locked
uv run --package py-agent-backend uvicorn py_agent_backend.main:app --reload --host 127.0.0.1 --port 5100
```

- 交互式 API 文档：http://127.0.0.1:5100/docs
- OpenAPI 契约：http://127.0.0.1:5100/openapi.json
- 验证命令和学习路线见根目录 [README](../../README.md)。

新增运行时依赖使用 `uv add --package py-agent-backend <包名>`，并提交根目录的 `uv.lock`。
学习示例、业务模块和测试按实际练习逐步增加；有独立领域或数据持久化需求时再拆分路由、服务和存储层。

安装根目录 Node.js 依赖后，可用 `pnpm dev:backend` 单独启动后端，或用 `pnpm dev` 同时启动前后端。
统一启动命令仅监听 `packages/backend/src` 的修改，Ctrl+C 会停止两端服务。
