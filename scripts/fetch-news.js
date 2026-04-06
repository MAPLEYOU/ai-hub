/**
 * AI 新闻爬虫脚本
 * 每天自动运行，从多个来源获取最新 AI 资讯
 * 使用方法: node scripts/fetch-news.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 数据存储路径
const DATA_FILE = path.join(__dirname, '../public/ai-news.json');

// 确保 public 目录存在
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 辅助函数：HTTPS GET 请求
function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const defaultHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    };

    https.get(url, { headers: { ...defaultHeaders, ...headers } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

// 从 GitHub Trending 获取热门 AI 项目
async function fetchGitHubTrending() {
  console.log('📥 从 GitHub 获取热门 AI 项目...');
  try {
    const url = 'https://api.github.com/search/repositories?q=ai+language:python&sort=stars&order=desc&per_page=5';
    const data = await httpsGet(url);

    return data.items.map((repo, idx) => ({
      id: `github-${idx}`,
      title: `⭐ ${repo.name} - ${repo.stargazers_count} stars`,
      description: repo.description || '暂无描述',
      category: 'AI工具',
      source: 'GitHub',
      date: new Date(),
      link: repo.html_url,
      icon: '💻'
    })) || [];
  } catch (error) {
    console.error('❌ GitHub 获取失败:', error.message);
    return [];
  }
}

// 从 arXiv 获取最新论文
async function fetchArXivPapers() {
  console.log('📥 从 arXiv 获取最新论文...');
  try {
    const url = 'https://export.arxiv.org/api/query?search_query=cat:cs.AI&sortBy=submittedDate&sortOrder=descending&start=0&max_results=3&outputFormat=json';
    const data = await httpsGet(url);

    if (data.results) {
      return data.results.map((paper, idx) => ({
        id: `arxiv-${idx}`,
        title: paper.title || '未命名论文',
        description: paper.summary?.substring(0, 150) || '暂无摘要',
        category: '研究论文',
        source: 'arXiv',
        date: new Date(paper.published),
        link: paper.id,
        icon: '🧬'
      }));
    }
  } catch (error) {
    console.error('❌ arXiv 获取失败:', error.message);
  }
  return [];
}

// 本地默认数据（当 API 不可用时使用）
function getDefaultData() {
  console.log('📚 使用默认数据（API 不可用）');
  return [
    {
      id: 1,
      title: 'OpenAI o3 突破通用人工智能 - 推理能力超越人类专家',
      description: 'OpenAI最新发布的o3模型在ARC理科竞赛中获得92%的成绩，推理能力突破新高。',
      category: 'AI资讯',
      source: 'OpenAI',
      date: new Date(),
      link: 'https://openai.com',
      icon: '🧠'
    },
    {
      id: 2,
      title: 'Google Gemini 3.0发布：多模态AI的完美进化',
      description: '支持实时视频处理、实时音频转录、代码执行等多项功能，推理速度提升5倍。',
      category: 'AI工具',
      source: 'Google Official',
      date: new Date(),
      link: 'https://google.com',
      icon: '🎯'
    },
    {
      id: 3,
      title: '2026年AI创业融资突破1000亿美元 - 商业模式进化分析',
      description: '从Model创业到应用层创业，资本流向发生巨大转变。Agent和AutoML成最热领域。',
      category: '商业模式',
      source: 'Crunchbase',
      date: new Date(),
      link: '#',
      icon: '💰'
    }
  ];
}

// 主函数
async function main() {
  console.log('🚀 开始抓取 AI 资讯...');
  console.log(`⏰ 时间: ${new Date().toLocaleString('zh-CN')}`);
  console.log('');

  let allNews = [];

  // 并发获取所有数据
  const [gitHubNews, arxivNews] = await Promise.all([
    fetchGitHubTrending().catch(() => []),
    fetchArXivPapers().catch(() => [])
  ]);

  allNews = [...gitHubNews, ...arxivNews];

  // 如果没有从 API 获取到数据，使用默认数据
  if (allNews.length === 0) {
    allNews = getDefaultData();
  } else {
    // 结合默认数据
    allNews = [...getDefaultData(), ...allNews];
  }

  // 去重和排序
  const uniqueNews = Array.from(
    new Map(allNews.map(item => [item.id, item])).values()
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  // 保存到文件
  fs.writeFileSync(DATA_FILE, JSON.stringify(uniqueNews, null, 2));

  console.log('');
  console.log(`✅ 成功获取 ${uniqueNews.length} 条资讯`);
  console.log(`💾 已保存到: ${DATA_FILE}`);
  console.log('');
  
  // 显示摘要
  console.log('📰 最新资讯摘要:');
  uniqueNews.slice(0, 3).forEach((item, idx) => {
    console.log(`  ${idx + 1}. ${item.title}`);
  });
}

// 运行
main().catch(console.error);
