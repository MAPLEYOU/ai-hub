<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
    <!-- Header -->
    <header class="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-white">🚀 AI Hub</h1>
            <p class="text-sm text-slate-400 mt-1">AI资讯 | 实用Skill | 商业模式</p>
          </div>
          <div class="text-slate-400 text-sm">
            <span class="px-3 py-1 bg-slate-700 rounded-full">{{ articles.length }} 条资讯</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Search and Filter Section -->
      <div class="mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <!-- Search Box -->
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索资讯、Skill、商业模式..."
              class="w-full px-4 py-3 bg-slate-800 text-white rounded-lg border border-slate-700 focus:border-primary-500 focus:outline-none"
            />
            <span class="absolute right-3 top-3 text-slate-500">🔍</span>
          </div>

          <!-- Refresh Button -->
          <div class="flex gap-2">
            <button
              @click="refreshData"
              :disabled="loading"
              class="flex-1 px-4 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-600 text-white rounded-lg transition"
            >
              {{ loading ? '更新中...' : '🔄 刷新数据' }}
            </button>
          </div>
        </div>

        <!-- Category Filters -->
        <div class="flex flex-wrap gap-2">
          <button
            @click="selectedCategory = null"
            :class="[
              'px-4 py-2 rounded-full transition',
              selectedCategory === null 
                ? 'bg-primary-600 text-white' 
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            ]"
          >
            全部
          </button>
          <button
            v-for="category in categories"
            :key="category"
            @click="selectedCategory = category"
            :class="[
              'px-4 py-2 rounded-full transition',
              selectedCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- No Data State -->
      <div v-if="filteredArticles.length === 0" class="text-center py-12">
        <div class="text-4xl mb-4">📭</div>
        <p class="text-slate-400 text-lg">暂时没有找到相关资讯</p>
      </div>

      <!-- Articles Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="article in filteredArticles"
          :key="article.id"
          class="bg-slate-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition border border-slate-700 hover:border-primary-500"
        >
          <!-- Article Header -->
          <div class="p-6">
            <!-- Category Badge -->
            <div class="mb-3">
              <span
                :class="[
                  'inline-block px-3 py-1 rounded-full text-xs font-semibold',
                  getCategoryColor(article.category)
                ]"
              >
                {{ article.category }}
              </span>
            </div>

            <!-- Title -->
            <h2 class="text-xl font-bold text-white mb-2 line-clamp-2">
              {{ article.title }}
            </h2>

            <!-- Description -->
            <p class="text-slate-400 text-sm mb-4 line-clamp-3">
              {{ article.description }}
            </p>

            <!-- Source and Date -->
            <div class="flex items-center justify-between text-xs text-slate-500 mb-4">
              <span>📌 {{ article.source }}</span>
              <span>📅 {{ formatDate(article.date) }}</span>
            </div>

            <!-- Read More Button -->
            <a
              :href="article.link"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded text-sm transition"
            >
              阅读更多 →
            </a>
          </div>
        </article>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-slate-900 border-t border-slate-700 mt-12 py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
        <p>🌟 AI Hub - 一站式AI资讯聚合平台 | GitHub: <a href="https://github.com/MAPLEYOU/ai-hub" target="_blank" class="text-primary-400 hover:underline">MAPLEYOU/ai-hub</a></p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import axios from 'axios'

export default {
  name: 'App',
  setup() {
    const articles = ref([])
    const searchQuery = ref('')
    const selectedCategory = ref(null)
    const loading = ref(false)

    const categories = ['AI资讯', 'AI工具', 'Skill分享', '商业模式', '研究论文']

    // Mock Data - 在实际应用中应该从API获取
    const mockData = [
      {
        id: 1,
        title: 'OpenAI 发布 GPT-5 预览版，性能提升 40%',
        description: '最新的GPT-5模型在多个基准测试中表现出色，推理能力和代码能力大幅提升。',
        category: 'AI资讯',
        source: 'OpenAI Official',
        date: new Date('2024-04-05'),
        link: 'https://openai.com'
      },
      {
        id: 2,
        title: 'Claude 3 Opus - 最强的通用AI模型',
        description: 'Anthropic推出了Claude 3 Opus，在学术基准和超长上下文处理上表现优异。',
        category: 'AI工具',
        source: 'Anthropic',
        date: new Date('2024-04-04'),
        link: 'https://anthropic.com'
      },
      {
        id: 3,
        title: 'Prompt Engineering 必学技巧：Few-shot Learning',
        description: '通过少样本学习优化AI输出质量，包含实战案例和最佳践。',
        category: 'Skill分享',
        source: 'AI Community',
        date: new Date('2024-04-03'),
        link: '#'
      },
      {
        id: 4,
        title: 'AI SaaS 创业的3个核心商业模式',
        description: '分析当前最热门的AI创业公司如何通过SaaS模式实现增长。',
        category: '商业模式',
        source: 'Techcrunch',
        date: new Date('2024-04-02'),
        link: 'https://techcrunch.com'
      },
      {
        id: 5,
        title: '让AI推理速度提升10倍的量化技术',
        description: '深入浅出讲解模型量化、蒸馏等优化技术在生产环境的应用。',
        category: 'Skill分享',
        source: 'Medium',
        date: new Date('2024-04-01'),
        link: '#'
      },
      {
        id: 6,
        title: 'Google Gemini 2.0 - 多模态AI的新体验',
        description: '支持视频、图片、文本的统一处理，在实时理解任务中领先业界。',
        category: 'AI资讯',
        source: 'Google Official',
        date: new Date('2024-03-31'),
        link: 'https://google.com'
      }
    ]

    const filteredArticles = computed(() => {
      let filtered = articles.value

      // 按分类过滤
      if (selectedCategory.value) {
        filtered = filtered.filter(article => article.category === selectedCategory.value)
      }

      // 按搜索词过滤
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(article =>
          article.title.toLowerCase().includes(query) ||
          article.description.toLowerCase().includes(query) ||
          article.category.toLowerCase().includes(query)
        )
      }

      return filtered.sort((a, b) => b.date - a.date)
    })

    const getCategoryColor = (category) => {
      const colorMap = {
        'AI资讯': 'bg-blue-900 text-blue-200',
        'AI工具': 'bg-purple-900 text-purple-200',
        'Skill分享': 'bg-emerald-900 text-emerald-200',
        '商业模式': 'bg-amber-900 text-amber-200',
        '研究论文': 'bg-red-900 text-red-200'
      }
      return colorMap[category] || 'bg-slate-700 text-slate-300'
    }

    const formatDate = (date) => {
      const d = new Date(date)
      return d.toLocaleDateString('zh-CN')
    }

    const refreshData = async () => {
      loading.value = true
      try {
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
        articles.value = mockData
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        loading.value = false
      }
    }

    // 初始化加载数据
    refreshData()

    return {
      articles,
      searchQuery,
      selectedCategory,
      loading,
      categories,
      filteredArticles,
      getCategoryColor,
      formatDate,
      refreshData
    }
  }
}
</script>

<style scoped>
/* Line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
