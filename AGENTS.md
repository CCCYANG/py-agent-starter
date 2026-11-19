# Project guide

## 项目目标与结构

- 这是以后端学习为主的 monorepo，前端用于展示后端产出。
- `openspec/` 保存规格、项目上下文和变更；`packages/` 保存应用与独立包。
- 当前后端：Python 3.12、uv workspace、FastAPI、`src/py_agent_backend`。
- 当前前端：Vue 3、Vite、TypeScript、Tailwind CSS 4、vue-i18n，支持中英文与深浅色。
- pnpm workspace 管理 frontend 和 core-ui，uv workspace 仅管理 Python 包。
- core-ui 当前等于 reka-ui，仅直接导出上游 API；没有明确需求不得添加包装组件或修改 props/events/slots。
- 后续公共组件可按 shadcn 方式维护源码；应用主题、翻译和显示偏好保留在 frontend。
- 学习路线和当前已实现范围见 `README.md`，不要将规划内容描述为已实现。

## 变更约束

- 修改前查清定义、调用点、配置和测试；数据异常须追溯上游来源与持久化层。
- 保持最小实现，不顺手重构相邻代码，不提前引入通用抽象、数据库或 AI 框架。
- 输入在边界验证；新增 I/O 设置明确超时；异常不得静默吞掉或用假成功掩盖。
- 避免循环内 I/O；状态变更考虑幂等性和并发；访问数据必须限定授权范围。
- 不提交密钥、真实用户数据、向量索引或本地数据库；日志不得包含敏感信息。
- 新能力先明确可验证行为；多步骤任务给出简短计划；修复缺陷时添加复现测试。
- 用户要求仅调查时，不修改代码；执行阶段完成相关调用方、测试和文档的全部必要调整。
- OpenSpec 文档使用中文，保留解析所需的英文结构标题和 SHALL/MUST 关键字。

## 验证

根目录 `pnpm dev` 同时启动前后端；单独启动使用 `pnpm dev:frontend` / `pnpm dev:backend`。
开发端口固定为后端 5100、前端 5200；端口占用时直接报错，不自动换端口。
前端开发服务监听 0.0.0.0，支持本机回环和局域网 IP 访问。
启动前安装两端依赖，统一启动脚本不隐式同步 Python 环境。

在根目录执行，依赖变更后先更新 `uv.lock`：

```bash
uv sync --all-packages --locked
uv run --locked ruff check .
uv run --locked ruff format --check .
uv run --locked mypy
uv run --locked pytest
uv build --package py-agent-backend
openspec validate --all --strict --no-interactive
```

前端依赖变更后更新 `pnpm-lock.yaml`。在根目录执行：

```bash
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm test
```

`pnpm test` 包含两个 Node.js 包及测试代码的类型检查、生产构建和浏览器测试。

交付时明确已完成内容、实际运行的检查及尚未验证的外部条件。
