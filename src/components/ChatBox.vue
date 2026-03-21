<template>
  <div class="chat-layout">
    <!-- Desktop Sidebar -->
    <div class="sidebar desktop-sidebar">
      <div class="sidebar-header">
        <span class="sidebar-title">会话管理</span>
        <el-button type="primary" size="small" round class="new-chat-btn" @click="createNewChat">
          + 新增会话
        </el-button>
      </div>
      <div class="session-list">
        <div 
          v-for="session in sessions" 
          :key="session.id"
          class="session-item"
          :class="{ active: currentSessionId === session.id }"
          @click="switchSession(session.id)"
        >
          <el-icon><ChatLineRound /></el-icon>
          <span class="session-title">{{ session.title }}</span>
          <el-icon class="delete-icon" @click.stop="deleteSession(session.id)"><Delete /></el-icon>
        </div>
      </div>
    </div>

    <!-- Mobile Sidebar Drawer -->
    <el-drawer
      v-model="drawerVisible"
      direction="ltr"
      size="260px"
      :with-header="false"
      class="mobile-sidebar-drawer"
    >
      <div class="sidebar mobile-sidebar">
        <div class="sidebar-header">
          <span class="sidebar-title">会话管理</span>
          <el-button type="primary" size="small" round class="new-chat-btn" @click="createNewChat">
            + 新增会话
          </el-button>
        </div>
        <div class="session-list">
          <div 
            v-for="session in sessions" 
            :key="'mobile-'+session.id"
            class="session-item"
            :class="{ active: currentSessionId === session.id }"
            @click="switchSession(session.id); drawerVisible = false"
          >
            <el-icon><ChatLineRound /></el-icon>
            <span class="session-title">{{ session.title }}</span>
            <el-icon class="delete-icon" @click.stop="deleteSession(session.id)"><Delete /></el-icon>
          </div>
        </div>
      </div>
    </el-drawer>

    <!-- Main Chat Area -->
    <div class="chat-main">
      <div class="chat-header">
        <el-icon class="mobile-toggle-btn" @click="drawerVisible = true"><Expand /></el-icon>
        {{ title }}
      </div>
      
      <div class="message-list" ref="messageListRef">
        <div 
          v-for="(msg, index) in messages" 
          :key="index"
          class="message-wrapper"
          :class="msg.role === 'user' ? 'message-right' : 'message-left'"
        >
          <div class="avatar" :class="msg.role === 'agent' ? 'ai' : msg.role">
            <template v-if="msg.role === 'user'">我</template>
            <template v-else>AI</template>
          </div>
          <div class="message-content" :class="{ 'is-agent': msg.role === 'agent' }">
            <!-- Normal Text Message or Unified Agent Message -->
            <div class="bubble" :class="msg.role">
              
              <!-- Agent Hierarchical Content -->
              <template v-if="msg.role === 'agent'">
                
                <!-- Main Thinking Process (Top Level) -->
                <div v-if="msg.thinking" class="nested-step">
                  <div class="nested-step-header" @click="msg.thinkingExpanded = !msg.thinkingExpanded">
                    <div class="nested-step-title">
                      <el-icon><Connection /></el-icon> 思考过程
                    </div>
                    <el-icon class="expand-icon" :class="{ 'is-expanded': msg.thinkingExpanded }"><ArrowRight /></el-icon>
                  </div>
                  <el-collapse-transition>
                    <div v-show="msg.thinkingExpanded" class="nested-step-body">
                      {{ msg.thinking }}
                    </div>
                  </el-collapse-transition>
                </div>

                <!-- Main Text Content (Task Plan or normal text) -->
                <div v-if="msg.content" class="agent-text-content" v-html="formatContent(msg.content)"></div>

                <!-- Sub Steps (Tool Calls, further thinking) -->
                <div v-if="msg.steps && msg.steps.length > 0" class="agent-steps-container">
                  <template v-for="(step, stepIndex) in msg.steps" :key="stepIndex">
                    
                    <!-- Conclusion Step -->
                    <div v-if="step.type === 'conclusion'" class="conclusion-step">
                      <div class="conclusion-header">
                        <el-icon><CircleCheckFilled /></el-icon>
                        <span>{{ step.title || '结论' }}</span>
                      </div>
                      <div class="conclusion-body" v-html="formatContent(step.content)"></div>
                    </div>

                    <!-- Normal Tool Step -->
                    <div v-else class="nested-step tool-step">
                      <div class="nested-step-header" @click="step.expanded = !step.expanded">
                      <div class="nested-step-title tool-title">
                        <el-icon v-if="step.status === 'success'"><Select color="#67c23a" /></el-icon>
                        <el-icon v-else-if="step.status === 'loading'" class="is-loading"><Loading color="#409eff" /></el-icon>
                        <el-icon v-else><Document /></el-icon>
                        <span>{{ step.title }}</span>
                      </div>
                      <el-icon class="expand-icon" :class="{ 'is-expanded': step.expanded }"><ArrowRight /></el-icon>
                    </div>
                    
                    <el-collapse-transition>
                      <div v-show="step.expanded" class="nested-step-body">
                        <!-- Step's own thinking -->
                        <div v-if="step.thinking" class="nested-step inner-thinking">
                           <div class="nested-step-header" @click="step.thinkingExpanded = !step.thinkingExpanded">
                            <div class="nested-step-title">
                              <el-icon><Connection /></el-icon> 思考过程
                            </div>
                            <el-icon class="expand-icon" :class="{ 'is-expanded': step.thinkingExpanded }"><ArrowRight /></el-icon>
                          </div>
                          <el-collapse-transition>
                            <div v-show="step.thinkingExpanded" class="nested-step-body">
                              {{ step.thinking }}
                            </div>
                          </el-collapse-transition>
                        </div>
                        
                        <!-- Tool call visual -->
                        <div class="tool-call-tag" v-if="step.toolName">
                          <el-icon><Link /></el-icon> 调用工具: {{ step.toolName }}
                        </div>

                        <!-- Tool Loading State -->
                        <div class="tool-loading-box" v-if="step.status === 'loading' && !step.content">
                          <el-icon class="is-loading"><Loading /></el-icon>
                          <span>正在执行工具调用并等待返回结果...</span>
                        </div>

                        <!-- Tool Result -->
                        <div class="tool-result-box" v-else-if="step.content">
                          <el-icon class="result-icon"><Document /></el-icon>
                          <div class="result-text">
                            
                            <!-- File Download Card -->
                            <div v-if="step.fileInfo" class="file-download-card" @click="downloadFile(step.fileInfo)">
                              <div class="file-icon" :class="step.fileInfo.ext">
                                <el-icon v-if="['jpg','jpeg','png'].includes(step.fileInfo.ext)"><Picture /></el-icon>
                                <el-icon v-else-if="step.fileInfo.ext === 'pdf'"><Document /></el-icon>
                                <el-icon v-else><Tickets /></el-icon>
                              </div>
                              <div class="file-details">
                                <span class="file-name">{{ step.fileInfo.name }}</span>
                                <span class="file-hint">点击下载文件</span>
                              </div>
                              <el-icon class="download-icon"><Download /></el-icon>
                            </div>

                            <!-- Array of Search Results or items -->
                            <template v-if="Array.isArray(step.content)">
                              <div class="search-result-list">
                                <div v-for="(item, i) in step.content" :key="i" class="search-result-item">
                                  <a v-if="item.link" :href="item.link" target="_blank" class="search-title">{{ item.title || item.name || '链接' }}</a>
                                  <div v-else class="search-title">{{ item.title || item.name || `结果 ${i + 1}` }}</div>
                                  <div class="search-snippet">{{ item.snippet || item.description || item.content || JSON.stringify(item) }}</div>
                                </div>
                              </div>
                            </template>
                            <!-- Object Result -->
                            <template v-else-if="typeof step.content === 'object'">
                              <pre class="json-result">{{ JSON.stringify(step.content, null, 2) }}</pre>
                            </template>
                            <!-- String Result -->
                            <template v-else>
                              {{ step.content }}
                            </template>
                          </div>
                        </div>
                      </div>
                    </el-collapse-transition>
                    </div>
                  </template>
                </div>

              </template>

              <!-- Normal User/AI Content -->
              <template v-else>
                {{ msg.content }}
              </template>
            </div>

            <div class="actions" v-if="msg.role === 'ai' || msg.role === 'agent'">
              <el-icon class="copy-icon" @click="copyText(msg.content)"><CopyDocument /></el-icon>
            </div>
          </div>
        </div>
      </div>

      <div class="input-area">
        <div class="input-box">
          <el-input
            v-model="inputMessage"
            type="textarea"
            :rows="3"
            placeholder="请输入您的问题..."
            resize="none"
            @keydown.enter.prevent="handleSend"
          />
          <div class="input-footer">
            <span class="hint">按 Enter 发送，Ctrl+Enter 换行</span>
            <div class="right-actions">
              <el-button type="primary" circle class="send-btn" @click="handleSend" :disabled="!inputMessage.trim() || loading">
                <el-icon><Position /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { 
  ChatLineRound, Delete, CopyDocument, Position, 
  Expand, Monitor, Connection, Setting, Select, ArrowRight, Link,
  Document, Aim, CaretTop, Loading, CircleCheckFilled, Download,
  Picture, Tickets
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

const props = defineProps({
  title: {
    type: String,
    default: 'AI 智能助手'
  },
  loading: {
    type: Boolean,
    default: false
  },
  messages: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['send', 'clear', 'switch-session', 'new-session', 'delete-session'])

const sessions = ref([
  { id: '1', title: '新会话' }
])
const currentSessionId = ref('1')
const inputMessage = ref('')
const messageListRef = ref(null)
const drawerVisible = ref(false)

const createNewChat = () => {
  const newId = Date.now().toString()
  sessions.value.unshift({ id: newId, title: '新会话' })
  currentSessionId.value = newId
  emit('new-session', newId)
}

const switchSession = (id) => {
  currentSessionId.value = id
  emit('switch-session', id)
}

const deleteSession = async (id) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除该对话吗？此操作将永久删除该会话记录，不可恢复。',
      '删除会话',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'delete-confirm-box',
        confirmButtonClass: 'delete-confirm-btn',
        icon: Delete
      }
    )
    
    // Call backend API
    await axios.delete(`http://localhost:8123/api/ai/trave_app/delete`, {
      params: { conversationId: id }
    })
    
    // Remove from local list
    sessions.value = sessions.value.filter(s => s.id !== id)
    emit('delete-session', id)
    
    if (currentSessionId.value === id) {
      if (sessions.value.length > 0) {
        switchSession(sessions.value[0].id)
      } else {
        createNewChat()
      }
    }
    
    ElMessage.success('会话已成功删除')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Delete failed:', error)
      ElMessage.error('删除失败，请稍后重试')
    }
  }
}

