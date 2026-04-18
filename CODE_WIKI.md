# SSJ-Blog 技术架构文档

## 项目概述

SSJ-Blog 是基于 Astro 6.x 框架构建的现代化静态博客系统，采用 Fuwari 主题，结合 Svelte 5.x 组件框架与 Tailwind CSS 3.x 实现响应式界面设计。

### 技术栈版本

| 技术 | 版本 | 用途 |
|------|------|------|
| Astro | 6.1.4 | 静态站点生成框架 |
| Svelte | 5.55.1 | 交互式组件框架 |
| Tailwind CSS | 3.4.19 | 原子化 CSS 框架 |
| TypeScript | 5.9.3 | 类型安全 |
| Zod | 4.3.6 | Schema 验证 |
| Expressive Code | 0.41.7 | 代码高亮 |
| Pagefind | 1.5.2 | 静态全文搜索 |
| Swup | 1.8.0 | 页面过渡动画 |
| PhotoSwipe | 5.4.4 | 图片灯箱 |
| KaTeX | 0.16.45 | 数学公式渲染 |
| Giscus | - | GitHub Discussions 评论 |

---

## 目录结构

```
d:\SSJ\Websites\SSJ-Blog\
├── public/                     # 静态资源目录
│   ├── favicon/               # 网站图标
│   ├── sponsor/               # 赞助二维码图片
│   └── wallpaper/             # 背景壁纸
├── scripts/                    # 辅助脚本
│   └── new-post.js            # 新文章生成脚本
├── src/
│   ├── components/            # 组件目录
│   │   ├── control/           # 控制组件
│   │   │   ├── BackToTop.astro
│   │   │   ├── ButtonLink.astro
│   │   │   ├── ButtonTag.astro
│   │   │   └── Pagination.astro
│   │   ├── misc/              # 杂项组件
│   │   │   ├── ImageWrapper.astro
│   │   │   ├── License.astro
│   │   │   └── Markdown.astro
│   │   ├── widget/            # 小部件组件
│   │   │   ├── Categories.astro
│   │   │   ├── DisplaySettings.svelte
│   │   │   ├── Giscus.astro
│   │   │   ├── NavMenuPanel.astro
│   │   │   ├── Profile.astro
│   │   │   ├── SideBar.astro
│   │   │   ├── Stats.astro
│   │   │   ├── TOC.astro
│   │   │   ├── Tags.astro
│   │   │   └── WidgetLayout.astro
│   │   ├── ArchivePanel.svelte  # 归档面板组件
│   │   ├── ConfigCarrier.astro  # 配置载体组件
│   │   ├── Footer.astro          # 页脚组件
│   │   ├── GlobalStyles.astro     # 全局样式组件
│   │   ├── LightDarkSwitch.svelte # 亮暗切换组件
│   │   ├── Navbar.astro          # 导航栏组件
│   │   ├── PostCard.astro        # 文章卡片组件
│   │   ├── PostMeta.astro        # 文章元数据组件
│   │   ├── PostPage.astro        # 文章页面组件
│   │   └── Search.svelte        # 搜索组件
│   ├── constants/             # 常量定义
│   │   ├── constants.ts       # 核心常量
│   │   ├── icon.ts            # 图标配置
│   │   └── link-presets.ts    # 导航链接预设
│   ├── content/               # 内容集合
│   │   ├── posts/             # 博客文章 (Markdown)
│   │   └── spec/              # 特殊页面内容
│   ├── data/                  # 数据文件
│   │   └── sponsors/          # 赞助者数据 (JSON)
│   ├── i18n/                  # 国际化
│   │   ├── i18nKey.ts         # 翻译键枚举
│   │   ├── translation.ts     # 翻译函数
│   │   └── languages/         # 语言文件
│   │       ├── en.ts
│   │       ├── zh_CN.ts
│   │       └── zh_TW.ts
│   ├── layouts/               # 布局组件
│   │   ├── Layout.astro       # 根布局
│   │   └── MainGridLayout.astro
│   ├── pages/                 # 页面路由
│   │   ├── [...page].astro    # 首页分页
│   │   ├── about.astro        # 关于页面
│   │   ├── archive.astro      # 归档页面
│   │   ├── sponsor.astro      # 赞助页面
│   │   └── posts/
│   │       └── [...slug].astro # 文章详情
│   ├── plugins/               # 自定义插件
│   │   ├── expressive-code/   # 代码高亮插件
│   │   │   ├── custom-copy-button.ts     # 自定义复制按钮插件
│   │   │   └── language-badge.ts         # 语言徽章插件
│   │   ├── rehype-component-admonition.mjs   # 引导插件
│   │   ├── rehype-component-github-card.mjs  # GitHub 卡片插件
│   │   ├── remark-directive-rehype.js        # 代码指令插件
│   │   ├── remark-excerpt.js                 # 摘要插件
│   │   ├── remark-excerpt.js                 # 摘要插件
│   │   ├── remark-github-admonitions.mjs     # GitHub 引导插件
│   │   └── remark-reading-time.mjs           # 阅读时间插件
│   ├── types/                 # 类型定义
│   │   ├── config.ts          # 配置类型
│   │   └── data.ts            # 数据类型
│   ├── utils/                 # 工具函数
│   │   ├── content-utils.ts   # 内容处理
│   │   ├── date-utils.ts      # 日期处理
│   │   ├── setting-utils.ts   # 设置管理
│   │   └── url-utils.ts       # URL 处理
│   ├── config.ts              # 项目配置
│   └── content.config.ts      # 内容集合配置
├── astro.config.mjs           # Astro 配置
├── package.json               # 依赖管理
├── tsconfig.json              # TypeScript 配置
└── tailwind.config.mjs        # Tailwind 配置
```

