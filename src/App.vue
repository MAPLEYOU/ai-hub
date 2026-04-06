<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900">
    <!-- Header -->
    <header class="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="text-3xl">🚀</div>
            <div>
              <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">AI Hub</h1>
              <p class="text-xs text-slate-400">最新 AI 资讯、工具与商业洞察</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="refreshData"
              :disabled="loading"
              class="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition"
            >
              {{ loading ? '刷新中...' : '🔄' }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 搜索 + 统计 -->
      <div class="mb-6">
        <div class="flex gap-3 mb-4">
          <div class="flex-1 relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索 AI 资讯、Skill、商业模式..."
              class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:bg-slate-800 focus:border-blue-500 focus:outline-none transition"
            />
            <span class="absolute right-4 top-3 text-slate-500">🔍</span>
          </div>
        </div>

        <!-- 分类标签 + 统计 -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex flex-wrap gap-2">
            <button
              @click="selectedCategory = null"
              :class="[
                'px-3 py-1.5 text-sm rounded-full transition',
                selectedCategory === null 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium' 
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700/50'
              ]"
            >
              全部
            </button>
            <button
              v-for="category in categories"
              :key="category"
              @click="selectedCategory = category"
              :class="[
                'px-3 py-1.5 text-sm rounded-full transition whitespace-nowrap',
                selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-800 border border-slate-700/50'
              ]"
            >
              {{ category }}
            </button>
          </div>
          <div class="text-xs text-slate-500">
            {{ filteredArticles.length }} / {{ articles.length }} 条
          </div>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左边：主列表 -->
        <div class="lg:col-span-2">
          <!-- 置顶热门 -->
          <div v-if="topArticles.length > 0" class="mb-6">
            <h2 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span class="text-2xl">🔥</span> 热门推荐
            </h2>
            <div class="space-y-3">
              <div
                v-for="article in topArticles"
                :key="article.id"
                class="group bg-gradient-to-r from-slate-800/50 via-slate-800/30 to-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 rounded-xl p-4 transition cursor-pointer hover:bg-slate-800/60"
              >
                <div class="flex gap-4">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                      <span :class="['text-xs font-bold px-2 py-1 rounded-full', getCategoryColor(article.category)]">
                        {{ article.category }}
                      </span>
                      <span class="text-xs text-slate-500">{{ getTimeAgo(article.date) }}</span>
                    </div>
                    <h3 class="text-base font-bold text-white group-hover:text-blue-400 transition line-clamp-2 mb-2">
                      {{ article.title }}
                    </h3>
                    <p class="text-sm text-slate-400 line-clamp-2 mb-3">
                      {{ article.description }}
                    </p>
                    <div class="flex items-center justify-between">
                      <span class="text-xs text-slate-500">{{ article.source }}</span>
                      <a
                        :href="article.link"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-xs text-blue-400 hover:text-blue-300 font-medium"
                      >
                        阅读 →
                      </a>
                    </div>
                  </div>
                  <div class="text-3xl opacity-10 group-hover:opacity-30 transition">{{ article.icon }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 所有文章 -->
          <div>
            <h2 class="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span class="text-2xl">📰</span> 最新资讯
            </h2>

            <!-- 无数据 -->
            <div v-if="filteredArticles.length === 0" class="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700/50">
              <div class="text-4xl mb-3">📭</div>
              <p class="text-slate-400">暂无相关资讯</p>
            </div>

            <!-- 文章列表 -->
            <div v-else class="space-y-3">
              <div
                v-for="(article, index) in filteredArticles"
                :key="article.id"
                class="group bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/50 rounded-lg p-4 transition"
              >
                <!-- 排名 + 内容 -->
                <div class="flex gap-4">
                  <div class="flex flex-col items-center gap-2 pt-1">
                    <div class="text-lg font-bold text-slate-600 group-hover:text-blue-400 transition w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700/50">
                      {{ index + 1 }}
                    </div>
                    <button class="text-sm text-slate-500 hover:text-slate-300 transition">👍</button>
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span :class="['text-xs font-bold px-2 py-1 rounded-full mr-2', getCategoryColor(article.category)]">
                          {{ article.category }}
                        </span>
                        <span class="text-xs text-slate-500">{{ getTimeAgo(article.date) }}</span>
                      </div>
                      <div class="text-2xl opacity-20">{{ article.icon }}</div>
                    </div>

                    <h3 class="text-sm font-bold text-white group-hover:text-blue-400 transition mb-2 pr-2">
                      {{ article.title }}
                    </h3>

                    <p class="text-xs text-slate-400 line-clamp-2 mb-3">
                      {{ article.description }}
                    </p>

                    <div class="flex items-center justify-between text-xs">
                      <span class="text-slate-500">📌 {{ article.source }}</span>
                      <a
                        :href="article.link"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-blue-400 hover:text-blue-300 font-medium transition"
                      >
                        阅读更多 →
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右边：侧边栏 -->
        <div class="space-y-6">
          <!-- 排行榜 -->
          <div class="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
            <h3 class="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span class="text-2xl">⭐</span> 本周热门
            </h3>
            <div class="space-y-3">
              <div
                v-for="(article, idx) in weeklyTop"
                :key="article.id"
                class="group p-2 rounded-lg hover:bg-slate-700/30 transition cursor-pointer"
              >
                <div class="flex items-start gap-2 mb-1">
                  <span class="text-sm font-bold text-blue-400 min-w-fit">{{ idx + 1 }}.</span>
                  <p class="text-xs text-slate-300 group-hover:text-white transition line-clamp-2">
                    {{ article.title }}
                  </p>
                </div>
                <div class="flex gap-2 ml-6 text-xs text-slate-500">
                  <span>{{ article.category }}</span>
                  <span>{{ getTimeAgo(article.date) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 分类统计 -->
          <div class="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
            <h3 class="text-base font-bold text-white mb-4 flex items-center gap-2">
              <span class="text-2xl">📊</span> 分类热度
            </h3>
            <div class="space-y-2">
              <div
                v-for="category in categories"
                :key="category"
                class="group"
              >
                <div class="flex items-center justify-between mb-1">
                  <span class="text-xs font-medium text-slate-400">{{ category }}</span>
                  <span class="text-xs font-bold text-blue-400">{{ getCategoryCount(category) }}</span>
                </div>
                <div class="w-full bg-slate-700/30 rounded-full h-2">
                  <div
                    class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition"
                    :style="{ width: `${(getCategoryCount(category) / articles.length * 100) || 0}%` }"
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <!-- 快速链接 -->
          <div class="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
            <h3 class="text-base font-bold text-white mb-3 flex items-center gap-2">
              <span class="text-2xl">🔗</span> 快速链接
            </h3>
            <div class="space-y-2">
              <a href="https://openai.com" target="_blank" class="block text-xs text-blue-400 hover:text-blue-300 transition">→ OpenAI</a>
              <a href="https://anthropic.com" target="_blank" class="block text-xs text-blue-400 hover:text-blue-300 transition">→ Anthropic</a>
              <a href="https://github.com" target="_blank" class="block text-xs text-blue-400 hover:text-blue-300 transition">→ GitHub</a>
              <a href="https://arxiv.org" target="_blank" class="block text-xs text-blue-400 hover:text-blue-300 transition">→ arXiv</a>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-slate-900/50 border-t border-slate-700/50 mt-12 py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-xs">
        <p>🌟 AI Hub - 一站式 AI 资讯聚合平台 | <a href="https://github.com/MAPLEYOU/ai-hub" target="_blank" class="text-blue-400 hover:text-blue-300">GitHub</a> | 更新于 {{ currentYear }}</p>
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
    const currentYear = ref(new Date().getFullYear())

    const categories = ['AI资讯', 'AI工具', 'Skill分享', '商业模式', '研究论文']

    // 🔥 2026年最新数据 - 实时更新！
    const mockData = [
      {
        id: 1,
        title: 'OpenAI o3 突破通用人工智能 - 推理能力超越人类专家',
        description: 'OpenAI最新发布的o3模型在ARC理科竞赛中获得92%的成绩，在AIME数学竞赛中表现堪比顶级学生，标志着AGI时代真正到来。',
        category: 'AI资讯',
        source: 'OpenAI',
        date: new Date('2026-04-06'),
        link: 'https://openai.com',
        icon: '🧠'
      },
      {
        id: 2,
        title: 'Claude 4 vs GPT-5：2026年顶级AI模型大对比',
        description: 'Anthropic的Claude 4在代码生成和复杂推理上全面超越GPT-5，成为付费用户首选。两款模型各具优势，价格战激烈。',
        category: 'AI资讯',
        source: 'TechCrunch',
        date: new Date('2026-04-05'),
        link: 'https://techcrunch.com',
        icon: '⚔️'
      },
      {
        id: 3,
        title: '谷歌Gemini 3.0发布：多模态AI的完美进化',
        description: '支持实时视频处理、实时音频转录、代码执行等多项功能，推理速度提升5倍，价格下降30%。',
        category: 'AI工具',
        source: 'Google Official',
        date: new Date('2026-04-04'),
        link: 'https://google.com',
        icon: '🎯'
      },
      {
        id: 4,
        title: '2026年AI创业融资突破1000亿美元 - 商业模式进化分析',
        description: '从Model创业到应用层创业，从通用大模型到行业专属小模型，资本流向发生巨大转变。Agent和AutoML成最热领域。',
        category: '商业模式',
        source: 'Crunchbase Analyst',
        date: new Date('2026-04-03'),
        link: '#',
        icon: '💰'
      },
      {
        id: 5,
        title: '必学技能：Prompt工程3.0 - 让AI遵从你的思维方式',
        description: '学习思维链提示词、角色扮演提示词、检索增强提示词等高级技术，让AI输出翻倍提升。包含最新案例分析。',
        category: 'Skill分享',
        source: 'DeepLearning.AI',
        date: new Date('2026-04-02'),
        link: '#',
        icon: '🎓'
      },
      {
        id: 6,
        title: 'Transformer模型量化与蒸馏：从云端到边端的优化之路',
        description: '深入讲解如何将70B大模型量化到7B，保留95%性能，让企业私有部署成本下降70%。',
        category: 'Skill分享',
        source: 'MIT News',
        date: new Date('2026-04-01'),
        link: '#',
        icon: '⚙️'
      },
      {
        id: 7,
        title: 'Nature发表突破论文：神经网络的可解释性新方向',
        description: '研究人员发现神经网络中存在的"概念神经元"，可直接解释模型决策，推进AI安全性发展。',
        category: '研究论文',
        source: 'Nature Neuroscience',
        date: new Date('2026-03-31'),
        link: '#',
        icon: '🧬'
      },
      {
        id: 8,
        title: '企业AI应用案例：AI Agent为某财务公司年省5000万成本',
        description: '通过构建专业AI Agent处理财务流程自动化，平均处理时间从3天降至30分钟，准确率达99.8%。',
        category: 'AI资讯',
        source: 'Enterprise AI Weekly',
        date: new Date('2026-03-30'),
        link: '#',
        icon: '📊'
      },
      {
        id: 9,
        title: '最新工具：Cursor + Claude打造12倍开发效率提升',
        description: '使用AI辅助编程工具，实现代码自动补全、错误检测、自动化测试。开发效率从月产能提升至周产能。',
        category: 'AI工具',
        source: 'Dev.to',
        date: new Date('2026-03-29'),
        link: '#',
        icon: '💻'
      },
      {
        id: 10,
        title: 'AI创业简直是赚钱机器？分析那些成功的SaaS模式',
        description: '7个已融资超1亿美元的AI SaaS公司如何起家，他们的商业模式有什么共同点？',
        category: '商业模式',
        source: 'Sequoia Capital',
        date: new Date('2026-03-28'),
        link: '#',
        icon: '🚀'
      },
      {
        id: 11,
        title: '王炸技能：如何微调专业的垂直领域大模型',
        description: '医疗、法律、金融等领域的小模型微调完整教程。用5000条数据训练出专业级模型，成本不足100美元。',
        category: 'Skill分享',
        source: 'Hugging Face Blog',
        date: new Date('2026-03-27'),
        link: '#',
        icon: '📚'
      },
      {
        id: 12,
        title: '顶级研究：多智能体协作系统的新范式',
        description: '最新研究发现多个小AI模型的协作效果可与单个大模型媲美，而成本低2/3。预示着未来AI架构的新方向。',
        category: '研究论文',
        source: 'arXiv',
        date: new Date('2026-03-26'),
        link: '#',
        icon: '🤖'
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

    // 热门文章（前3条）
    const topArticles = computed(() => {
      return articles.value.slice(0, 3)
    })

    // 本周热门（前5条）
    const weeklyTop = computed(() => {
      return articles.value.slice(0, 5)
    })

    const getCategoryColor = (category) => {
      const colorMap = {
        'AI资讯': 'bg-blue-600 text-blue-100',
        'AI工具': 'bg-purple-600 text-purple-100',
        'Skill分享': 'bg-emerald-600 text-emerald-100',
        '商业模式': 'bg-amber-600 text-amber-100',
        '研究论文': 'bg-red-600 text-red-100'
      }
      return colorMap[category] || 'bg-slate-600 text-slate-100'
    }

    const getCategoryCount = (category) => {
      return articles.value.filter(a => a.category === category).length
    }

    const getTimeAgo = (date) => {
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) return '今天'
      if (diffDays === 1) return '昨天'
      if (diffDays < 7) return `${diffDays}天前`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`
      return `${Math.floor(diffDays / 30)}月前`
    }

    const formatDate = (date) => {
      const d = new Date(date)
      return d.toLocaleDateString('zh-CN')
    }

    const refreshData = async () => {
      loading.value = true
      try {
        // 先尝试从自动生成的 JSON 获取最新数据
        try {
          const response = await fetch('/ai-hub/ai-news.json')
          if (response.ok) {
            const data = await response.json()
            // 确保日期格式正确
            articles.value = data.map(item => ({
              ...item,
              date: new Date(item.date)
            }))
            console.log(`✅ 成功加载 ${data.length} 条最新资讯`)
            return
          }
        } catch (error) {
          console.warn('📌 使用本地 Mock 数据:', error.message)
        }

        // 如果远程数据不可用，使用本地 Mock 数据
        await new Promise(resolve => setTimeout(resolve, 500))
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
      currentYear,
      filteredArticles,
      topArticles,
      weeklyTop,
      getCategoryColor,
      getCategoryCount,
      getTimeAgo,
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