const handleSend = (e) => {
  if (e && e.ctrlKey) {
    inputMessage.value += '\n'
    return
  }
  if (!inputMessage.value.trim() || props.loading) return
  
  emit('send', inputMessage.value.trim(), currentSessionId.value)
  inputMessage.value = ''
}

const formatContent = (content) => {
  if (!content) return ''
  if (typeof content !== 'string') {
    try { content = JSON.stringify(content, null, 2) } catch(e) {}
  }
  let formatted = content
  
  // Handle markdown bold
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // Handle basic markdown links
  formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="chat-link">$1</a>')
  
  // Handle line breaks and plan items
  formatted = formatted.replace(/\n/g, '<br>')
                .replace(/(\d+\.\s.*?)(<br>|$)/g, '<div class="plan-item">$1</div>')
                
  return formatted
}

const copyText = (text) => {
  navigator.clipboard.writeText(text)
  ElMessage.success('复制成功')
}

const downloadFile = (fileInfo) => {
  if (!fileInfo || !fileInfo.url) {
    ElMessage.error('无法获取文件下载链接')
    return
  }
  // Open download link in a new tab/window
  window.open(fileInfo.url, '_blank')
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
}

watch(() => props.messages, () => {
  scrollToBottom()
}, { deep: true })

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-layout {
  display: flex;
  height: 100%;
  width: 100%;
  background-color: #f5f7fa;
}

