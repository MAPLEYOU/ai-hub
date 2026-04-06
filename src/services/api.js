/**
 * API 服务模块
 * 用于集成各种 AI 相关的第三方 API
 */

import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * 从 NewsAPI 获取 AI 相关新闻
 * 需要在 .env 中配置 VUE_APP_NEWS_API_KEY
 */
export const fetchNewsFromNewsAPI = async (page = 1) => {
  try {
    const apiKey = import.meta.env.VUE_APP_NEWS_API_KEY
    if (!apiKey) {
      console.warn('NewsAPI key not configured')
      return []
    }

    const response = await api.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'AI OR "artificial intelligence" OR machine learning OR deep learning',
        sortBy: 'publishedAt',
        language: 'en',
        apiKey: apiKey,
        page: page,
        pageSize: 30
      }
    })

    return response.data.articles.map((article, idx) => ({
      id: `newsapi-${idx}`,
      title: article.title,
      description: article.description || article.content,
      category: '资讯',
      source: article.source.name,
      date: new Date(article.publishedAt),
      link: article.url,
      image: article.urlToImage
    }))
  } catch (error) {
    console.error('Failed to fetch from NewsAPI:', error)
    return []
  }
}

/**
 * 从 arXiv 获取 AI 研究论文
 * arXiv API 不需要密钥
 */
export const fetchFromArXiv = async (page = 1) => {
  try {
    const start = (page - 1) * 30
    const response = await api.get('https://export.arxiv.org/api/query', {
      params: {
        search_query: 'cat:cs.AI OR cat:cs.LG',
        start: start,
        max_results: 30,
        sortBy: 'submittedDate',
        sortOrder: 'descending'
      }
    })

    // 解析 XML 响应
    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(response.data, 'text/xml')
    const entries = xmlDoc.getElementsByTagName('entry')

    const papers = Array.from(entries).map((entry, idx) => {
      const titleEl = entry.getElementsByTagName('title')[0]
      const summaryEl = entry.getElementsByTagName('summary')[0]
      const publishedEl = entry.getElementsByTagName('published')[0]
      const linkEl = entry.getElementsByTagName('id')[0]

      return {
        id: `arxiv-${idx}`,
        title: titleEl?.textContent || '未命名论文',
        description: summaryEl?.textContent?.trim() || '暂无摘要',
        category: '研究论文',
        source: 'arXiv',
        date: new Date(publishedEl?.textContent),
        link: linkEl?.textContent?.replace('http://', 'https://'),
      }
    })

    return papers
  } catch (error) {
    console.error('Failed to fetch from arXiv:', error)
    return []
  }
}

/**
 * 从 GitHub 获取热门 AI 项目
 */
export const fetchFromGitHub = async (language = 'python', page = 1) => {
  try {
    const perPage = 30
    const response = await api.get('https://api.github.com/search/repositories', {
      params: {
        q: 'AI OR "artificial intelligence" language:' + language,
        sort: 'stars',
        order: 'desc',
        page: page,
        per_page: perPage
      }
    })

    return response.data.items.map((repo, idx) => ({
      id: `github-${idx}`,
      title: repo.name,
      description: repo.description || '暂无描述',
      category: 'AI工具',
      source: 'GitHub',
      date: new Date(repo.updated_at),
      link: repo.html_url,
      stars: repo.stargazers_count
    }))
  } catch (error) {
    console.error('Failed to fetch from GitHub:', error)
    return []
  }
}

/**
 * 从多个源中聚合数据
 */
export const fetchAggregatedData = async () => {
  try {
    const [newsData, arxivData, githubData] = await Promise.all([
      fetchNewsFromNewsAPI(1),
      fetchFromArXiv(1),
      fetchFromGitHub('python', 1)
    ])

    return [...newsData, ...arxivData, ...githubData]
  } catch (error) {
    console.error('Failed to fetch aggregated data:', error)
    return []
  }
}

export default api
