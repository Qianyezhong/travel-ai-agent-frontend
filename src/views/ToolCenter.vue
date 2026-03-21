<template>
  <div class="tool-center-container">
    <div class="header-section">
      <h1 class="main-title">EtravelAI，为你的旅行注入<span class="highlight">智能动力</span></h1>
      <p class="sub-title">探索我们提供的专业工具，让旅行规划变得前所未有的简单</p>
    </div>

    <div class="cards-grid">
      <!-- Search Tool -->
      <div class="tool-card">
        <div class="card-tag search-tag">搜索工具</div>
        <h3 class="card-title">专业旅行搜索</h3>
        <p class="card-desc">精准挖掘，高效规划</p>
        <ul class="feature-list">
          <li>智能挖掘 & 分析全网旅游线索</li>
          <li>实时获取景点、酒店最新动态</li>
          <li>智能比价，保障出行高性价比</li>
        </ul>
        <div class="card-illustration">
          <div class="floating-bubble bubble-1"><el-icon><Search /></el-icon> 实时检索</div>
          <div class="floating-bubble bubble-2"><el-icon><DataLine /></el-icon> 智能比价</div>
        </div>
      </div>

      <!-- PDF Tool -->
      <div class="tool-card">
        <div class="card-tag pdf-tag">PDF生成</div>
        <h3 class="card-title">一键攻略导出</h3>
        <p class="card-desc">排版精美，随时查看</p>
        <ul class="feature-list">
          <li>将对话规划一键转为PDF文档</li>
          <li>自带精美排版与路线时间轴</li>
          <li>支持离线保存，旅途中随时翻阅</li>
        </ul>
        <div class="card-illustration">
          <div class="floating-bubble bubble-3"><el-icon><Document /></el-icon> 攻略生成</div>
          <div class="floating-bubble bubble-4"><el-icon><Printer /></el-icon> 离线可用</div>
        </div>
      </div>

      <!-- Email Tool -->
      <div class="tool-card">
        <div class="card-tag email-tag">邮件工具</div>
        <h3 class="card-title">QQ邮箱自动发送</h3>
        <p class="card-desc">行程分享，一键送达</p>
        <ul class="feature-list">
          <li>支持将生成的攻略直接发至邮箱</li>
          <li>自动抄送旅伴，团队沟通无碍</li>
          <li>行程变更提醒，保障信息同步</li>
        </ul>
        <div class="card-illustration">
          <div class="floating-bubble bubble-5"><el-icon><Message /></el-icon> 一键发送</div>
          <div class="floating-bubble bubble-6"><el-icon><Share /></el-icon> 旅伴分享</div>
        </div>
      </div>

      <!-- Download Tool -->
      <div class="tool-card">
        <div class="card-tag download-tag">下载工具</div>
        <h3 class="card-title">本地文件存储</h3>
        <p class="card-desc">安全可靠，管理方便</p>
        <ul class="feature-list">
          <li>支持 TXT/Markdown 多格式下载</li>
          <li>云端生成，本地极速保存</li>
          <li>文件归档管理，历史行程不丢失</li>
        </ul>
        <div class="card-illustration">
          <div class="floating-bubble bubble-7"><el-icon><Download /></el-icon> 极速下载</div>
          <div class="floating-bubble bubble-8"><el-icon><FolderChecked /></el-icon> 格式丰富</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  Search, DataLine, Document, Printer, 
  Message, Share, Download, FolderChecked 
} from '@element-plus/icons-vue'
</script>

<style scoped>
.tool-center-container {
  height: 100%;
  width: 100%;
  background-color: #f8f9fc;
  overflow-y: auto;
  padding: 60px 24px;
  box-sizing: border-box;
}

.header-section {
  text-align: center;
  margin-bottom: 60px;
}

.main-title {
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

.sub-title {
  font-size: 16px;
  color: #606266;
  margin: 0;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  max-width: 1300px;
  margin: 0 auto;
}

.tool-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 32px 28px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.tool-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.08);
}

.card-tag {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 24px;
  align-self: flex-start;
}

.search-tag { background: #f0f5ff; color: #409eff; }
.pdf-tag { background: #fdf0f0; color: #f56c6c; }
.email-tag { background: #fdf6ec; color: #e6a23c; }
.download-tag { background: #f0f9eb; color: #67c23a; }

.card-title {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 12px 0;
}

.card-desc {
  font-size: 15px;
  color: #606266;
  margin: 0 0 24px 0;
  font-weight: 500;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0 0 40px 0;
  flex: 1;
}

.feature-list li {
  position: relative;
  padding-left: 16px;
  margin-bottom: 12px;
  font-size: 13px;
  color: #909399;
  line-height: 1.5;
}

.feature-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 6px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #c0c4cc;
}

.card-illustration {
  height: 140px;
  background: #f8f9fb;
  border-radius: 16px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-bubble {
  position: absolute;
  background: #ffffff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 6px;
  animation: float 4s ease-in-out infinite;
}

.floating-bubble .el-icon {
  font-size: 16px;
}

.bubble-1 { top: 20%; left: 10%; color: #409eff; animation-delay: 0s; }
.bubble-2 { bottom: 20%; right: 10%; color: #7c4dff; animation-delay: 1s; }
.bubble-3 { top: 25%; right: 15%; color: #f56c6c; animation-delay: 0.5s; }
.bubble-4 { bottom: 25%; left: 15%; color: #e6a23c; animation-delay: 1.5s; }
.bubble-5 { top: 20%; left: 20%; color: #e6a23c; animation-delay: 0.2s; }
.bubble-6 { bottom: 20%; right: 20%; color: #409eff; animation-delay: 1.2s; }
.bubble-7 { top: 30%; right: 10%; color: #67c23a; animation-delay: 0.8s; }
.bubble-8 { bottom: 30%; left: 10%; color: #7c4dff; animation-delay: 1.8s; }

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

@media (max-width: 768px) {
  .main-title {
    font-size: 32px;
  }
  .tool-center-container {
    padding: 32px 16px;
  }
}
</style>
