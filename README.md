# 极简风个人网站（Next.js + TypeScript）

一个仅包含 **Blog / Notes / Resume** 的静态内容站点。

## 1. 本地启动

### 使用 pnpm

```bash
pnpm install
pnpm dev
```

浏览器访问：`http://localhost:3000`

### npm 等价命令

```bash
npm install
npm run dev
```

## 2. 构建与生产运行

```bash
pnpm build
pnpm start
```

## 3. 内容写作方式

本项目无后端、无数据库、无登录系统，所有内容都来自本地文件。

### 3.1 新增 Blog 文章

路径：`content/blog/<slug>.mdx`

```md
---
title: "你的文章标题"
date: "2026-02-22"
tags: ["tag1", "tag2"]
summary: "一句话摘要"
draft: false
---

正文内容（MDX）
```

### 3.2 新增 Notes 笔记

路径：`content/notes/<slug>.mdx`

```md
---
title: "你的笔记标题"
date: "2026-02-22"
tags: ["study", "note"]
summary: "一句话摘要"
draft: false
---

正文内容（MDX）
```

### 3.3 新增 Project（预留说明）

当前版本未启用 Projects 页面。若你后续要扩展，可按同一 frontmatter 规范在 `content/projects/*.mdx` 新增内容，再补对应路由。

### 3.4 Frontmatter 约定

```md
---
title: "字符串"
date: "YYYY-MM-DD"
tags: ["字符串", "字符串"]
summary: "字符串"
draft: false
---
```

规则：
- 列表按 `date` 倒序。
- `draft: true` 的内容不会出现在列表或详情页。

### 3.5 简历内容

路径：`content/resume/resume.yml`

修改 YAML 后刷新 `/resume` 即可看到更新。

## 4. MDX 能力

支持标题、段落、列表、代码块，以及自定义组件 `Callout`：

```mdx
<Callout type="info" title="提示标题">
  这里是内容
</Callout>
```

`type` 可选：`info | warning | success`

## 5. 主题与布局设置

- 太阳/月亮图标：切换白天/暗夜模式。
- 齿轮图标：调整页面宽度（Narrow / Standard / Wide）。
- 两项设置都会持久化到 `localStorage`。

## 6. 目录结构

```text
app/
  blog/
    [slug]/page.tsx
    page.tsx
  notes/
    [slug]/page.tsx
    page.tsx
  resume/
    page.tsx
  globals.css
  layout.tsx
  page.tsx
  robots.ts
components/
  Callout.tsx
  MDXContent.tsx
  SiteHeader.tsx
  ThemeToggle.tsx
  WidthSettings.tsx
content/
  blog/
  notes/
  resume/
    resume.yml
lib/
  content.ts
  date.ts
  resume.ts
  site.ts
  types.ts
```
