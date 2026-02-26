# Theseus - 极简个人网站（Next.js + TypeScript）

Theseus 是一个基于本地文件驱动的个人站点模板，包含 3 个核心模块：`Blog`、`Notes`、`Resume`。

- 无数据库
- 无后端 API 依赖
- 无登录系统
- 内容即文件（`content/`）

## 1. 技术栈

- Framework: `Next.js 16` (App Router)
- Language: `TypeScript`
- Content Rendering: `next-mdx-remote` + MDX
- Content Source: 本地 Markdown/MDX + YAML
- Package Manager: 推荐 `pnpm`

## 2. 本地部署前置条件

### 2.1 必备软件

1. `Node.js`（建议 20 LTS 或更高）
2. `pnpm`（建议 9 或更高）
3. `Git`

检查版本：

```bash
node -v
pnpm -v
git --version
```

### 2.2 获取项目代码

```bash
git clone <your-repo-url>
cd Theseus
```

如果你已经在本地打开本项目，直接进入下一步即可。

## 3. 3 分钟本地启动

### 3.1 安装依赖

```bash
pnpm install
```

### 3.2 启动开发环境

```bash
pnpm dev
```

默认地址：`http://localhost:3000`

### 3.3 验证是否启动成功

打开浏览器访问首页后，检查：

1. 顶部导航存在 `Blog / Notes / Resume`
2. 能进入 `Blog`、`Notes` 列表页
3. `Resume` 页可加载 `public/resume/resume.pdf`（若文件存在）

## 4. 生产构建与运行

### 4.1 构建

```bash
pnpm build
```

### 4.2 生产模式启动

```bash
pnpm start
```

## 5. 代码质量检查

```bash
pnpm lint
pnpm typecheck
```

## 6. 项目目录说明

```text
app/                 # 路由与页面（App Router）
components/          # 可复用组件（包含 MDX 渲染组件）
content/
  blog/              # 博客正文（.md/.mdx）
  notes/             # 笔记正文（.md/.mdx）
  resume/resume.yml  # 简历结构化数据
public/resume/       # 简历 PDF 静态文件
lib/                 # 内容读取、日期格式化、站点配置等
scripts/import-md.mjs# Markdown 导入脚本
```

## 7. 如何写内容

### 7.1 新增 Blog 文章

路径：`content/blog/<slug>.mdx`

```md
---
title: "你的文章标题"
date: "2026-02-22"
tags: ["tag1", "tag2"]
draft: false
---

正文内容（MDX）
```

### 7.2 新增 Notes 笔记

路径：`content/notes/<slug>.mdx`

```md
---
title: "你的笔记标题"
date: "2026-02-22"
tags: ["study", "note"]
draft: false
---

正文内容（MDX）
```

### 7.3 Frontmatter 约定

```md
---
title: "字符串"
date: "YYYY-MM-DD"
tags: ["字符串", "字符串"]
draft: false
---
```

规则：

1. 列表按 `date` 倒序展示
2. `draft: true` 不会出现在列表和详情页

## 8. 使用导入脚本快速导入 Markdown

导入到 Blog：

```bash
pnpm import:md --file "<你的md文件路径>" --to blog
```

导入到 Notes：

```bash
pnpm import:md --file "<你的md文件路径>" --to notes
```

常用参数：

1. 指定 slug

```bash
pnpm import:md --file "<path>" --to blog --slug my-post
```

2. 覆盖同名文件

```bash
pnpm import:md --file "<path>" --to blog --force
```

说明：

- 支持 `--to posts`（自动映射到 `blog`）
- 自动读取源 Markdown frontmatter，缺失字段会补齐
- 输出到 `content/blog/*.mdx` 或 `content/notes/*.mdx`

## 9. Resume 配置

1. 结构化内容文件：`content/resume/resume.yml`
2. PDF 文件路径：`public/resume/resume.pdf`
3. 修改后刷新 `/resume` 页面即可查看

## 10. 常见问题（FAQ）

### 10.1 `pnpm dev` 启动失败

先执行：

```bash
pnpm install
```

再重试 `pnpm dev`。

### 10.2 3000 端口被占用

使用新端口启动：

```bash
pnpm dev -- --port 3001
```

### 10.3 `resume.pdf` 不显示

确认文件真实路径是：`public/resume/resume.pdf`。

### 10.4 Windows 下中文显示乱码

建议统一使用 UTF-8 编码保存 Markdown/MDX/YAML 文件。