/* Make sure el-message-box styles are available globally if scoped causes issues, 
   but for now we use deep or standard class names */
:deep(.delete-confirm-box) {
  border-radius: 12px;
}
:deep(.delete-confirm-btn) {
  background-color: #f56c6c !important;
  border-color: #f56c6c !important;
}
:deep(.delete-confirm-btn:hover) {
  background-color: #f78989 !important;
  border-color: #f78989 !important;
}

.sidebar {
  width: 260px;
  background: #ffffff;
  border-right: 1px solid #ebeef5;
  display: flex;
  flex-direction: column;
  margin: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.desktop-sidebar {
  display: flex;
}

.mobile-sidebar {
  margin: 0;
  height: 100%;
  border-radius: 0;
  box-shadow: none;
  border-right: none;
}

.mobile-toggle-btn {
  display: none;
  margin-right: 12px;
  cursor: pointer;
  font-size: 20px;
  vertical-align: middle;
}

.sidebar-header {
  padding: 20px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
}

.sidebar-title {
  font-weight: 600;
  color: #303133;
}

.new-chat-btn {
  background: #f4f4f5;
  border: none;
  color: #409eff;
}

.session-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}

.session-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 8px;
  color: #606266;
  transition: all 0.3s;
}

.session-item:hover {
  background: #f5f7fa;
}

