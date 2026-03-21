<template>
  <div class="home-container">
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

        <div class="card" @click="router.push('/agent')">
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
              <el-button type="primary" class="experience-btn" @click="router.push('/agent')">立即体验</el-button>
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
                  </div>
                  <div class="mock-body">
                    <div class="mock-line short"></div>
                    <div class="mock-line long"></div>
                    <div class="mock-line medium"></div>
                    <div class="mock-block">
                      <div class="mock-item"></div>
                      <div class="mock-item"></div>
                      <div class="mock-item"></div>
                    </div>
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
import { 
  ChatDotRound, Setting, User, Document, 
  Monitor, Top, Search, DataLine, Printer, 
  Message, Share, Download, FolderChecked 
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
      '作为国内AI Agent领域的先行者，2023年6月即已发布flow+知识库+数据库+插件形态，服务近10万团队',
      '行业领先提供完整AI Flow 开发框架、Flow GUI编辑器，集成各类工具集',
      '提供智能体开发所需的角色协同、多环境发布、版本管理、权限控制、数据监控等能力',
      '覆盖结构化/非结构化数据节点、API、Code、插件，提供批量、定时、API、Webhook等多种集成方式',
      '模型调优控制及code 模式满足复杂开发，全独立沙箱运行环境，高安全性和扩展性'
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

const handleQuickSend = () => {
  if (!quickMessage.value.trim()) return
  
  if (isDeepThinking.value) {
    router.push({
      path: '/agent',
      query: { initialMessage: quickMessage.value }
    })
  } else {
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
  /* Updated beautiful aesthetic gradient mimicking the image */
  background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
  background-image: radial-gradient(at top left, #fdfbfb 0%, transparent 50%),
                    radial-gradient(at top right, #e2ebf0 0%, transparent 50%),
                    radial-gradient(at bottom left, #fdfbfb 0%, transparent 50%),
                    radial-gradient(at bottom right, #ebedee 0%, transparent 50%);
  position: relative;
  overflow-y: auto;
}

.center-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  min-height: 500px; /* Ensure center content has enough breathing room */
}

.title-section {
  text-align: center;
  margin-bottom: 40px;
}

.main-title {
  font-size: 48px;
  font-weight: bold;
  margin: 0 0 16px 0;
  color: #303133;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cursor {
  display: inline-block;
  width: 3px;
  height: 48px;
  background-color: #303133;
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
  font-size: 16px;
  color: #606266;
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
  max-width: 800px;
}

.chat-input-box {
  background: #ffffff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

:deep(.custom-textarea .el-textarea__inner) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  font-size: 16px;
  line-height: 1.6;
  resize: none;
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
  background-color: #f4f4f5;
  border: none;
  color: #606266;
  transition: all 0.3s ease;
}

.action-btn:hover {
  color: #409eff;
  background-color: #ecf5ff;
}

.action-btn.is-active {
  color: #409eff;
  background-color: #ecf5ff;
  border: 1px solid #b3d8ff;
}

.send-btn {
  width: 40px;
  height: 40px;
  font-size: 18px;
}

.quick-prompts-wrapper {
  width: 100%;
  max-width: 800px;
  margin-top: 24px;
}

.quick-prompts {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.prompt-bubble {
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(235, 238, 245, 0.8);
  backdrop-filter: blur(8px);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.prompt-bubble:hover {
  background: #ffffff;
  color: #409eff;
  border-color: #c6e2ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);
}

.bottom-features {
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0 24px 60px 24px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  width: 100%;
  max-width: 1200px;
  justify-content: center;
}

.card {
  width: 100%;
  height: 240px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 32px 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-top: 4px solid transparent;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
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
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px 0;
}

.card-desc {
  font-size: 14px;
  color: #909399;
  line-height: 1.6;
  margin: 0;
}

/* Tool Center Section Styles */
.tool-center-section {
  width: 100%;
  background-color: #f8f9fc;
  padding: 80px 24px;
  box-sizing: border-box;
}

.header-section {
  text-align: center;
  margin-bottom: 60px;
}

.tools-main-title {
  font-size: 42px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 16px 0;
  letter-spacing: 1px;
}

.highlight {
  color: #7c4dff;
  background: linear-gradient(90deg, #409eff, #7c4dff);
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
  gap: 8px;
  margin-bottom: 40px;
  background: #ffffff;
  padding: 8px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.tab-item {
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 500;
  color: #606266;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
}

.tab-item:hover {
  color: #409eff;
}

.tab-item.active {
  background: #f4f4f5;
  color: #303133;
  font-weight: 600;
}

/* Tab Content Layout */
.tools-content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
  padding: 40px;
  min-height: 400px;
}

.tools-content-inner {
  display: flex;
  gap: 40px;
  align-items: center;
}

.tool-info-side {
  flex: 1;
  padding-right: 20px;
}

.tool-title {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin: 0 0 24px 0;
}

.tool-features {
  list-style: none;
  padding: 0;
  margin: 0 0 40px 0;
}

.tool-features li {
  position: relative;
  padding-left: 20px;
  margin-bottom: 16px;
  font-size: 15px;
  color: #606266;
  line-height: 1.6;
}

.tool-features li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 8px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #303133;
}

.experience-btn {
  padding: 12px 32px;
  font-size: 16px;
  border-radius: 8px;
}

.tool-illustration-side {
  flex: 1.2;
}

.illustration-box {
  width: 100%;
  height: 360px;
  border-radius: 20px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: background 0.5s ease;
}

/* Mock UI Elements */
.mock-window {
  width: 80%;
  height: 70%;
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
  gap: 12px;
}

.mock-line {
  height: 8px;
  background: #f4f4f5;
  border-radius: 4px;
}
.mock-line.short { width: 30%; }
.mock-line.medium { width: 60%; }
.mock-line.long { width: 90%; }

.mock-block {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.mock-item {
  flex: 1;
  height: 60px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px dashed #e4e7ed;
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

@media (max-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(2, 1fr);
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
