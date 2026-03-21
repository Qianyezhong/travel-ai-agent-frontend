<template>
  <div class="home-container">
    <!-- Hero Section (Takes full viewport height) -->
    <div class="hero-section">
      <!-- Center Content Area -->
      <div class="center-content">
        <div class="title-section">
          <h1 class="main-title">
            <span class="typewriter-text">{{ displayedTitle }}</span>
            <span class="cursor" :class="{ 'blink': isTypingComplete }"></span>
          </h1>
          <p class="sub-title" :class="{ 'fade-in': isTypingComplete }">从一份感受出发，旅行计划由我来打造</p>
        </div>

        <!-- Center Chat Input Box -->
        <div class="chat-input-wrapper">
          <div class="chat-input-box">
            <el-input
              v-model="quickMessage"
              type="textarea"
              :rows="3"
              placeholder="描述您想要的旅行计划或提出问题..."
              resize="none"
              class="custom-textarea"
              @keydown.enter.prevent="handleQuickSend"
            />
            
            <div class="input-actions">
              <div class="left-actions">
                <el-button 
                  class="action-btn" 
                  :class="{ 'is-active': isDeepThinking }"
                  round
                  @click="toggleDeepThinking"
                >
                  <el-icon><Monitor /></el-icon> 深度思考: {{ isDeepThinking ? '开启' : '关闭' }}
                </el-button>
              </div>
              <el-button type="primary" circle class="send-btn" @click="handleQuickSend" :disabled="!quickMessage.trim()">
                <el-icon><Top /></el-icon>
              </el-button>
            </div>
          </div>
        </div>

        <!-- Quick Prompts Section -->
        <div class="quick-prompts-wrapper">
          <div class="quick-prompts">
            <div 
              v-for="(prompt, index) in quickPrompts" 
              :key="index" 
              class="prompt-bubble"
              @click="handlePromptClick(prompt)"
            >
              {{ prompt }}
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Feature Cards -->
      <div class="bottom-features">
        <div class="cards-grid">
          <div class="card" @click="router.push('/chat')">
            <div class="card-icon blue">
              <el-icon><ChatDotRound /></el-icon>
            </div>
            <h3 class="card-title">AI 聊天</h3>
            <p class="card-desc">与智能AI助手进行自然对话</p>
          </div>

          <div class="card" @click="scrollToTools">
            <div class="card-icon purple">
              <el-icon><Setting /></el-icon>
            </div>
            <h3 class="card-title">工具调用</h3>
            <p class="card-desc">提供专业的工具，助力工作。</p>
          </div>

          <div class="card" @click="navigateToAgent">
            <div class="card-icon indigo">
              <el-icon><User /></el-icon>
            </div>
            <h3 class="card-title">Agent智能体</h3>
            <p class="card-desc">智能调用工具助手帮您完成任务</p>
          </div>

          <div class="card" @click="router.push('/knowledge-base')">
            <div class="card-icon pink">
              <el-icon><Document /></el-icon>
            </div>
            <h3 class="card-title">RAG知识库</h3>
            <p class="card-desc">智能文档阅读与问答系统</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tool Center Section (Scroll down to see) -->
    <div class="tool-center-section" ref="toolsSectionRef">
      <div class="header-section">
        <h2 class="tools-main-title">企业级智能体平台：构建你的<span class="highlight">专属AI生产力</span></h2>
      </div>

      <!-- Custom Tabs Navigation -->
      <div class="tools-tabs">
        <div 
          v-for="tab in toolTabs" 
          :key="tab.id"
          class="tab-item"
          :class="{ active: currentTab === tab.id }"
          @click="currentTab = tab.id"
        >
          {{ tab.name }}
        </div>
      </div>

      <!-- Tab Content Area -->
      <div class="tools-content-wrapper">
        <transition name="fade" mode="out-in">
          <div :key="currentTab" class="tools-content-inner">
            <!-- Dynamic Content based on active tab -->
            <div class="tool-info-side">
              <h3 class="tool-title">{{ activeToolData.title }}</h3>
              <ul class="tool-features">
                <li v-for="(feature, idx) in activeToolData.features" :key="idx">
                  {{ feature }}
                </li>
              </ul>
              <el-button type="primary" class="experience-btn" @click="navigateToAgent">立即体验</el-button>
            </div>
            
            <div class="tool-illustration-side">
              <div class="illustration-box" :style="{ background: activeToolData.bgColor }">
                <div class="floating-bubble bubble-top" :style="{ color: activeToolData.color }">
                  <el-icon><component :is="activeToolData.icon1" /></el-icon> {{ activeToolData.tag1 }}
                </div>
                <div class="floating-bubble bubble-bottom" :style="{ color: activeToolData.color }">
                  <el-icon><component :is="activeToolData.icon2" /></el-icon> {{ activeToolData.tag2 }}
                </div>
                
                <!-- Mock UI inside illustration -->
                <div class="mock-window">
                  <div class="mock-header">
                    <span class="dot red"></span>
                    <span class="dot yellow"></span>
                    <span class="dot green"></span>
                    <div class="mock-search-bar" v-if="currentTab === 'search'">
                      <el-icon><Search /></el-icon>
                      <div class="mock-search-text"></div>
                    </div>
                  </div>
                  
                  <!-- Dynamic Mock Body based on tab -->
                  <div class="mock-body">
                    
                    <!-- Search Mock -->
                    <template v-if="currentTab === 'search'">
                      <div class="mock-search-ui">
                        <div class="mock-search-input">
                          <el-icon><Search /></el-icon> <span>巴厘岛五日游攻略</span>
                        </div>
                        <div class="mock-search-results">
                          <div class="mock-result-card">
                            <div class="mock-result-img" style="background: #a0cfff"></div>
                            <div class="mock-result-info">
                              <div class="mock-text-line" style="width: 80%; height: 12px; background: #303133; margin-bottom: 8px;"></div>
                              <div class="mock-text-line" style="width: 100%; height: 8px; background: #909399; margin-bottom: 4px;"></div>
                              <div class="mock-text-line" style="width: 60%; height: 8px; background: #909399;"></div>
                            </div>
                          </div>
                          <div class="mock-result-card">
                            <div class="mock-result-img" style="background: #fab6b6"></div>
                            <div class="mock-result-info">
                              <div class="mock-text-line" style="width: 70%; height: 12px; background: #303133; margin-bottom: 8px;"></div>
                              <div class="mock-text-line" style="width: 90%; height: 8px; background: #909399; margin-bottom: 4px;"></div>
                              <div class="mock-text-line" style="width: 50%; height: 8px; background: #909399;"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </template>

                    <!-- PDF Mock -->
                    <template v-else-if="currentTab === 'pdf'">
                      <div class="mock-pdf-ui">
                        <div class="mock-pdf-toolbar">
                          <div class="pdf-title"><el-icon><Document /></el-icon> 成都三日游行程规划.pdf</div>
                          <el-icon class="pdf-download"><Download /></el-icon>
                        </div>
                        <div class="mock-pdf-page">
                          <div class="mock-pdf-title-line" style="height: 16px; width: 50%; background: #303133; margin: 0 auto 16px;"></div>
                          <div class="mock-pdf-img" style="height: 60px; background: #e9e9eb; border-radius: 4px; margin-bottom: 12px;"></div>
                          <div class="mock-text-line" style="width: 100%; height: 6px; background: #c0c4cc; margin-bottom: 6px;"></div>
                          <div class="mock-text-line" style="width: 90%; height: 6px; background: #c0c4cc; margin-bottom: 6px;"></div>
                          <div class="mock-text-line" style="width: 95%; height: 6px; background: #c0c4cc; margin-bottom: 6px;"></div>
                        </div>
                      </div>
                    </template>

                    <!-- Email Mock -->
                    <template v-else-if="currentTab === 'email'">
                      <div class="mock-email-ui">
                        <div class="mock-email-header">
                          <div class="email-row"><span class="label">收件人:</span> <span class="tag">旅伴群组</span></div>
                          <div class="email-row"><span class="label">主题:</span> <span class="text">✈️ 您的日本关西7日游行程单已生成</span></div>
                        </div>
                        <div class="mock-email-body-content">
                          <div class="mock-text-line" style="width: 40%; height: 10px; background: #606266; margin-bottom: 12px;"></div>
                          <div class="mock-text-line" style="width: 80%; height: 8px; background: #909399; margin-bottom: 6px;"></div>
                          <div class="mock-text-line" style="width: 70%; height: 8px; background: #909399; margin-bottom: 16px;"></div>
                          <div class="mock-email-attachment">
                            <el-icon><Paperclip /></el-icon> 日本关西7日游.pdf (2.4MB)
                          </div>
                        </div>
                      </div>
                    </template>

                    <!-- Download Mock -->
                    <template v-else-if="currentTab === 'download'">
                      <div class="mock-download-ui">
                        <div class="mock-download-header-title">本地下载管理</div>
                        <div class="mock-download-list-ui">
                          <div class="mock-dl-item">
                            <el-icon class="dl-icon" style="color: #67c23a"><Document /></el-icon>
                            <div class="dl-info">
                              <div class="dl-name">行程预算表.xlsx</div>
                              <div class="dl-progress-bar"><div class="dl-progress-fill" style="width: 100%; background: #67c23a;"></div></div>
                            </div>
                            <el-icon class="dl-status" style="color: #67c23a;"><Select /></el-icon>
                          </div>
                          <div class="mock-dl-item">
                            <el-icon class="dl-icon" style="color: #409eff"><Picture /></el-icon>
                            <div class="dl-info">
                              <div class="dl-name">目的地导览图.png</div>
                              <div class="dl-progress-bar"><div class="dl-progress-fill" style="width: 60%; background: #409eff;"></div></div>
                            </div>
                            <span class="dl-speed">2.1 MB/s</span>
                          </div>
                          <div class="mock-dl-item">
                            <el-icon class="dl-icon" style="color: #e6a23c"><Tickets /></el-icon>
                            <div class="dl-info">
                              <div class="dl-name">出游注意事项.txt</div>
                              <div class="dl-progress-bar"><div class="dl-progress-fill" style="width: 30%; background: #e6a23c;"></div></div>
                            </div>
                            <span class="dl-speed">1.5 MB/s</span>
                          </div>
                        </div>
                      </div>
                    </template>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  ChatDotRound, Setting, User, Document, 
  Monitor, Top, Search, DataLine, Printer, 
  Message, Share, Download, FolderChecked,
  Paperclip, Select, Picture, Tickets
} from '@element-plus/icons-vue'

