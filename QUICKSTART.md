# 🚀 快速启动指南

欢迎使用 AI Hub！这个指南将帮助你在 5 分钟内启动和运行项目。

## ⚡ 快速开始（5分钟）

### 1️⃣ 安装依赖

```bash
npm install
```

⏱️ 预计时间：2-3 分钟（取决于网络速度）

### 2️⃣ 启动开发服务器

```bash
npm run dev
```

✅ 你应该看到类似这样的输出：
```
  VITE v5.0.0  ready in 156 ms

  ➜  Local:   http://localhost:3000/
  ➜  Press h to show help
```

### 3️⃣ 打开浏览器

访问 **http://localhost:3000/**

🎉 完成！你现在应该看到 AI Hub 的主页。

---

## 📝 接下来做什么？

### 修改内容

编辑 `src/App.vue` 中的 Mock 数据，添加你自己的资讯：

```javascript
const mockData = [
  {
    id: 1,
    title: '你的新闻标题',
    description: '新闻描述...',
    category: 'AI资讯',
    source: '新闻来源',
    date: new Date(),
    link: 'https://example.com'
  }
]
```

### 集成真实 API

1. 在 `.env.local` 中配置 API 密钥：
```
VUE_APP_NEWS_API_KEY=your_key_here
```

2. 在 `src/App.vue` 中修改 `refreshData()` 方法（参考 DEVELOPMENT.md）

### 自定义样式

编辑 `tailwind.config.js` 修改主题颜色：
```javascript
colors: {
  primary: '#6366f1',    // 改成你喜欢的颜色
}
```

---

## 📦 构建和部署

### 本地构建

```bash
npm run build
```

优化后的文件在 `dist/` 目录中。

### 部署到 GitHub Pages

方式一（自动）：
```bash
npm run deploy
```

方式二（通过 GitHub Actions）：
```bash
git push origin main
# GitHub Actions 会自动构建和部署
```

访问：`https://MAPLEYOU.github.io/ai-hub/`

---

## 📚 完整文档

- **[README.md](README.md)** - 项目概览
- **[DEVELOPMENT.md](DEVELOPMENT.md)** - 开发指南
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - 部署指南

---

## 🆘 常见问题

### 页面显示但样式错乱？
清除浏览器缓存：`Ctrl+Shift+R` (Windows) 或 `Cmd+Shift+R` (Mac)

### npm install 失败？
```bash
# 清除缓存
npm cache clean --force

# 重试
npm install
```

### 端口 3000 已被占用？
```bash
npm run dev -- --port 3001
```

### 想关闭开发服务器？
在终端按 `Ctrl+C`

---

## 💡 提示

- 📖 在开发中参考 `DEVELOPMENT.md` 添加新功能
- 🔗 在部署前查看 `DEPLOYMENT.md` 了解细节
- 🎨 使用 Tailwind CSS 文档快速查找样式类名
- 🐛 打开浏览器 DevTools 调试问题

---

## 🎯 下一步建议

1. ✅ 通过修改 Mock 数据熟悉项目
2. ✅ 尝试添加一个新的分类
3. ✅ 配置并集成一个真实 API
4. ✅ 自定义样式和品牌
5. ✅ 部署到 GitHub Pages

---

**需要帮助？** 查看 [DEVELOPMENT.md](DEVELOPMENT.md) 或在 GitHub 提交 Issue！

Happy coding! 🚀