.session-item.active {
  background: linear-gradient(90deg, #409eff 0%, #53a8ff 100%);
  color: #ffffff;
}

.session-title {
  flex: 1;
  margin: 0 12px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.delete-icon {
  opacity: 0;
  transition: opacity 0.3s;
}

.session-item:hover .delete-icon,
.session-item.active .delete-icon {
  opacity: 1;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  margin: 16px 16px 16px 0;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.chat-header {
  padding: 20px 24px;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  border-bottom: 1px solid #ebeef5;
  display: flex;
  align-items: center;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.message-wrapper {
  display: flex;
  gap: 16px;
  max-width: 80%;
}

.message-left {
  align-self: flex-start;
}

.message-right {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #fff;
  flex-shrink: 0;
}

.avatar.ai {
  background: #673ab7;
}

.avatar.user {
  background: #409eff;
}

.avatar.agent {
  background: #2b3a4a;
  font-size: 20px;
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.message-right .message-content {
  align-items: flex-end;
}

.bubble {
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
  white-space: pre-wrap;
  display: inline-block;
}

.bubble.ai, .bubble.agent {
  background: #f8f9fb;
  color: #303133;
  border-top-left-radius: 4px;
  width: 100%;
}

.bubble.user {
  background: #e6f1fc;
  color: #303133;
  border-top-right-radius: 4px;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

/* Agent Hierarchical Styles */
.agent-text-content {
  margin: 12px 0;
  padding: 0;
  color: #303133;
  line-height: 1.6;
}

:deep(.plan-item) {
  margin-top: 8px;
  padding-left: 12px;
  position: relative;
}

:deep(.plan-item::before) {
  content: "";
  position: absolute;
  left: 0;
  top: 8px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #409eff;
}

.nested-step {
  margin-bottom: 12px;
  border-radius: 8px;
  background: #ffffff;
  border: 1px solid #ebeef5;
  overflow: hidden;
}

.nested-step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 12px 16px;
  background: #fbfbfc;
  transition: background 0.3s;
  color: #606266;
}

.nested-step-header:hover {
  background: #f5f7fa;
}

.nested-step-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
}

.tool-step {
  border-left: 3px solid #409eff;
}

.tool-title {
  color: #303133;
}

.tool-title .el-icon {
  color: #409eff;
  font-size: 16px;
}

.inner-thinking {
  margin-bottom: 16px;
  border: 1px dashed #e4e7ed;
}

.nested-step-body {
  padding: 16px;
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  white-space: pre-wrap;
  border-top: 1px solid #ebeef5;
  background: #ffffff;
}

.tool-call-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f4f4f5;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 500;
  color: #606266;
  margin-bottom: 12px;
  border: 1px solid #e4e7ed;
  font-size: 13px;
}

.tool-result-box {
  display: flex;
  gap: 12px;
  background: #f8f9fb;
  padding: 12px;
  border-radius: 8px;
  color: #303133;
  border: 1px solid #ebeef5;
}

.conclusion-step {
  background: #fdf6ec;
  border: 1px solid #faecd8;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
  margin-bottom: 12px;
}

.conclusion-header {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #303133;
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 12px;
}

.conclusion-header .el-icon {
  font-size: 18px;
}

.conclusion-body {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.tool-loading-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f4f9ff;
  padding: 12px;
  border-radius: 8px;
  color: #409eff;
  border: 1px dashed #a0cfff;
  font-size: 13px;
}

:deep(.chat-link) {
  color: #409eff;
  text-decoration: none;
}

:deep(.chat-link:hover) {
  text-decoration: underline;
}

:deep(strong) {
  font-weight: 600;
  color: #303133;
}

.result-icon {
  font-size: 24px;
  color: #409eff;
  background: #ffffff;
  padding: 8px;
  border-radius: 6px;
}

.result-text {
  flex: 1;
  word-break: break-word;
  overflow: hidden;
}

.search-result-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.search-result-item {
  background: #ffffff;
  border: 1px solid #ebeef5;
  padding: 12px;
  border-radius: 8px;
  transition: box-shadow 0.3s;
}

.search-result-item:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.search-title {
  font-size: 14px;
  font-weight: 600;
  color: #409eff;
  text-decoration: none;
  margin-bottom: 6px;
  display: block;
}

a.search-title:hover {
  text-decoration: underline;
}

.search-snippet {
  font-size: 13px;
  color: #606266;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.json-result {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
  font-family: monospace;
  font-size: 13px;
  color: #303133;
}

.file-download-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #ffffff;
  border: 1px solid #ebeef5;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 12px;
}

.file-download-card:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);
  transform: translateY(-2px);
}