const router = useRouter()
const quickMessage = ref('')
const isDeepThinking = ref(false)
const toolsSectionRef = ref(null)

// Tabs Data
const toolTabs = [
  { id: 'search', name: '专业旅行搜索' },
  { id: 'pdf', name: 'PDF一键生成' },
  { id: 'email', name: 'QQ邮箱自动发送' },
  { id: 'download', name: '本地文件存储' }
]
const currentTab = ref('search')

const toolsData = {
  search: {
    title: '专业旅行搜索',
    features: [
      '整合全网海量旅游资源，一键搜索景点、酒店、航班最新动态',
      '自动过滤冗余信息，精准提取目的地核心玩法与避坑指南',
      '结合实时天气与交通状况，为您推荐最佳出行路线',
      '覆盖全球上万个热门旅游城市，提供本地化的深度游玩建议',
      '支持多语言无缝翻译搜索，打破出境游信息壁垒'
    ],
    bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#409eff',
    tag1: '实时检索',
    tag2: '智能比价',
    icon1: 'Search',
    icon2: 'DataLine'
  },
  pdf: {
    title: 'PDF一键生成',
    features: [
      '将对话规划一键转为PDF文档，排版精美',
      '自动提取关键路线节点，生成时间轴视图',
      '支持离线保存，旅途中无网也能随时翻阅',
      '自定义封面与页眉页脚，打造专属旅行手册'
    ],
    bgColor: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
    color: '#f56c6c',
    tag1: '攻略生成',
    tag2: '排版精美',
    icon1: 'Document',
    icon2: 'Printer'
  },
  email: {
    title: 'QQ邮箱自动发送',
    features: [
      '支持将生成的旅行攻略直接发送至指定邮箱',
      '可设置定时发送，临行前一天自动提醒',
      '自动抄送所有旅伴，团队沟通无障碍',
      '支持添加行程变更提醒，保障信息实时同步'
    ],
    bgColor: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    color: '#e6a23c',
    tag1: '一键发送',
    tag2: '旅伴分享',
    icon1: 'Message',
    icon2: 'Share'
  },
  download: {
    title: '本地文件存储',
    features: [
      '支持 TXT、Markdown、Excel 等多格式下载',
      '云端极速生成，本地一键安全保存',
      '提供文件归档管理方案，历史行程永不丢失',
      '兼容各大主流操作系统，随时随地查阅'
    ],
    bgColor: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    color: '#67c23a',
    tag1: '极速下载',
    tag2: '格式丰富',
    icon1: 'Download',
    icon2: 'FolderChecked'
  }
}

