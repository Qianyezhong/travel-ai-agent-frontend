<template>
  <ChatBox 
    title="自主规划"
    :messages="currentMessages"
    :loading="loading"
    @send="handleSend"
    @clear="handleClear"
    @switch-session="handleSwitchSession"
    @new-session="handleNewSession"
    @delete-session="handleDeleteSession"
  />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChatBox from '../components/ChatBox.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()

// Dictionary to store messages for each session
const sessionMessages = ref({
  '1': [{ role: 'agent', content: '您好，我是旅行助手智能体（Manus），您可以让我帮您完成复杂的旅行规划和工具调用。\n'
  +'我可以帮您将旅游规划总结到PDF中，您还可以让我把这个PDF发送到您的QQ邮箱。\n' 
  +'比如：我一个人想去杭州玩，帮我推荐三四个热门景点，生成好以PDF形式发送到xxx@qq.com。'
  }]
})
const currentSessionId = ref('1')

// Computed property to pass only the current session's messages to ChatBox
const currentMessages = computed(() => {
  return sessionMessages.value[currentSessionId.value] || []
})

const loading = ref(false)
let eventSource = null

onMounted(() => {
  if (route.query.initialMessage) {
    const msg = route.query.initialMessage
    handleSend(msg)
    // Clear the query so it doesn't trigger again on refresh
    router.replace({ path: route.path })
  }
})

const handleSwitchSession = (sessionId) => {
  if (eventSource) {
    eventSource.close()
    loading.value = false
  }
  currentSessionId.value = sessionId
}

const handleNewSession = (sessionId) => {
  if (eventSource) {
    eventSource.close()
    loading.value = false
  }
  currentSessionId.value = sessionId
  sessionMessages.value[sessionId] = [
    { role: 'agent', content: '您好，我是旅行助手智能体（Manus），您可以让我帮您完成复杂的旅行规划和工具调用。' }
  ]
}

const handleDeleteSession = (sessionId) => {
  if (sessionMessages.value[sessionId]) {
    delete sessionMessages.value[sessionId]
  }
}

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

