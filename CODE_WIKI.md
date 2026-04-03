# Code Wiki

## 项目概览

基于Astro框架的静态博客网站，使用Svelte和Tailwind CSS实现现代化前端界面。

**核心功能**：
- 响应式设计
- 多语言支持
- 明暗模式切换
- 代码高亮
- Giscus评论系统
- Astro Content Collections内容管理

## 目录结构

```
├── public/        # 静态资源
├── scripts/       # 辅助脚本
├── src/
│   ├── components/ # 组件
│   ├── content/    # 文章内容
│   ├── i18n/       # 国际化
│   ├── layouts/    # 布局
│   ├── pages/      # 页面路由
│   ├── plugins/    # 插件
│   ├── utils/      # 工具函数
│   ├── config.ts   # 项目配置
│   └── content.config.ts # 内容配置
├── astro.config.mjs # Astro配置
└── package.json    # 依赖管理
```

## 核心功能

### 1. 页面系统
- **首页**：文章列表 + 分页
- **文章页**：单篇文章详情
- **归档页**：按时间排序的文章列表
- **关于页**：个人信息展示

### 2. 内容管理
- 使用Markdown格式编写文章
- 支持文章元数据（标题、日期、标签、分类等）
- 草稿功能：生产环境不显示草稿文章

### 3. 组件系统
- **控制组件**：分页、回到顶部
- **小部件**：侧边栏、标签云、分类列表
- **功能组件**：搜索、主题切换

### 4. 国际化
- 支持多语言（中文、英文等）
- 基于键值的翻译系统

### 5. 主题系统
- 明暗模式切换
- 可配置主题色和背景

## 关键函数

### 内容处理
- **getSortedPosts**：获取排序后的文章列表，包含前后文章链接
- **getTagList**：获取标签列表及使用次数
- **getCategoryList**：获取分类列表及文章数量

### 配置管理
- **siteConfig**：网站基本配置（标题、语言、主题等）
- **navBarConfig**：导航栏配置
- **profileConfig**：个人资料配置

### 工具函数
- **getSlugFromId**：从文章ID生成URL路径
- **getCategoryUrl**：生成分类URL

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Astro | 6.1.3 | 静态站点生成 |
| Svelte | 5.55.1 | 组件框架 |
| Tailwind CSS | 3.4.19 | CSS框架 |
| TypeScript | 5.9.3 | 类型安全 |
| Expressive Code | 0.41.7 | 代码高亮 |
| Giscus | - | 评论系统 |
| Pagefind | 1.4.0 | 静态搜索 |

## 开发流程

1. **安装依赖**：`pnpm install`
2. **开发服务器**：`pnpm dev`
3. **类型检查**：`pnpm type-check`
4. **构建**：`pnpm build`
5. **预览**：`pnpm preview`

## 部署方式

- **Vercel**：自动部署
- **Netlify**：Git仓库自动部署
- **GitHub Pages**：通过Actions部署
- **其他静态托管**：部署`dist`目录

## 关键文件

- **src/pages/[...page].astro**：首页和分页
- **src/pages/posts/[...slug].astro**：文章详情
- **src/components/PostPage.astro**：文章列表
- **src/utils/content-utils.ts**：内容处理工具
- **src/config.ts**：网站配置
- **src/content.config.ts**：内容配置

## 功能扩展

- **添加页面**：在`src/pages/`创建新文件
- **添加文章**：在`src/content/posts/`创建Markdown文件
- **添加语言**：在`src/i18n/languages/`创建语言文件

## 常见问题

- **文章不显示**：检查`draft`属性是否为`false`
- **图片不显示**：确保路径正确，静态图片放`public/`
- **评论不工作**：检查Giscus配置
- **搜索不工作**：确保构建时运行`pagefind`

## 性能优化

- 图片优化：使用适当大小和格式
- 代码分割：利用Astro自动分割
- 缓存策略：合理设置静态资源缓存
- 减少依赖：只使用必要的包

## 总结

现代化静态博客网站，使用Astro、Svelte和Tailwind CSS构建，具有响应式设计、多语言支持、主题切换等功能。项目结构清晰，配置灵活，易于扩展和维护，适合作为个人技术博客或内容展示网站。