const activeToolData = computed(() => toolsData[currentTab.value])

const toggleDeepThinking = () => {
  isDeepThinking.value = !isDeepThinking.value
}

const scrollToTools = () => {
  if (toolsSectionRef.value) {
    toolsSectionRef.value.scrollIntoView({ behavior: 'smooth' })
  }
}

// Typewriter effect state
const fullTitle = '嗨，欢迎使用 EtravelAI！'
const displayedTitle = ref('')
const isTypingComplete = ref(false)

// Quick Prompts
const quickPrompts = [
  '我要一个人去旅行，帮我推荐几个城市',
  '全家旅行推荐的地点',
  '第一次去西藏有什么注意事项？',
  '帮我规划一份成都三日游的美食攻略'
]

const handlePromptClick = (prompt) => {
  quickMessage.value = prompt
  handleQuickSend()
}

onMounted(() => {
  let currentIndex = 0
  const typeInterval = setInterval(() => {
    if (currentIndex < fullTitle.length) {
      displayedTitle.value += fullTitle.charAt(currentIndex)
      currentIndex++
    } else {
      clearInterval(typeInterval)
      isTypingComplete.value = true
    }
  }, 100) // 100ms per character
})

// Check if user is logged in
const checkLoginStatus = () => {
  const token = localStorage.getItem('accessToken')
  if (!token) {
    ElMessageBox.confirm(
      `
      <div style="text-align: center; padding: 20px 10px;">
        <div style="font-size: 24px; font-weight: 800; color: #1f2937; margin-bottom: 16px; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <span style="background: linear-gradient(135deg, #7c4dff, #409eff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">需要登录体验完整功能</span>
        </div>
        <p style="font-size: 16px; color: #4b5563; line-height: 1.8; margin-bottom: 12px; text-align: left;">
          智能体及深度思考功能需要调度<strong style="color: #7c4dff;">强大的云端计算资源</strong>。
        </p>
        <p style="font-size: 16px; color: #4b5563; line-height: 1.8; text-align: left;">
          为了给您提供更稳定、更专属的高级旅行规划服务，请您先进行登录。
        </p>
      </div>
      `,
      '',
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '立即登录',
        cancelButtonText: '暂不体验',
        customClass: 'premium-auth-dialog',
        showClose: false,
        center: true,
        confirmButtonClass: 'premium-confirm-btn'
      }
    ).then(() => {
      router.push('/login')
    }).catch(() => {
      // User cancelled
    })
    return false
  }
  return true
}