const handleSend = async (text) => {
  if (!text) return
  
  if (!checkLoginStatus()) {
    return
  }
  
  const chatId = currentSessionId.value
  if (!sessionMessages.value[chatId]) {
    sessionMessages.value[chatId] = []
  }
  
  const messagesArray = sessionMessages.value[chatId]
  messagesArray.push({ role: 'user', content: text })
  messagesArray.push({ 
    role: 'agent', 
    thinking: '',
    thinkingExpanded: true,
    content: '',
    steps: []
  })
  const aiMessageIndex = messagesArray.length - 1
  const currentAgentMsg = messagesArray[aiMessageIndex]
  
  loading.value = true

  try {
    const url = new URL('http://localhost:8123/api/ai/trave_app/manus/chat')
    url.searchParams.append('message', text)

    eventSource = new EventSource(url.toString())

    eventSource.onmessage = (event) => {
      let data = event.data
      try {
        const parsed = JSON.parse(data)
        if (parsed.content) {
          data = parsed.content
        }
      } catch (e) {
        // Not JSON, use as plain text
      }
      
      if (data === '[DONE]') {
        eventSource.close()
        loading.value = false
        // Mark the last step as finished, or just add a final step
        const hasConclusion = currentAgentMsg.steps.some(s => s.type === 'conclusion' || s.title === '任务结束' || s.title === '结论');
        if (!hasConclusion) {
          currentAgentMsg.steps.push({
            type: 'conclusion',
            status: 'success',
            title: '结论',
            content: '任务执行结束',
            expanded: true
          })
        }
        return
      }
      
      // 尝试解析智能体的结构化输出
      // 如果后端传回的是类似这样的 JSON:
      // { "type": "thinking", "title": "思考过程", "content": "..." }
      // 或者如果后端传回的是特定格式的纯文本，我们需要用正则去解析它
      // 例如："Step 1: 工具 searchWeb 完成了它的任务！结果: ..."
      
      let parsed = null;
      try {
        parsed = JSON.parse(data)
      } catch (e) {
        // 解析纯文本中的工具调用格式
        // 尝试匹配 "Step X: 工具 XXX"
        const stepMatch = data.match(/Step\s+\d+:\s+工具\s+([a-zA-Z0-9_]+)(.*)/);
        if (stepMatch) {
          const toolName = stepMatch[1];
          const restOfLine = stepMatch[2] || '';
          
          let status = 'loading';
          let resultContent = '';
          
          if (restOfLine.includes('完成了它的任务')) {
            status = 'success';
            const resultMatch = restOfLine.match(/结果:\s*(.*)/);
            if (resultMatch) {
              resultContent = resultMatch[1];
            }
          }

          // 如果结果是 JSON 字符串，尝试美化它
          let parsedResult = resultContent;
          if (resultContent) {
            try {
              let trimmed = resultContent.trim();
              if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
                 parsedResult = JSON.parse(trimmed);
              } else if (trimmed.startsWith('"')) {
                 parsedResult = JSON.parse(trimmed);
              }
            } catch(err) {}
          }

          let stepType = 'tool';
          let stepTitle = toolName === 'generatePDF' ? 'PDF生成' : (toolName === 'searchWeb' ? '网络搜索' : '工具调用');
          let stepSubtitle = status === 'success' 
            ? (toolName === 'generatePDF' ? 'PDF文档生成完成' : `工具 ${toolName} 执行完毕`) 
            : `正在调用 ${toolName}...`;
          
          if (toolName === 'doTerminate') {
            stepType = 'conclusion';
            status = 'success';
            stepTitle = '结论';
            stepSubtitle = '任务执行结束';
            parsedResult = parsedResult || '任务执行结束';
          }
          
          // Check for local file paths in the result
          let fileInfo = null;
          if (status === 'success' && typeof parsedResult === 'string') {
            const fileMatch = parsedResult.match(/([a-zA-Z]:\\[^:<>"|?*]+\.(pdf|txt|docx?|xlsx?|png|jpg|jpeg))/i);
            if (fileMatch) {
              const fullPath = fileMatch[1];
              const ext = fileMatch[2].toLowerCase();
              const fileName = fullPath.split('\\').pop();
              fileInfo = {
                path: fullPath,
                name: fileName,
                ext: ext,
                url: `http://localhost:8123/api/file/download?path=${encodeURIComponent(fullPath)}` // Assuming backend has a download endpoint
              };
            }
          }

          const now = new Date();
          const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

          parsed = {
            type: stepType,
            status: status,
            title: stepTitle,
            subtitle: stepSubtitle,
            content: parsedResult,
            time: timeString,
            toolName: toolName,
            fileInfo: fileInfo
          }
        }
      }
      
      if (parsed && parsed.type && ['thinking', 'tool', 'success', 'conclusion'].includes(parsed.type)) {
        
        // 过滤掉失败的结果（例如 Error searching Baidu 等）
        if (parsed.content && typeof parsed.content === 'string' && (parsed.content.includes('Error') || parsed.content.includes('Exception'))) {
          // 如果是错误信息，我们直接忽略这条数据，不展示给前端
          return;
        }

        if (parsed.type === 'thinking') {
           // Append to top-level thinking
           currentAgentMsg.thinking += parsed.content || '';
           return;
        }

        // 检查是否和上一个步骤是完全一样的工具调用，如果是则合并（忽略重复）
        const lastStep = currentAgentMsg.steps[currentAgentMsg.steps.length - 1];
        if (lastStep && lastStep.type === parsed.type && lastStep.title === parsed.title) {
          // 如果工具调用重复，且当前有结果，则更新结果
          if (parsed.content && !lastStep.content) {
            lastStep.content = parsed.content;
            lastStep.time = parsed.time;
            lastStep.status = parsed.status;
            lastStep.fileInfo = parsed.fileInfo;
          } else if (parsed.content && lastStep.content && JSON.stringify(lastStep.content) !== JSON.stringify(parsed.content)) {
            // 更新为最新结果
            lastStep.content = parsed.content;
            lastStep.time = parsed.time;
            lastStep.status = parsed.status;
            lastStep.fileInfo = parsed.fileInfo;
          } else if (parsed.status === 'success' && lastStep.status !== 'success') {
            lastStep.status = parsed.status;
            lastStep.fileInfo = parsed.fileInfo;
          }
          return; // 结束处理，不再 push 新步骤
        }

        // 如果是新的步骤结构，添加一个新步骤
        currentAgentMsg.steps.push({
          type: parsed.type,
          status: parsed.status || 'success',
          title: parsed.title || '调用工具',
          subtitle: parsed.subtitle || '',
          content: parsed.content || '',
          time: parsed.time || '',
          toolName: parsed.toolName || '',
          fileInfo: parsed.fileInfo || null,
          expanded: true
        })
      } else {
        // 普通文本，追加到 content
        currentAgentMsg.content += (parsed ? (parsed.content || data) : data)
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error)
      eventSource.close()
      loading.value = false
      if (!currentAgentMsg.content && currentAgentMsg.steps.length === 0) {
         currentAgentMsg.content = '抱歉，智能体请求出错，请稍后再试。'
      }
    }
  } catch (error) {
    console.error(error)
    loading.value = false
    ElMessage.error('发送失败')
  }
}

const handleClear = () => {
  if (eventSource) {
    eventSource.close()
  }
  loading.value = false
  sessionMessages.value[currentSessionId.value] = [
    { role: 'agent', content: '您好，我是旅行助手智能体（Manus），您可以让我帮您完成复杂的旅行规划和工具调用。' }
  ]
}
</script>
