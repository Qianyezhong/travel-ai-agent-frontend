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
        return
      }
      
      // Sometimes SSE data comes with escaped newlines or formatting
      // Unescape standard sequences if needed, but usually browser handles it.
      messages.value[aiMessageIndex].content += data
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