---

## 核心配置系统

### config.ts 配置文件

**文件路径**: `src/config.ts`

**核心配置项**:

```typescript
// 网站基础配置
export const siteConfig: SiteConfig = {
  title: "Shenshijun's Blog",
  subtitle: "一个分享技术与生活的博客",
  lang: "zh_CN",
  themeColor: {
    hue: 250,           // 主题色色相值 (0-360)
    fixed: false,       // 是否禁用主题色选择器
  },
  banner: { ... },      // 横幅配置
  background: { ... },  // 背景配置
  toc: {                // 目录配置
    enable: true,
    depth: 3,
  },
  favicon: [ ... ],     // 图标配置
};

// 导航栏配置
export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Archive,
    LinkPreset.Sponsor,
    LinkPreset.About,
  ],
};

// 个人资料配置
export const profileConfig: ProfileConfig = {
  avatar: "https://q2.qlogo.cn/headimg_dl?dst_uin=1764341276&spec=0",
  name: "Shenshijun",
  bio: ["Explore. Dream. Discover.", "去探索、去梦想、去发现……"],
  links: [ ... ],
};

// 许可证配置
export const licenseConfig: LicenseConfig = {
  enable: true,
  name: "CC BY-NC-SA 4.0",
  url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

// Giscus 评论配置
export const giscusConfig: GiscusConfig = {
  enable: true,
  repo: "SSJ-ZYJ/SSJ-Blog",
  repoId: "R_kgDORhUVew",
  category: "Announcements",
  categoryId: "DIC_kwDORhUVe84C5eSI",
  mapping: "pathname",
  theme: "dark",
  lang: "zh-CN",
  loading: "lazy",
};
```

### content.config.ts 内容集合配置

**文件路径**: `src/content.config.ts`

**Schema 定义**:

```typescript
export const postsSchema = z.object({
  title: z.string(),
  published: z.date(),
  updated: z.date().optional(),
  draft: z.boolean().optional().default(false),
  description: z.string().optional().default(""),
  image: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  category: z.string().optional().nullable().default(""),
  lang: z.string().optional().default(""),
  prevTitle: z.string().default(""),
  prevSlug: z.string().default(""),
  nextTitle: z.string().default(""),
  nextSlug: z.string().default(""),
});

export const collections = {
  posts: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
    schema: postsSchema,
  }),
  spec: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/spec" }),
    schema: z.object({}),
  }),
};
```

---

## 页面路由系统

### 路由架构

| 路由文件 | URL 路径 | 功能描述 |
|----------|----------|----------|
| `[...page].astro` | `/`, `/page/2/`, `/page/3/` | 首页分页 |
| `posts/[...slug].astro` | `/posts/[slug]/` | 文章详情页 |
| `archive.astro` | `/archive/` | 归档页面 |
| `about.astro` | `/about/` | 关于页面 |
| `sponsor.astro` | `/sponsor/` | 赞助页面 |

