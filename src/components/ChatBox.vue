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
          <div class="avatar" :class="msg.role">
            <template v-if="msg.role === 'user'">我</template>
            <template v-else-if="msg.role === 'ai'">AI</template>
            <el-icon v-else-if="msg.role === 'agent'"><Monitor /></el-icon>
          </div>
          <div class="message-content">
            <!-- Normal Text Message -->
            <div v-if="!msg.isAgentStep" class="bubble" :class="msg.role">
              {{ msg.content }}
            </div>
            
            <!-- Agent Step Message -->
            <div v-else class="agent-step-bubble">
              <div class="agent-step-header" @click="msg.expanded = !msg.expanded">
                <div class="agent-step-title">
                  <el-icon v-if="msg.stepType === 'thinking'"><Connection /></el-icon>
                  <el-icon v-else-if="msg.stepType === 'tool'"><Setting /></el-icon>
                  <el-icon v-else-if="msg.stepType === 'success'" class="success-icon"><Select /></el-icon>
                  <span>{{ msg.stepTitle }}</span>
                </div>
                <el-icon class="expand-icon" :class="{ 'is-expanded': msg.expanded }"><ArrowRight /></el-icon>
              </div>
              <el-collapse-transition>
                <div v-show="msg.expanded" class="agent-step-body">
                  <div v-if="msg.stepType === 'thinking'" class="thinking-content">
                    {{ msg.content }}
                  </div>
                  <div v-else-if="msg.stepType === 'tool'" class="tool-content">
                    <div class="tool-call">
                      <el-icon><Link /></el-icon> 调用工具: {{ msg.toolName }}
                    </div>
                    <div class="tool-result" v-if="msg.content">
                      {{ msg.content }}
                    </div>
                  </div>
                  <div v-else class="thinking-content">
                     {{ msg.content }}
                  </div>
                </div>
              </el-collapse-transition>
            </div>

            <div class="actions" v-if="msg.role === 'ai' && !msg.isAgentStep">
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
  Expand, Monitor, Connection, Setting, Select, ArrowRight, Link
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

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

const emit = defineEmits(['send', 'clear'])

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
  emit('clear')
}

const switchSession = (id) => {
  currentSessionId.value = id
  emit('clear')
}

const deleteSession = (id) => {
  sessions.value = sessions.value.filter(s => s.id !== id)
  if (currentSessionId.value === id) {
    if (sessions.value.length > 0) {
      switchSession(sessions.value[0].id)
    } else {
      createNewChat()
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

const copyText = (text) => {
  navigator.clipboard.writeText(text)
  ElMessage.success('复制成功')
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

.bubble.ai {
  background: #f4f4f5;
  color: #303133;
  border-top-left-radius: 4px;
}

.bubble.user {
  background: #ecf5ff;
  color: #409eff;
  border-top-right-radius: 4px;
}

/* Agent Step Styles */
.agent-step-bubble {
  width: 100%;
  min-width: 300px;
  background: #f8f9fb;
  border-radius: 12px;
  border: 1px solid #ebeef5;
  overflow: hidden;
  border-top-left-radius: 4px;
}

.agent-step-header {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background: #f0f2f5;
  user-select: none;
  transition: background 0.3s;
}

.agent-step-header:hover {
  background: #e4e7ed;
}

.agent-step-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
}

.agent-step-title .el-icon {
  font-size: 16px;
  color: #409eff;
}

.success-icon {
  color: #67c23a !important;
}

.expand-icon {
  color: #909399;
  transition: transform 0.3s;
}

.expand-icon.is-expanded {
  transform: rotate(90deg);
}

.agent-step-body {
  padding: 16px;
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  background: #ffffff;
}

.thinking-content {
  white-space: pre-wrap;
}

.tool-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tool-call {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f4f4f5;
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: 500;
  color: #303133;
  width: fit-content;
}

.tool-result {
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ebeef5;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: monospace;
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
