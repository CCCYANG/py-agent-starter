# Python Agent Starter

以后端服务学习为主的 monorepo。前端用于展示后端产出，学习过程通过 OpenSpec 记录目标、行为和变更。

仓库：[CCCYANG/py-agent-starter](https://github.com/CCCYANG/py-agent-starter) · 默认分支：`main`

## 当前状态

已初始化 OpenSpec、Python uv workspace、最小 FastAPI 服务，以及 Vue 3 + Vite 前端。
前端使用 Tailwind CSS 4、vue-i18n 和 reka-ui，支持中英文、深浅色切换及偏好保存。
`core-ui` 当前原样导出 reka-ui；按需采用 shadcn 的组件源码维护方式，不提前添加二次封装。
SQL、RAG、Embedding 和 Agent 框架属于后续学习内容，尚未实现。

```text
py-agent-starter/
├── openspec/
│   ├── config.yaml         # 项目背景与规格约定
│   ├── specs/              # 当前能力基线
│   └── changes/            # 进行中的变更与 archive/
├── packages/
│   ├── backend/
│   │   ├── pyproject.toml
│   │   ├── src/py_agent_backend/
│   │   └── tests/
│   ├── frontend/           # Vue 3 + Vite + Tailwind + vue-i18n
│   └── core-ui/            # 当前原样导出 reka-ui
├── .agents/skills/         # OpenSpec 生成的 Codex 技能
├── .github/workflows/      # GitHub Actions
├── AGENTS.md
├── package.json            # pnpm 命令入口
├── pnpm-workspace.yaml     # frontend 和 core-ui
├── pnpm-lock.yaml          # Node.js 依赖锁文件
├── pyproject.toml          # Python workspace 和统一开发工具配置
└── uv.lock                 # Python 依赖锁文件
```

## 快速启动

环境：uv、Python 3.12、Node.js 22.22.2（见 `.nvmrc`）和 pnpm 10.33.4。
根目录 `.python-version` 固定 Python 小版本，uv 可按需下载对应解释器。

首次使用，克隆仓库并安装依赖（已在本地仓库中可跳过前两行）：

```bash
git clone git@github.com:CCCYANG/py-agent-starter.git
cd py-agent-starter
npm install --global pnpm@10.33.4
pnpm install --frozen-lockfile
uv sync --all-packages --locked
```

以后只需一条命令，同时启动前后端并启用热更新：

```bash
pnpm dev
```

- 前端：http://127.0.0.1:5200
- 前端局域网访问：`http://<本机局域网 IP>:5200`；Vite 监听 `0.0.0.0`，允许同一局域网设备连接。
- 后端 API 文档：http://127.0.0.1:5100/docs
- 后端存活检查：http://127.0.0.1:5100/health，返回 `{"status":"ok"}`。

日志按 backend/frontend 区分，按 Ctrl+C 同时停止两端；任一服务退出也会停止另一端。
端口占用时直接报错，不自动换端口。后端仅监听自身源码目录的修改。
启动命令使用已安装的 Python 环境，不隐式同步依赖；依赖更新后重新执行上述安装命令。
只启动一端时使用 `pnpm dev:frontend` 或 `pnpm dev:backend`。

前端初始语言为中文，颜色模式跟随首次访问时的系统设置。
页面右上角可切换中文/英文和深色/浅色，选择保存在浏览器本地，刷新后恢复。

## 开发与验证

```bash
uv run --locked ruff check .
uv run --locked ruff format --check .
uv run --locked mypy
uv run --locked pytest
uv build --package py-agent-backend
openspec validate --all --strict --no-interactive
```

前端验证：

```bash
pnpm build
pnpm exec playwright install chromium
pnpm test
```

`pnpm build` 包含 core-ui、Vue 应用和测试代码的类型检查及 Vite 生产构建。
`pnpm test` 重新构建并对生产预览执行浏览器测试，覆盖主题、语言、刷新恢复、键盘、窄屏和存储异常。
Python 构建产物位于根目录 `dist/`，前端产物位于 `packages/frontend/dist/`，都不提交到 Git。
CI 分别执行后端检查和前端构建/浏览器测试；OpenSpec 校验当前在本地执行。
根目录是虚拟 workspace，不是可发布包；后端的运行依赖保存在其 `pyproject.toml` 中。
新增后端依赖使用 `uv add --package py-agent-backend <包名>`，新增共享开发工具使用 `uv add --dev <包名>`。
依赖变化后同时提交相关 `pyproject.toml` 和根目录 `uv.lock`，新环境用 `--locked` 安装。
新增独立 Python 包时，将其明确加入根目录 `tool.uv.workspace.members`。
pnpm workspace 管理 `frontend` 与 `core-ui`，不包含后端；新增前端依赖使用 `pnpm --filter @py-agent/frontend add <包名>`。
前端统一从 `@py-agent/core-ui` 导入 Reka API，该包当前只有原样导出入口，不增加组件封装。
JavaScript 依赖变更同时提交对应 `package.json` 和 `pnpm-lock.yaml`。

## OpenSpec 工作方式

本项目已通过官方 CLI 为 Codex 初始化，使用 `spec-driven` schema，文档默认中文。
在另一台机器安装相同 CLI：

```bash
npm install --global @fission-ai/openspec@2.1.0
openspec --version
openspec list
openspec list --specs
```

现有项目已包含配置，无需重复初始化。需要升级时先升级 CLI，再执行 `openspec update` 刷新生成的技能。

建议每个独立学习目标形成一个变更：

1. 在 Codex 使用 `openspec-propose` 技能，描述学习目标和可观察产出，生成提案、设计、规格与任务。
2. 审阅方案后使用 `openspec-apply-change` 实现，运行受影响的测试和检查。
3. 验证通过后使用 `openspec-archive-change` 归档，并同步正式规格。

Codex CLI/IDE 可使用 `$openspec-propose` 等技能名称；桌面端可从技能入口选择。
当前 `openspec/specs/project-foundation/spec.md` 记录初始化后的实际能力。

## 学习路线

| 阶段 | 内容 | 建议可验证产出 |
| --- | --- | --- |
| 1 | Python 基础、OOP、类型标注、模块和包管理 | 小型领域模型、包导入示例和单元测试 |
| 2 | 异步编程、并发编程 | asyncio、线程与进程的对比实验，覆盖超时和取消 |
| 3 | FastAPI、HTTP、输入校验与错误处理 | 可通过 API 文档和测试调用的服务接口 |
| 4 | SQL、关系建模、事务、索引与迁移 | 持久化业务示例及事务回滚测试 |
| 5 | 知识库、Embedding、向量检索、RAG | 文档摄取、切分、检索及可追溯的回答与评测 |
| 6 | Agent、工具调用、状态与工作流 | 逐步实践 Dify、LangChain、LangGraph、Deep Agents 并比较适用场景 |
| 7 | 前端展示与交付 | 展示检索结果、任务状态和 Agent 过程，补充运行部署方案 |

各阶段按实际需要扩充目录和依赖。前端展示也可穿插在对应后端阶段进行。
Dify 的运行环境和其他 Agent 框架依赖在进入对应学习阶段时单独确定。

## GitHub 与数据约定

Git 仓库使用 `main` 分支，远程 `origin` 为 `git@github.com:CCCYANG/py-agent-starter.git`。
推送和拉取请求触发前后端检查，结果见 [GitHub Actions](https://github.com/CCCYANG/py-agent-starter/actions)。
工作流使用只读仓库权限，依赖安装以 `uv.lock` 和 `pnpm-lock.yaml` 为准。
GitHub 用于代码托管和 CI。Python 后端的长期运行环境需要另行选择，推送代码不等于线上部署。

不要提交 `.env`、密钥、真实用户数据、向量索引或本地数据库。可再生成的本地学习数据放入被忽略的 `.data/`。
前端不持有模型密钥，外部模型调用由后端负责。新增外部 I/O 时明确超时和错误处理。

参考：[OpenSpec](https://github.com/Fission-AI/OpenSpec)、[uv workspace](https://docs.astral.sh/uv/concepts/projects/workspaces/)、[FastAPI](https://fastapi.tiangolo.com/)。
