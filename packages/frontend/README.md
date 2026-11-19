# Frontend

前端负责展示后端学习产出，例如 API 结果、并发任务进度、检索结果和 Agent 执行过程。

技术栈：Vue 3、TypeScript、Vite、Tailwind CSS 4、vue-i18n。
UI 原语统一从 `@py-agent/core-ui` 导入，该包当前原样导出 reka-ui。

在根目录运行 `pnpm install --frozen-lockfile`，然后运行 `pnpm dev:frontend` 单独启动前端。
Vite 监听 `0.0.0.0:5200`，可通过 http://127.0.0.1:5200 或 `http://<本机局域网 IP>:5200` 访问。
监听地址和端口在 `vite.config.ts` 统一配置；端口占用时直接报错。
完成 Python 依赖安装后，可用根目录的 `pnpm dev` 同时启动前后端，详见根目录 README。
执行 `pnpm build` 进行类型检查和生产构建，产物位于 `packages/frontend/dist/`。
执行 `pnpm exec playwright install chromium` 安装测试浏览器，然后运行 `pnpm test` 验证生产构建的浏览器交互。

当前页面展示学习路线，不请求后端或声称已有 RAG、Agent 功能。
支持中文（zh-CN）和英文（en-US），切换时同步文案、页面标题和 HTML lang。
首次访问默认中文，颜色模式读取系统偏好；用户可手动切换深浅色。
两项偏好保存在 localStorage，刷新后恢复。存储被禁用或值损坏时显示提示，本次会话仍可切换。

Tailwind 通过 `@tailwindcss/vite` 接入，CSS 变量定义亮暗主题，`.dark` 控制颜色模式。
当前样式属于应用；有明确通用组件需求后再按 shadcn 的源码维护方式增加 core-ui 组件。

约定：

- 通过后端 API 获取结果，不在前端重复实现后端业务逻辑。
- 数据库凭据、模型服务密钥和其他服务端秘密不得进入浏览器代码。
- pnpm workspace 管理 frontend 和 core-ui，独立于 Python uv workspace。
- 不预装路由、状态管理库或业务组件；后端产出有展示需求时再扩展。