### 首页分页实现

**文件**: `src/pages/[...page].astro`

```astro
---
import Pagination from "../components/control/Pagination.astro";
import PostPage from "../components/PostPage.astro";
import { PAGE_SIZE } from "../constants/constants";
import MainGridLayout from "../layouts/MainGridLayout.astro";
import { getSortedPosts } from "../utils/content-utils";

export const getStaticPaths = (async ({ paginate }) => {
  const allBlogPosts = await getSortedPosts();
  return paginate(allBlogPosts, { pageSize: PAGE_SIZE });
}) satisfies GetStaticPaths;

const { page } = Astro.props;
const len = page.data.length;
---

<MainGridLayout>
  <PostPage page={page}></PostPage>
  <Pagination class="mx-auto onload-animation" page={page} 
    style={`animation-delay: calc(var(--content-delay) + ${(len)*50}ms)`}>
  </Pagination>
</MainGridLayout>
```

**实现逻辑**:
1. 使用 Astro 的 `paginate` 函数自动生成分页路由
2. `PAGE_SIZE` 常量控制每页文章数量 (默认 8 篇)
3. 文章按发布日期降序排列
4. 分页组件支持动画延迟效果

### 文章详情页实现

**文件**: `src/pages/posts/[...slug].astro`

**核心功能**:
- 动态路由生成所有文章页面
- JSON-LD 结构化数据支持
- 字数统计与阅读时间计算
- 上一篇/下一篇导航
- Giscus 评论集成
- 许可证声明

```astro
---
export async function getStaticPaths() {
  const blogEntries = await getSortedPosts();
  return blogEntries.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content, headings, remarkPluginFrontmatter } = await render(entry);

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: entry.data.title,
  description: entry.data.description || entry.data.title,
  keywords: entry.data.tags,
  author: {
    "@type": "Person",
    name: profileConfig.name,
    url: Astro.site,
  },
  datePublished: formatDateToYYYYMMDD(entry.data.published),
  inLanguage: entry.data.lang?.replace("_", "-") || siteConfig.lang.replace("_", "-"),
};
---
```

### 赞助页面实现

**文件**: `src/pages/sponsor.astro`

**功能特性**:
- 支付宝/微信支付二维码展示
- 其他支持方式卡片
- 赞助者列表 (动态加载)
- 面包屑结构化数据
- 完整国际化支持

```astro
---
const sponsors = Object.values(
  import.meta.glob<Sponsor>("@/data/sponsors/*.json", {
    eager: true,
    import: "default",
  }),
);

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: i18n(I18nKey.home), item: Astro.site },
    { "@type": "ListItem", position: 2, name: i18n(I18nKey.sponsorTitle), 
      item: new URL("/sponsor/", Astro.site).toString() },
  ],
};
---
```

---

## 布局系统

### Layout.astro 根布局

**文件**: `src/layouts/Layout.astro`

**核心职责**:
1. HTML 文档结构定义
2. 全局 CSS 变量注入
3. 字体加载 (Noto Sans SC)
4. 主题初始化脚本
5. SEO 元标签配置
6. RSS 订阅链接

**全局 CSS 变量**:

```css
:root {
  --hue: 250;                    /* 主题色色相 */
  --page-width: 75rem;           /* 页面最大宽度 */
  --banner-height: 35vh;         /* 横幅高度 */
  --banner-height-extend: 30vh;  /* 横幅扩展高度 */
  --bg-src: url(...);            /* 背景图片 */
  --bg-opacity: 0.5;             /* 背景透明度 */
}
```

**主题初始化脚本**:

```javascript
// 强制暗色主题
document.documentElement.classList.add('dark');
localStorage.setItem('theme', 'dark');

// 应用主题色
const hue = localStorage.getItem('hue') || configHue;
document.documentElement.style.setProperty('--hue', hue);

// 计算横幅高度 (4px 对齐)
let offset = Math.floor(window.innerHeight * (BANNER_HEIGHT_EXTEND / 100));
offset = offset - offset % 4;
document.documentElement.style.setProperty('--banner-height-extend', `${offset}px`);
```

### MainGridLayout.astro 主网格布局

**文件**: `src/layouts/MainGridLayout.astro`

**布局结构**:

