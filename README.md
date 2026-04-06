# 🚀 AI Hub - AI资讯聚合平台

一个现代化的 Vue 3 + Tailwind CSS 应用，用于聚合和展示 AI 相关的资讯、实用 Skill 和商业模式。

## ✨ 主要功能

- 📰 **AI 资讯聚合** - 实时收集全网最新的 AI 资讯
- 🛠️ **实用 Skill 分享** - 汇聚社区分享的最佳实践和技巧
- 💼 **商业模式分析** - 深入探讨 AI 创业的商业模式
- 🔍 **强大搜索** - 全文搜索资讯内容
- 🏷️ **分类展示** - 按类别筛选内容
- 📱 **响应式设计** - 完美支持桌面、平板和手机

## 🛠️ 技术栈

- **Vue 3** - 现代 JavaScript 框架
- **Vite** - 极速构建工具
- **Tailwind CSS** - 原子化 CSS 框架
- **Axios** - HTTP 客户端
- **GitHub Pages** - 免费部署

## 📦 项目结构

```
ai-hub/
├── src/
│   ├── main.js          # 入口文件
│   ├── App.vue          # 主应用组件
│   └── style.css        # 全局样式
├── index.html           # HTML 模板
├── package.json         # 项目配置
├── vite.config.js       # Vite 配置
├── tailwind.config.js   # Tailwind 配置
└── .github/workflows/   # GitHub Actions
```

## 🚀 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/MAPLEYOU/ai-hub.git
cd ai-hub
```

### 2. 安装依赖

```bash
npm install
```

### 3. 本地开发

```bash
npm run dev
```

浏览器访问 `http://localhost:3000`

### 4. 构建生产版本

```bash
npm run build
```

### 5. 部署到 GitHub Pages

```bash
npm run deploy
```

> 注意：确保已配置 GitHub Actions token（通常自动配置）

## 🔧 配置第三方 API

当前项目使用 Mock 数据。如需集成真实 API，修改 `src/App.vue` 中的 `refreshData()` 方法：

```javascript
const refreshData = async () => {
  loading.value = true
  try {
    // 示例：使用 NewsAPI 获取 AI 相关新闻
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'AI OR artificial intelligence',
        sortBy: 'publishedAt',
        apiKey: process.env.VUE_APP_NEWS_API_KEY,
        pageSize: 50
      }
    })
    articles.value = response.data.articles.map((item, idx) => ({
      id: idx,
      title: item.title,
      description: item.description,
      category: '资讯',
      source: item.source.name,
      date: new Date(item.publishedAt),
      link: item.url
    }))
  } catch (error) {
    console.error('Failed to fetch data:', error)
  } finally {
    loading.value = false
  }
}
```

## 📚 推荐 API

- **NewsAPI** - 新闻资讯 (https://newsapi.org)
- **Product Hunt API** - AI 产品 (https://api.producthunt.com)
- **arXiv API** - AI 研究论文 (https://arxiv.org/api)
- **GitHub API** - AI 项目趋势 (https://api.github.com)

## 📋 使用指南

1. **搜索资讯** - 在搜索框输入关键词实时过滤
2. **分类筛选** - 点击顶部按钮按类别筛选内容
3. **阅读更多** - 点击卡片上的 "阅读更多" 按钮跳转到原始资讯
4. **刷新数据** - 点击 "🔄 刷新数据" 按钮更新内容

## 🌐 在线访问

一旦部署到 GitHub Pages，访问：
```
https://MAPLEYOU.github.io/ai-hub/
```

## 🤝 贡献

欢迎提交 Pull Request 或 Issue！

## 📄 许可证

MIT License

## 👨‍💻 作者

[@MAPLEYOU](https://github.com/MAPLEYOU)

---

⭐ 如果觉得有帮助，请给个 Star！