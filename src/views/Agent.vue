<template>
  <ChatBox 
    title="自主规划"
    :messages="messages"
    :loading="loading"
    @send="handleSend"
    @clear="handleClear"
  />
</template>

<script setup>
import { ref } from 'vue'
import ChatBox from '../components/ChatBox.vue'
import { ElMessage } from 'element-plus'

const messages = ref([
  { role: 'ai', content: '您好，我是旅行助手智能体（Manus），您可以让我帮您完成复杂的旅行规划和工具调用。' }
])
const loading = ref(false)
let eventSource = null

const handleSend = async (text) => {
  if (!text) return
  
  messages.value.push({ role: 'user', content: text })
  messages.value.push({ role: 'ai', content: '' })
  const aiMessageIndex = messages.value.length - 1
  
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
        // 模拟一个任务结束的步骤
        messages.value.push({
          role: 'agent',
          isAgentStep: true,
          stepType: 'success',
          stepTitle: '任务结束',
          content: '任务执行结束',
          expanded: true
        })
        return
      }
      
      // 尝试解析智能体的结构化输出，假设后端传回的是类似这样的 JSON:
      // { "type": "thinking", "title": "思考过程", "content": "..." }
      // { "type": "tool", "title": "调用工具", "toolName": "searchWeb", "content": "..." }
      // 如果解析失败，则按普通文本追加
      try {
        const parsed = JSON.parse(data)
        
        if (parsed.type && ['thinking', 'tool', 'success'].includes(parsed.type)) {
          // 如果是新的步骤结构，添加一个新气泡
          messages.value.push({
            role: 'agent',
            isAgentStep: true,
            stepType: parsed.type,
            stepTitle: parsed.title || (parsed.type === 'tool' ? '调用工具' : '思考过程'),
            toolName: parsed.toolName,
            content: parsed.content || '',
            expanded: true
          })
        } else {
          // 普通追加内容
          if (messages.value[aiMessageIndex].isAgentStep) {
            // 如果上一个是步骤，则新建一个普通文本气泡
             messages.value.push({ role: 'ai', content: parsed.content || data })
          } else {
            messages.value[aiMessageIndex].content += (parsed.content || data)
          }
        }
      } catch (e) {
        // Not JSON, append as plain text
        messages.value[aiMessageIndex].content += data
      }
    }

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error)
      eventSource.close()
      loading.value = false
      if (!messages.value[aiMessageIndex].content) {
         messages.value[aiMessageIndex].content = '抱歉，智能体请求出错，请稍后再试。'
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
  messages.value = [
    { role: 'ai', content: '您好，我是旅行助手智能体（Manus），您可以让我帮您完成复杂的旅行规划和工具调用。' }
  ]
}
</script>