```
┌─────────────────────────────────────────────────────────┐
│                      Navbar (sticky)                     │
├─────────────────────────────────────────────────────────┤
│                     Banner (optional)                    │
├───────────────┬─────────────────────────┬───────────────┤
│               │                         │               │
│   SideBar     │      Main Content       │     TOC       │
│   (17.5rem)   │      (auto)             │   (var)       │
│               │                         │               │
├───────────────┴─────────────────────────┴───────────────┤
│                        Footer                            │
└─────────────────────────────────────────────────────────┘
```

**响应式断点**:
- `lg: 1024px` - 显示侧边栏和目录
- `2xl: 1536px` - 显示右侧目录
- `< lg` - 单列布局，侧边栏移至顶部

---

## 组件系统

### 组件分类

| 分类 | 目录 | 组件列表 |
|------|------|----------|
| 控制组件 | `control/` | BackToTop, ButtonLink, ButtonTag, Pagination |
| 杂项组件 | `misc/` | ImageWrapper, License, Markdown |
| 小部件 | `widget/` | Categories, Tags, Profile, Stats, TOC, Giscus |
| 交互组件 | 根目录 | Search.svelte, LightDarkSwitch.svelte, ArchivePanel.svelte |

### PostCard.astro 文章卡片

**文件**: `src/components/PostCard.astro`

**Props 接口**:

```typescript
interface Props {
  class?: string;
  entry: CollectionEntry<"posts">;
  title: string;
  url: string;
  published: Date;
  updated?: Date;
  tags: string[];
  category: string | null;
  image: string;
  description: string;
  draft: boolean;
  style: string;
}
```

**布局变体**:
- 有封面图: 左侧内容 + 右侧封面 (28% 宽度)
- 无封面图: 全宽内容 + 右侧箭头按钮

**关键样式类**:
- `text-90`: 90% 不透明度文本 (主题感知)
- `text-75`: 75% 不透明度文本
- `text-50`: 50% 不透明度文本
- `card-base`: 卡片基础样式
- `onload-animation`: 加载动画

### ArchivePanel.svelte 归档面板

**文件**: `src/components/ArchivePanel.svelte`

**功能**:
- 按年份分组文章
- 支持标签/分类筛选
- URL 参数解析 (`?tag=xxx&category=xxx`)

**数据结构**:

```typescript
interface Group {
  year: number;
  posts: Post[];
}

interface Post {
  slug: string;
  data: {
    title: string;
    tags: string[];
    category: string | null;
    published: Date;
  };
}
```

### ImageWrapper.astro 图片包装器

**文件**: `src/components/misc/ImageWrapper.astro`

**功能**:
- 自动图片优化
- 支持 `src/content/` 和 `public/` 目录
- 懒加载支持
- 主题色边框效果

**使用示例**:

```astro
<ImageWrapper 
  src="cover.jpg" 
  basePath="content/posts/my-post/"
  alt="文章封面"
  class="rounded-xl"
/>
```

---

## 国际化系统

### 架构设计

```
i18n/
├── i18nKey.ts      # 翻译键枚举定义
├── translation.ts  # 翻译函数实现
└── languages/
    ├── en.ts       # 英文翻译
    ├── zh_CN.ts    # 简体中文
    └── zh_TW.ts    # 繁体中文
```

### i18nKey.ts 翻译键定义

```typescript
enum I18nKey {
  home = "home",
  about = "about",
  archive = "archive",
  sponsor = "sponsor",
  search = "search",
  tags = "tags",
  categories = "categories",
  recentPosts = "recentPosts",
  comments = "comments",
  wordCount = "wordCount",
  wordsCount = "wordsCount",
  minuteCount = "minuteCount",
  minutesCount = "minutesCount",
  // ... 赞助页面相关
  sponsorTitle = "sponsorTitle",
  sponsorDescription = "sponsorDescription",
  sponsorIntro = "sponsorIntro",
  // ...
}
```

### translation.ts 翻译函数

```typescript
const map: { [key: string]: Translation } = {
  en: en,
  en_us: en,
  en_gb: en,
  zh_cn: zh_CN,
  zh_tw: zh_TW,
};

export function i18n(key: I18nKey): string {
  const lang = siteConfig.lang || "en";
  return getTranslation(lang)[key];
}
```

**使用方式**:

```astro
<h1>{i18n(I18nKey.archive)}</h1>
```

---

## 插件系统

