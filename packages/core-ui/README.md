# Core UI

`@py-agent/core-ui` 当前等于 `reka-ui`：入口仅执行 `export * from 'reka-ui'`，原样透传上游组件、组合函数和类型，不改变 props、events、slots 或可访问性行为。

这是 monorepo 内部源码包，由消费端 Vite 编译，不独立发布或生成 dist。
前端统一从 `@py-agent/core-ui` 导入 Reka API；Vue 使用 peer dependency，避免独立运行时。

后续有明确的公共组件需求时，可以按 shadcn 的源码归属方式，把基于 Reka 的组件源码放入此包并维护。
目前不运行 shadcn CLI、不预置包装组件、变体系统或工具函数。
应用级 Tailwind 样式、主题和多语言属于 frontend，不在此包添加全局副作用。
