<template>
  <div class="home-container">
    <div class="title-section">
      <h1 class="main-title">EtravelAI</h1>
      <p class="sub-title">智能旅游AI助手平台</p>
    </div>

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
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ChatDotRound, Setting, User, Document } from '@element-plus/icons-vue'

const router = useRouter()
</script>

<style scoped>
.home-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
}

.title-section {
  text-align: center;
  margin-bottom: 60px;
}

.main-title {
  font-size: 64px;
  font-weight: bold;
  margin: 0 0 16px 0;
  background: linear-gradient(90deg, #7F7FD5 0%, #86A8E7 50%, #91EAE4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 2px;
}

.sub-title {
  font-size: 20px;
  color: #606266;
  margin: 0;
  letter-spacing: 4px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  max-width: 1200px;
  width: 100%;
  justify-content: center;
}

.card {
  width: 100%;
  height: 280px;
  background: #ffffff;
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

@media (max-width: 600px) {
  .home-container {
    padding-top: 40px;
    justify-content: flex-start;
  }
  .cards-grid {
    grid-template-columns: repeat(1, 1fr);
  }
  .main-title {
    font-size: 40px;
  }
  .sub-title {
    font-size: 16px;
  }
  .title-section {
    margin-bottom: 30px;
  }
}
</style>