### remark-reading-time.mjs 阅读时间计算

**文件**: `src/plugins/remark-reading-time.mjs`

**实现**:

```javascript
import { toString } from "mdast-util-to-string";
import getReadingTime from "reading-time";

const WORDS_PER_MINUTE = 150;  // 中文阅读速度

export function remarkReadingTime() {
  return (tree, { data }) => {
    const textOnPage = toString(tree);
    const readingTime = getReadingTime(textOnPage, {
      wordsPerMinute: WORDS_PER_MINUTE,
    });
    data.astro.frontmatter.minutes = Math.max(1, Math.round(readingTime.minutes));
    data.astro.frontmatter.words = readingTime.words;
  };
}
```

**输出**:
- `remarkPluginFrontmatter.minutes`: 阅读分钟数
- `remarkPluginFrontmatter.words`: 字数

### rehype-component-admonition.mjs 提示框组件

**支持的提示类型**:
- `note` - 笔记
- `tip` - 提示
- `important` - 重要
- `warning` - 警告
- `caution` - 注意
- `info` - 信息

**Markdown 语法**:

```markdown
:::tip
这是一个提示
:::
```

### expressive-code 插件

**custom-copy-button.ts**: 自定义复制按钮样式
**language-badge.ts**: 代码块语言标签显示

---

## 内容管理

### 文章 Frontmatter

```yaml
---
title: 文章标题
published: 2024-01-01
updated: 2024-01-15
draft: false
description: 文章描述
image: cover.jpg
tags: [tag1, tag2]
category: 分类名称
lang: zh_CN
---
```

### 内容工具函数

**文件**: `src/utils/content-utils.ts`

**核心函数**:

| 函数 | 返回类型 | 描述 |
|------|----------|------|
| `getSortedPosts()` | `PostWithSlug[]` | 获取排序后的文章列表 (含前后导航) |
| `getSortedPostsList()` | `PostForList[]` | 获取文章列表 (不含正文) |
| `getTagList()` | `Tag[]` | 获取标签列表及计数 |
| `getCategoryList()` | `Category[]` | 获取分类列表及计数 |

**草稿处理**:

```typescript
const allBlogPosts = await getCollection("posts", ({ data }) => {
  return import.meta.env.PROD ? data.draft !== true : true;
});
```

---

## 样式系统

### Tailwind CSS 配置

**自定义工具类**:

```css
/* 主题感知文本颜色 */
.text-90 { color: rgba(0, 0, 0, 0.9); }
.dark .text-90 { color: rgba(255, 255, 255, 0.9); }

.text-75 { color: rgba(0, 0, 0, 0.75); }
.dark .text-75 { color: rgba(255, 255, 255, 0.75); }

.text-50 { color: rgba(0, 0, 0, 0.5); }
.dark .text-50 { color: rgba(255, 255, 255, 0.5); }

/* 卡片基础样式 */
.card-base {
  background: var(--card-bg);
  border-radius: var(--radius-large);
  backdrop-filter: blur(12px);
}
```

### CSS 变量

```css
:root {
  --primary: oklch(0.75 0.14 var(--hue));
  --card-bg: oklch(1 0 var(--hue));
  --page-bg: oklch(0.98 0.01 var(--hue));
  --line-divider: oklch(0.9 0.02 var(--hue));
  --codeblock-bg: oklch(0.15 0.02 var(--hue));
}

.dark {
  --card-bg: oklch(0.15 0.02 var(--hue));
  --page-bg: oklch(0.1 0.02 var(--hue));
}
```

---

## 页面过渡动画

### Swup 配置

**文件**: `astro.config.mjs`

```javascript
swup({
  theme: false,
  animationClass: "transition-swup-",
  containers: ["main", "#toc-container"],
  smoothScrolling: true,
  cache: true,
  preload: true,
  accessibility: true,
  updateHead: true,
  updateBodyClass: false,
  globalInstance: true,
})
```

### 动画钩子

```javascript
// 链接点击时
window.swup.hooks.on('link:click', (event) => {
  // 防止同页面导航
  if (pathsEqual(currentUrl, targetUrl)) return false;
  // 隐藏导航栏
  navbar.classList.add('navbar-hidden');
});

// 页面视图更新后
window.swup.hooks.on('page:view', () => {
  // 重新初始化 PhotoSwipe
  createPhotoSwipe();
  // 重新初始化目录
  tocElements.forEach(el => el.init());
});
```