.file-download-card:hover .download-icon {
  color: #409eff;
  transform: scale(1.1);
}

.file-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #ffffff;
}

.file-icon.pdf { background: #f56c6c; }
.file-icon.txt { background: #909399; }
.file-icon.png, .file-icon.jpg, .file-icon.jpeg { background: #67c23a; }
.file-icon { background: #409eff; } /* Default */

.file-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow: hidden;
}

.file-name {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-hint {
  font-size: 12px;
  color: #909399;
}

.download-icon {
  font-size: 20px;
  color: #c0c4cc;
  transition: all 0.3s ease;
}

.actions {
  display: flex;
  gap: 8px;
  color: #909399;
}

.actions .el-icon {
  cursor: pointer;
  padding: 4px;
}

.actions .el-icon:hover {
  color: #409eff;
}

.input-area {
  padding: 20px 24px;
  border-top: 1px solid #ebeef5;
}

.input-box {
  background: #f5f7fa;
  border-radius: 12px;
  padding: 12px 16px;
  border: 1px solid #ebeef5;
  transition: border-color 0.3s;
}

.input-box:focus-within {
  border-color: #409eff;
  background: #ffffff;
}

:deep(.el-textarea__inner) {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  font-size: 14px;
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.hint {
  font-size: 12px;
  color: #909399;
}

.right-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.send-btn {
  width: 32px;
  height: 32px;
}

@media (max-width: 768px) {
  .desktop-sidebar {
    display: none;
  }
  .mobile-toggle-btn {
    display: inline-flex;
  }
  .chat-main {
    margin: 0;
    border-radius: 0;
    box-shadow: none;
  }
  .message-wrapper {
    max-width: 95%;
  }
  .input-area {
    padding: 12px;
  }
  .chat-header {
    padding: 16px;
  }
  .message-list {
    padding: 16px;
  }
  .bubble {
    font-size: 13px;
    padding: 10px 14px;
  }
  .avatar {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
}
</style>
