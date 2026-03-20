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

        <div class="card" @click="router.push('/tool-center')">
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ChatDotRound, Setting, User, Document, 
  Monitor, Top 
} from '@element-plus/icons-vue'

const router = useRouter()
const quickMessage = ref('')
const isDeepThinking = ref(false)

const toggleDeepThinking = () => {
  isDeepThinking.value = !isDeepThinking.value
}

// Typewriter effect state
const fullTitle = '嗨，欢迎使用 EtravelAI！'
const displayedTitle = ref('')
const isTypingComplete = ref(false)

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
  // Navigate to chat page and pass the message via query parameter or state
  // For now, we'll just redirect to the chat page
  router.push({
    path: '/chat',
    query: { initialMessage: quickMessage.value }
  })
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
