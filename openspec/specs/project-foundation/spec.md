# Project Foundation

## Purpose

定义后端学习 monorepo 的初始目录、可运行后端及验证基线。该基线帮助开发者从可复现的 Python 环境开始学习，明确前后端职责，并为后续 SQL、RAG 和 Agent 实践提供可持续验证的项目起点。

## Requirements

### Requirement: GitHub repository
项目 SHALL 使用 GitHub 仓库 `CCCYANG/py-agent-starter` 托管代码，默认分支为 `main`。
远程 `origin` SHALL 使用 `git@github.com:CCCYANG/py-agent-starter.git`。

#### Scenario: Clone the initialized project
- **WHEN** 开发者通过仓库 SSH 地址克隆项目并按 README 安装锁定依赖
- **THEN** 可以通过根目录 `pnpm dev` 启动前后端
- **AND** 推送和拉取请求触发 GitHub Actions 检查，代码托管不代表服务已部署

### Requirement: Monorepo boundaries
项目 SHALL 使用根目录 `openspec/` 管理规格与变更，使用 `packages/` 管理实现。
实现目录 SHALL 包含 `packages/backend/`、`packages/frontend/` 和 `packages/core-ui/`。

#### Scenario: Inspect the initial repository
- **WHEN** 开发者查看仓库结构
- **THEN** 后端包含可安装的 Python 包和测试，前端包含可运行的 Vue 3 应用
- **AND** core-ui 原样导出 reka-ui，后续 AI 框架不作为初始化依赖

### Requirement: Reproducible Python workspace
项目 SHALL 使用 Python 3.12 和 uv workspace，以根目录 `uv.lock` 锁定依赖。

#### Scenario: Install from a clean checkout
- **WHEN** 开发者在已安装 uv 的环境执行 `uv sync --all-packages --locked`
- **THEN** 后端成员包及开发工具安装到仓库虚拟环境
- **AND** 不修改已提交的依赖锁文件

### Requirement: Backend liveness endpoint
后端 SHALL 提供不访问外部依赖的 `GET /health` 存活检查。

#### Scenario: Request liveness
- **WHEN** 客户端请求 `GET /health`
- **THEN** 返回 HTTP 200 和 JSON `{"status":"ok"}`
- **AND** 该结果仅表示应用存活，不声明数据库或模型服务可用

### Requirement: Verification baseline
项目 SHALL 提供自动化 HTTP 测试、格式检查、静态检查、类型检查和 Python 包构建。
GitHub Actions SHALL 在推送和拉取请求时执行这些后端检查。

#### Scenario: Validate a backend change
- **WHEN** 在已同步依赖的仓库执行 README 中的验证命令
- **THEN** HTTP 测试验证公开接口契约，静态和类型检查通过，后端构建出 wheel 与 sdist

### Requirement: Learning scope remains explicit
文档 SHALL 区分当前可运行基线与 Python 基础、SQL、RAG、Embedding 和 Agent 框架的后续学习计划。

#### Scenario: Read the roadmap
- **WHEN** 开发者查看学习路线
- **THEN** 能确认本次仅实现项目基线，后续能力依照独立学习目标逐步增加

### Requirement: Unified development startup
项目 SHALL 提供根目录 `pnpm dev` 同时启动前后端，前提是已安装两端锁定依赖。
前端 SHALL 监听 0.0.0.0:5200，支持回环和局域网 IP 访问；后端 SHALL 使用 127.0.0.1:5100，并支持开发热更新。

#### Scenario: Start and stop both services
- **WHEN** 开发者运行 `pnpm dev`
- **THEN** 前后端同时启动且日志标明服务名称
- **AND** 前端页面可通过 http://127.0.0.1:5200 访问，后端文档可通过 http://127.0.0.1:5100/docs 访问
- **AND** 按 Ctrl+C 会停止两个服务及其子进程

#### Scenario: A service fails to start
- **WHEN** 任一服务启动失败，例如指定端口被占用
- **THEN** 命令以失败状态退出并停止另一端，不自动换端口或留下运行中的服务

#### Scenario: Access the frontend through a LAN address
- **WHEN** 前端服务已启动，客户端通过可达的本机局域网 IP 和端口 5200 请求页面
- **THEN** 前端正常响应，且回环地址 127.0.0.1:5200 仍可访问

#### Scenario: Start one service
- **WHEN** 开发者运行 `pnpm dev:frontend` 或 `pnpm dev:backend`
- **THEN** 仅启动指定服务，后端只监视自身源码目录的改动
