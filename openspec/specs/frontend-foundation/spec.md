# Frontend Foundation

## Purpose

定义用于展示后端学习产出的前端基础环境、中英文及深浅色切换行为，以及 core-ui 与 reka-ui 的严格边界。保持初始化实现精简，为有明确需求后的共享组件源码维护提供位置。

## Requirements

### Requirement: Frontend workspace
前端 SHALL 使用 Vue 3、Vite、TypeScript、Tailwind CSS 和 vue-i18n。
项目 SHALL 使用 pnpm workspace 管理 frontend 和 core-ui，独立于 Python uv workspace。

#### Scenario: Build the workspace
- **WHEN** 开发者执行锁定安装与 `pnpm build`
- **THEN** 两个包及测试代码通过类型检查，前端生成生产静态产物

### Requirement: Transparent Reka exports
core-ui SHALL 仅通过 `export * from 'reka-ui'` 暴露上游 API。
没有明确组件需求时，core-ui MUST NOT 增加组件包装、样式副作用或改变 props、events、slots。

#### Scenario: Consume UI primitives
- **WHEN** 前端从 `@py-agent/core-ui` 导入组件
- **THEN** 使用原始 Reka 组件及其类型、可访问性和键盘交互

### Requirement: Language switching
前端 SHALL 支持 zh-CN 与 en-US，默认中文，切换时同步页面文案、标题和 HTML lang。

#### Scenario: Switch to English and back
- **WHEN** 用户选择 English 或中文
- **THEN** 当前页面立即显示对应文案，选择在刷新后保持

### Requirement: Theme switching
前端 SHALL 支持浅色与深色，首次访问采用系统颜色偏好，用户手动选择优先。

#### Scenario: Change appearance
- **WHEN** 用户通过鼠标或键盘操作颜色模式开关
- **THEN** 页面实际颜色随之变化，并在刷新后保持

### Requirement: Visible preference failures
前端 SHALL 校验持久化的语言和主题类型，存储不可用或数据异常时显示提示。

#### Scenario: Storage is blocked or invalid
- **WHEN** 浏览器无法访问存储或保存的偏好不符合结构
- **THEN** 页面提示偏好未能读取或保存，当前会话仍能切换主题和语言

### Requirement: Responsive and verified controls
项目 SHALL 提供覆盖主题、语言、持久化、键盘和窄屏交互的浏览器测试。

#### Scenario: Use controls on mobile
- **WHEN** 用户在 375px 宽度的页面切换语言和主题
- **THEN** 控件可操作且页面没有横向溢出
