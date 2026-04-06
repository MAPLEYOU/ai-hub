# 📦 部署指南

本文档详细说明如何将 AI Hub 项目部署到 GitHub Pages。

## 前置要求

- Node.js 18+ 和 npm
- GitHub 账户
- Git 已安装

## 本地开发和测试

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000` 查看应用。

### 3. 构建项目

```bash
npm run build
```

这将生成优化的生产版本在 `dist/` 目录。

## 部署到 GitHub Pages

### 方法 1：使用 npm 脚本（推荐）

```bash
npm run deploy
```

这个命令会：
1. 构建项目
2. 使用 gh-pages 将 `dist/` 目录推送到 GitHub Pages

### 方法 2：手动部署

```bash
# 构建项目
npm run build

# 提交更改
git add -A
git commit -m "Build for production"

# 推送到 GitHub
git push origin main

# 访问部署的网站
# https://MAPLEYOU.github.io/ai-hub/
```

### 方法 3：使用 GitHub Actions（自动部署）

项目已包含自动部署工作流 (`.github/workflows/deploy.yml`)。

每当你推送到 `main` 分支时，GitHub Actions 会自动：
1. 检出代码
2. 安装依赖
3. 构建项目
4. 部署到 GitHub Pages

#### 启用 GitHub Actions

1. 前往你的 GitHub 仓库
2. 点击 **Settings → Pages**
3. 在 "Build and deployment" 下，选择 "GitHub Actions" 作为 Source
4. 保存设置

## 配置 GitHub 仓库

### 1. 启用 GitHub Pages

1. 进入仓库 Settings
2. 左侧菜单选择 **Pages**
3. 在 "Source" 下拉菜单中选择 **Deploy from a branch**
4. 选择 **gh-pages** 分支
5. 点击 Save

### 2. 配置自定义域名（可选）

如果你有自定义域名，可以这样配置：

1. 进入 Settings → Pages
2. 在 "Custom domain" 输入框中输入你的域名
3. 按 Save
4. 在你的域名 DNS 设置中添加以下记录：

```
CNAME 文件内容: MAPLEYOU.github.io
```

## 验证部署

部署完成后，访问以下 URL 验证：

```
https://MAPLEYOU.github.io/ai-hub/
```

## 常见问题

### Q: 部署后页面显示 404

**A:** 检查以下几点：
- 确认 `vite.config.js` 中的 `base` 配置正确：`base: '/ai-hub/'`
- 确认 `gh-pages` 分支已创建
- 在 Settings → Pages 中检查构建配置

### Q: 样式没有加载

**A:** 这通常是 CSS 路径问题：
- 确认 Tailwind CSS 已正确配置
- 重新构建项目：`npm run build`
- 清除浏览器缓存

### Q: 部署后 API 返回 CORS 错误

**A:** 某些 API 可能不支持跨域请求：
- 使用支持 CORS 的 API（如 NewsAPI）
- 或者部署一个后端代理服务器
- 或使用 API 网关（如 Vercel）

## 环境变量配置

### 在本地开发中

创建 `.env.local` 文件：

```bash
VUE_APP_NEWS_API_KEY=your_api_key_here
```

### 在 GitHub Pages 中

由于 GitHub Pages 只提供静态托管，无法存储敏感信息：

1. **方法 1**: 在公开使用浏览器密钥的 API（如 NewsAPI
2. **方法 2**: 部署到 Vercel 等支持环境变量的平台
3. **方法 3**: 创建后端服务来代理 API 请求

## 性能优化建议

1. **启用 GZIP 压缩**
   ```bash
   # nginx 配置示例
   gzip on;
   gzip_types text/plain text/css text/javascript application/json application/javascript;
   ```

2. **使用 CDN**
   - 考虑使用 jsDelivr 或类似 CDN 加速静态资源

3. **代码分割**
   - Vite 已自动处理代码分割

## 更新部署

每次修改代码后：

```bash
# 1. 提交更改
git add -A
git commit -m "Update content"

# 2. 推送到 GitHub
git push origin main

# 3. 等待自动部署完成（GitHub Actions）
```

## 备份和恢复

### 备份当前版本

```bash
# 备份 gh-pages 分支
git clone -b gh-pages https://github.com/MAPLEYOU/ai-hub.git ai-hub-backup
```

### 恢复之前的版本

```bash
# 查看 gh-pages 分支历史
git log --oneline gh-pages

# 恢复到特定版本
git checkout <commit-hash> -- dist/

# 重新部署
npm run deploy
```

## 获取帮助

- [GitHub Pages 官方文档](https://pages.github.com/)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [Vue 3 官方文档](https://vuejs.org/)

---

祝部署顺利! 🎉