---

## 搜索功能

### Pagefind 集成

**构建命令**:

```json
{
  "build": "astro build && pagefind --site dist"
}
```

**搜索索引配置**:

```html
<div data-pagefind-body data-pagefind-weight="10" data-pagefind-meta="title">
  {entry.data.title}
</div>
```

---

## 评论系统

### Giscus 配置

**文件**: `src/components/widget/Giscus.astro`

**Props**:

```typescript
interface GiscusConfig {
  enable: boolean;
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  mapping: "pathname" | "url" | "title";
  theme: string;
  lang: string;
  loading: "lazy" | "eager";
}
```

---

## 类型定义

### config.ts 类型

```typescript
export type SiteConfig = {
  title: string;
  subtitle: string;
  lang: "en" | "zh_CN" | "zh_TW" | "ja" | "ko" | ...;
  themeColor: { hue: number; fixed: boolean; };
  banner: { enable: boolean; src: string; position?: string; credit: {...}; };
  background?: BackgroundConfig;
  toc: { enable: boolean; depth: 1 | 2 | 3; };
  favicon: Favicon[];
};

export enum LinkPreset {
  Home = 0,
  Archive = 1,
  About = 2,
  Sponsor = 3,
}

export type NavBarConfig = {
  links: (NavBarLink | LinkPreset)[];
};
```

### data.ts 类型

```typescript
export type Sponsor = {
  name: string;
  avatar?: string;
  date: string;
  amount?: string;
  message?: string;
};
```

---

## 开发命令

| 命令 | 功能 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 + Pagefind 索引 |
| `pnpm preview` | 预览构建结果 |
| `pnpm type-check` | TypeScript 类型检查 |
| `pnpm lint` | Biome 代码检查与修复 |
| `pnpm new-post` | 创建新文章 |

---

## 部署配置

### astro.config.mjs 关键配置

```javascript
export default defineConfig({
  site: "https://blog.shenshijun.space/",
  base: "/",
  trailingSlash: "always",
  integrations: [
    tailwind({ nesting: true }),
    swup({ ... }),
    icon({ include: { "fa6-brands": ["*"], "material-symbols": ["*"] } }),
    expressiveCode({ ... }),
    svelte(),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [remarkGfm, remarkMath, remarkReadingTime, ...],
    rehypePlugins: [rehypeKatex, rehypeSlug, rehypeComponents, ...],
  },
  vite: { ... },
});
```

---

## 最近修改记录

### 赞助页面新增

**修改文件**:
- `src/pages/sponsor.astro` - 新建赞助页面
- `src/constants/link-presets.ts` - 添加 Sponsor 导航预设
- `src/i18n/i18nKey.ts` - 添加 16 个翻译键
- `src/i18n/languages/*.ts` - 添加三语翻译
- `src/types/data.ts` - 添加 Sponsor 类型

### 页面标题图标统一

**修改文件**:
- `src/pages/archive.astro` - 添加标题图标和结构化数据
- `src/pages/about.astro` - 添加标题图标和结构化数据
- `src/components/ArchivePanel.svelte` - 移除内部 card-base

### 字体配置

**当前字体**:
- 正文: Noto Sans SC
- 文章内容: 霞鹜文楷 (LXGW WenKai)
- 代码: Maple Mono CN

---

## 性能优化建议

1. **图片优化**: 使用 WebP 格式，配合 ImageWrapper 组件自动优化
2. **代码分割**: Astro 自动按页面分割，无需额外配置
3. **字体子集化**: 仅加载需要的字符集
4. **缓存策略**: 静态资源设置长期缓存
5. **预加载**: Swup 已启用 `preload: true`

---

## 故障排查

| 问题 | 解决方案 |
|------|----------|
| 文章不显示 | 检查 `draft: false`，确保日期格式正确 |
| 图片 404 | 检查路径，封面图使用相对路径，静态资源放 `public/` |
| 评论不工作 | 检查 Giscus 配置，确保仓库为公开 |
| 搜索无结果 | 确保运行 `pnpm build` 生成 Pagefind 索引 |
| 动画异常 | 清除 `.astro` 缓存目录，重启开发服务器 |
| 类型错误 | 运行 `pnpm type-check` 查看详细错误 |
