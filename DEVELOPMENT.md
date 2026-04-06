# 🛠️ 开发指南

## 项目架构

```
src/
├── main.js              # Vue 应用入口
├── App.vue              # 根组件
├── style.css            # 全局样式
└── services/
    └── api.js           # API 集成模块
```

## 添加新的 API 源

### 步骤 1: 在 `src/services/api.js` 中添加 API 函数

```javascript
export const fetchFromNewSource = async (page = 1) => {
  try {
    const response = await api.get('https://api.example.com/articles', {
      params: {
        page: page,
        limit: 30
      }
    })
    
    return response.data.items.map((item, idx) => ({
      id: `newsource-${idx}`,
      title: item.title,
      description: item.description,
      category: '资讯',
      source: 'NewSource',
      date: new Date(item.date),
      link: item.url
    }))
  } catch (error) {
    console.error('Failed to fetch from NewSource:', error)
    return []
  }
}
```

### 步骤 2: 在 `App.vue` 中调用该函数

修改 `refreshData()` 方法：

```javascript
import { fetchFromNewSource } from './services/api.js'

const refreshData = async () => {
  loading.value = true
  try {
    const newData = await fetchFromNewSource()
    articles.value = [...articles.value, ...newData]
  } catch (error) {
    console.error('Failed to refresh:', error)
  } finally {
    loading.value = false
  }
}
```

## 添加新的分类

### 修改分类列表

在 `App.vue` 中的 `setup()` 函数里找到 `categories` 数组：

```javascript
const categories = [
  '资讯',
  '工具', 
  'Skill',
  '商业模式',
  '研究论文',
  '你的新分类'  // 添加新分类
]
```

### 更新颜色映射

在 `getCategoryColor()` 方法中添加新分类的颜色：

```javascript
const getCategoryColor = (category) => {
  const colorMap = {
    '资讯': 'bg-blue-900 text-blue-200',
    '新分类': 'bg-green-900 text-green-200'  // 添加这里
  }
  return colorMap[category] || 'bg-slate-700 text-slate-300'
}
```

## 自定义样式

### 使用 Tailwind CSS

项目使用 Tailwind CSS，可以直接在模板中使用工具类：

```vue
<div class="bg-slate-900 text-white p-4 rounded-lg">
  自定义样式
</div>
```

### 修改主题颜色

编辑 `tailwind.config.js` 中的 `extend.colors`：

```javascript
colors: {
  primary: '#6366f1',      // 主色
  secondary: '#ec4899',    // 辅助色
}
```

## 添加新组件

### 创建组件文件

在 `src/components/` 下创建新组件，例如 `ArticleCard.vue`：

```vue
<template>
  <div class="bg-slate-800 rounded-lg p-4">
    <h3>{{ article.title }}</h3>
    <p>{{ article.description }}</p>
  </div>
</template>

<script>
export default {
  props: {
    article: Object
  }
}
</script>
```

### 在 App.vue 中导入和使用

```javascript
import ArticleCard from './components/ArticleCard.vue'

export default {
  components: {
    ArticleCard
  }
}
```

## 数据持久化

### 使用 LocalStorage 保存用户偏好

```javascript
import { ref, watch } from 'vue'

const selectedCategory = ref(null)

// 从 LocalStorage 加载
selectedCategory.value = localStorage.getItem('selectedCategory') || null

// 监听变化并保存
watch(selectedCategory, (newVal) => {
  localStorage.setItem('selectedCategory', newVal)
})
```

## 性能优化

### 1. 虚拟滚动（处理大量数据）

安装依赖：
```bash
npm install vue-virtual-scroller
```

在 `main.js` 中注册：
```javascript
import VirtualScroller from 'vue-virtual-scroller'
app.use(VirtualScroller)
```

### 2. 图片懒加载

```vue
<img 
  v-lazy="article.image" 
  alt="Article"
/>
```

### 3. 数据缓存

```javascript
const cache = new Map()

const fetchWithCache = async (url) => {
  if (cache.has(url)) {
    return cache.get(url)
  }
  
  const data = await fetch(url)
  cache.set(url, data)
  return data
}
```

## 添加主题支持

### 添加暗色/亮色主题切换

```javascript
const isDark = ref(true)

const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  document.documentElement.classList.toggle('dark')
}
```

## 国际化 (i18n)

### 安装 vue-i18n

```bash
npm install vue-i18n
```

### 配置多语言

在 `src/locales/zh.json`：
```json
{
  "title": "AI Hub",
  "search": "搜索...",
  "refresh": "刷新"
}
```

在 `src/locales/en.json`：
```json
{
  "title": "AI Hub",
  "search": "Search...",
  "refresh": "Refresh"
}
```

## 构建和测试

### 本地构建测试

```bash
npm run build
npm run preview
```

### 单元测试

安装 Vitest：
```bash
npm install -D vitest @vue/test-utils
```

## 调试

### Vue DevTools

安装浏览器扩展：
- Chrome: [Vue.js devtools](https://chrome.google.com/webstore)
- Firefox: [Vue.js devtools](https://addons.mozilla.org/firefox/)

### 浏览器控制台

```javascript
// 在浏览器控制台中访问 Vue 组件
$vm0  // 第一个组件实例
```

## 常见问题

### Q: 如何禁用某个 API？

**A:** 在 `refreshData()` 方法中注释掉相应的 API 调用

### Q: 如何添加分页？

**A:** 使用 `page` 参数并在 UI 中添加分页按钮

### Q: 如何处理 API 错误？

**A:** 添加 try-catch 块和用户友好的错误提示

---

需要帮助？提交 Issue 或 PR！