const navigateToAgent = () => {
  if (checkLoginStatus()) {
    router.push('/agent')
  }
}

const handleQuickSend = () => {
  if (!quickMessage.value.trim()) return
  
  if (isDeepThinking.value) {
    // Requires Login
    if (checkLoginStatus()) {
      router.push({
        path: '/agent',
        query: { initialMessage: quickMessage.value }
      })
    }
  } else {
    // Normal chat does not require login
    router.push({
      path: '/chat',
      query: { initialMessage: quickMessage.value }
    })
  }
}
</script>

<style scoped>
.home-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.hero-section {
  min-height: calc(100vh - 80px); /* Adjust for header height */
  display: flex;
  flex-direction: column;
  justify-content: flex-start; /* Changed from center to flex-start to prevent top cutoff */
  position: relative;
  /* Premium modern gradient matching enterprise AI feel */
  background-color: #f8fafc;
  background-image: 
    radial-gradient(at 0% 0%, rgba(64, 158, 255, 0.08) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(156, 39, 176, 0.05) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(64, 158, 255, 0.08) 0px, transparent 50%),
    radial-gradient(at 0% 100%, rgba(233, 30, 99, 0.05) 0px, transparent 50%);
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: 
    linear-gradient(rgba(64, 158, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(64, 158, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: 0;
  pointer-events: none;
}

.center-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px; /* Increased top padding */
  position: relative;
  z-index: 1;
  min-height: 500px; /* Ensure a minimum height for the center content */
}

.title-section {
  text-align: center;
  margin-bottom: 40px;
}

.main-title {
  font-size: 56px;
  font-weight: 800;
  margin: 0 0 20px 0;
  color: #1f2937;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cursor {
  display: inline-block;
  width: 4px;
  height: 56px;
  background-color: #409eff;
  margin-left: 8px;
  vertical-align: middle;
}

.cursor.blink {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.sub-title {
  font-size: 18px;
  color: #4b5563;
  margin: 0;
  letter-spacing: 2px;
  opacity: 0;
  transform: translateY(10px);
}

.sub-title.fade-in {
  animation: fadeInUp 0.8s ease forwards;
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.chat-input-wrapper {
  width: 100%;
  max-width: 900px;
}

.chat-input-box {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 1);
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.3s ease;
}

.chat-input-box:focus-within {
  box-shadow: 0 16px 48px rgba(64, 158, 255, 0.12);
  transform: translateY(-2px);
}

:deep(.custom-textarea .el-textarea__inner) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  font-size: 18px;
  line-height: 1.6;
  resize: none;
  color: #1f2937;
}

:deep(.custom-textarea .el-textarea__inner::placeholder) {
  color: #9ca3af;
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.left-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  background-color: rgba(244, 244, 245, 0.8);
  border: none;
  color: #4b5563;
  transition: all 0.3s ease;
  font-weight: 500;
  padding: 8px 20px;
}

.action-btn:hover {
  color: #409eff;
  background-color: #ecf5ff;
  transform: translateY(-1px);
}

.action-btn.is-active {
  color: #409eff;
  background-color: #ecf5ff;
  border: 1px solid rgba(179, 216, 255, 0.6);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
}

.send-btn {
  width: 48px;
  height: 48px;
  font-size: 22px;
  background: linear-gradient(135deg, #409eff 0%, #3a8ee6 100%);
  border: none;
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
}

.send-btn:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 12px 24px rgba(64, 158, 255, 0.4);
}

.quick-prompts-wrapper {
  width: 100%;
  max-width: 900px;
  margin-top: 32px;
}

.quick-prompts {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
}

.prompt-bubble {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  padding: 10px 20px;
  border-radius: 24px;
  font-size: 15px;
  font-weight: 500;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.prompt-bubble:hover {
  background: #ffffff;
  color: #409eff;
  border-color: #c6e2ff;
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.15);
}

.bottom-features {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 24px 80px 24px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  width: 100%;
  max-width: 1500px;
  justify-content: center;
}

.card {
  width: 100%;
  height: 260px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 1);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  background: transparent;
  transition: all 0.4s ease;
}

.card:nth-child(1)::before { background: linear-gradient(90deg, #409eff, #85c1ff); }
.card:nth-child(2)::before { background: linear-gradient(90deg, #9c27b0, #d05ce3); }
.card:nth-child(3)::before { background: linear-gradient(90deg, #673ab7, #9a67ea); }
.card:nth-child(4)::before { background: linear-gradient(90deg, #e91e63, #ff6098); }

.card:hover {
  transform: translateY(-12px);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.12);
  background: #ffffff;
}

.card:nth-child(1) { border-top-color: #409eff; }
.card:nth-child(2) { border-top-color: #9c27b0; }
.card:nth-child(3) { border-top-color: #673ab7; }
.card:nth-child(4) { border-top-color: #e91e63; }

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-bottom: 24px;
}

.card-icon.blue { background: #ecf5ff; color: #409eff; }
.card-icon.purple { background: #f4eafe; color: #9c27b0; }
.card-icon.indigo { background: #f0ebf8; color: #673ab7; }
.card-icon.pink { background: #fde8ef; color: #e91e63; }

.card-title {
  font-size: 22px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 16px 0;
}

.card-desc {
  font-size: 15px;
  color: #6b7280;
  line-height: 1.8;
  margin: 0;
}

/* Tool Center Section Styles */
.tool-center-section {
  width: 100%;
  min-height: calc(100vh - 60px); /* Fill the screen minus the header */
  background-color: #f8fafc;
  background-image: 
    radial-gradient(at 10% 10%, rgba(64, 158, 255, 0.08) 0px, transparent 40%),
    radial-gradient(at 90% 10%, rgba(156, 39, 176, 0.08) 0px, transparent 40%),
    radial-gradient(at 50% 50%, rgba(103, 58, 183, 0.05) 0px, transparent 60%),
    radial-gradient(at 10% 90%, rgba(233, 30, 99, 0.08) 0px, transparent 40%),
    radial-gradient(at 90% 90%, rgba(64, 158, 255, 0.08) 0px, transparent 40%);
  padding: 60px 24px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.tool-center-section::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: 
    linear-gradient(rgba(64, 158, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(64, 158, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: 0;
  pointer-events: none;
}

.header-section {
  text-align: center;
  margin-bottom: 50px;
  position: relative;
  z-index: 1;
}

.tools-main-title {
  font-size: 48px;
  font-weight: 800;
  color: #1f2937;
  margin: 0 0 16px 0;
  letter-spacing: 1px;
}

.highlight {
  color: #7c4dff;
  background: linear-gradient(135deg, #409eff 0%, #7c4dff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.tools-sub-title {
  font-size: 16px;
  color: #606266;
  margin: 0;
}

/* Tabs Navigation */
.tools-tabs {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 40px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  padding: 10px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 1;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.tab-item {
  padding: 14px 36px;
  font-size: 16px;
  font-weight: 500;
  color: #606266;
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.tab-item:hover {
  color: #409eff;
  background: rgba(255, 255, 255, 0.5);
}

.tab-item.active {
  background: #ffffff;
  color: #409eff;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transform: scale(1.02);
}

/* Tab Content Layout */
.tools-content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 1);
  border-radius: 32px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.08);
  padding: 60px;
  min-height: 500px;
  position: relative;
  z-index: 1;
}

.tools-content-inner {
  display: flex;
  gap: 80px;
  align-items: center;
}

.tool-info-side {
  flex: 1;
  padding-right: 20px;
}

.tool-title {
  font-size: 36px;
  font-weight: 800;
  color: #1f2937;
  margin: 0 0 32px 0;
  line-height: 1.3;
}

.tool-features {
  list-style: none;
  padding: 0;
  margin: 0 0 48px 0;
}

.tool-features li {
  position: relative;
  padding-left: 28px;
  margin-bottom: 20px;
  font-size: 16px;
  color: #4b5563;
  line-height: 1.8;
}

.tool-features li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 10px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff, #7c4dff);
  box-shadow: 0 0 8px rgba(64, 158, 255, 0.5);
}

.experience-btn {
  padding: 14px 40px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #409eff 0%, #3a8ee6 100%);
  border: none;
  box-shadow: 0 8px 20px rgba(64, 158, 255, 0.3);
  transition: all 0.3s ease;
  color: white;
}

.experience-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(64, 158, 255, 0.4);
}

.tool-illustration-side {
  flex: 1.2;
}

.illustration-box {
  width: 100%;
  height: 480px;
  border-radius: 24px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: background 0.5s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Mock UI Elements */
.mock-window {
  width: 85%;
  height: 75%;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.mock-header {
  height: 32px;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 6px;
  border-bottom: 1px solid #ebeef5;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.dot.red { background: #ff5f56; }
.dot.yellow { background: #ffbd2e; }
.dot.green { background: #27c93f; }

.mock-body {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

/* Common text line */
.mock-text-line {
  border-radius: 4px;
}

/* Search Mock UI */
.mock-search-ui {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}
.mock-search-input {
  background: #f4f4f5;
  padding: 8px 12px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
  font-size: 14px;
}
.mock-search-results {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.mock-result-card {
  display: flex;
  gap: 12px;
  background: #fafafa;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}
.mock-result-img {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  flex-shrink: 0;
}
.mock-result-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* PDF Mock UI */
.mock-pdf-ui {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f4f4f5;
  border-radius: 8px;
  overflow: hidden;
}
.mock-pdf-toolbar {
  background: #e4e7ed;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #606266;
}
.pdf-title {
  display: flex;
  align-items: center;
  gap: 6px;
}
.mock-pdf-page {
  flex: 1;
  background: #ffffff;
  margin: 12px;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

/* Email Mock UI */
.mock-email-ui {
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid #ebeef5;
  border-radius: 8px;
}
.mock-email-header {
  border-bottom: 1px solid #ebeef5;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #fafafa;
}
.email-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
.email-row .label {
  color: #909399;
  width: 40px;
}
.email-row .tag {
  background: #ecf5ff;
  color: #409eff;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}
.email-row .text {
  color: #303133;
  font-weight: 500;
}
.mock-email-body-content {
  padding: 16px;
  flex: 1;
}
.mock-email-attachment {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #f4f4f5;
  border-radius: 6px;
  width: fit-content;
  font-size: 13px;
  color: #606266;
  border: 1px solid #e4e7ed;
}

/* Download Mock UI */
.mock-download-ui {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.mock-download-header-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}
.mock-download-list-ui {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.mock-dl-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}
.dl-icon {
  font-size: 24px;
}
.dl-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.dl-name {
  font-size: 13px;
  color: #303133;
}
.dl-progress-bar {
  height: 4px;
  background: #ebeef5;
  border-radius: 2px;
  overflow: hidden;
}
.dl-progress-fill {
  height: 100%;
  border-radius: 2px;
}
.dl-speed {
  font-size: 12px;
  color: #909399;
}
.dl-status {
  font-size: 16px;
}

.floating-bubble {
  position: absolute;
  background: #ffffff;
  padding: 10px 20px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 10;
  animation: float 4s ease-in-out infinite;
}

.bubble-top { top: 15%; left: -5%; animation-delay: 0s; }
.bubble-bottom { bottom: 15%; right: -5%; animation-delay: 1s; }

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
  100% { transform: translateY(0px); }
}

@media (max-width: 1400px) {
  .tools-content-wrapper {
    width: 95%;
    padding: 60px 40px;
  }
  .tools-content-inner {
    gap: 60px;
  }
}

@media (max-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .tools-content-inner {
    flex-direction: column;
    gap: 40px;
  }
  .tool-info-side {
    padding-right: 0;
  }
  .tools-content-wrapper {
    padding: 40px 24px;
  }
  .hero-section {
    min-height: auto;
  }
}

@media (max-width: 768px) {
  .main-title {
    font-size: 32px;
  }
  .cursor {
    height: 32px;
  }
  .sub-title {
    font-size: 14px;
  }
  .chat-input-box {
    padding: 12px;
  }
  .bottom-features {
    padding-bottom: 40px;
  }
  .center-content {
    min-height: auto;
    padding-top: 40px;
    padding-bottom: 40px;
  }
}

@media (max-width: 600px) {
  .cards-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
