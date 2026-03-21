<template>
  <ChatBox 
    title="AI旅行智能助手"
    :messages="messages"
    :loading="loading"
    @send="handleSend"
    @clear="handleClear"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ChatBox from '../components/ChatBox.vue'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const messages = ref([
  { role: 'ai', content: '你好！有什么我可以帮助你的吗？' }
])
const loading = ref(false)
let eventSource = null

onMounted(() => {
  if (route.query.initialMessage) {
    const msg = route.query.initialMessage
    // default chatId can be anything for the initial message, e.g. '1'
    handleSend(msg, '1')
    // Clear the query so it doesn't trigger again on refresh
    router.replace({ path: route.path })
  }
})

const handleSend = async (text, chatId) => {
  if (!text) return
  
  messages.value.push({ role: 'user', content: text })
  messages.value.push({ role: 'ai', content: '' })
  const aiMessageIndex = messages.value.length - 1
  
  loading.value = true

  try {
    const url = new URL('http://localhost:8123/api/ai/trave_app/chat/see')
    url.searchParams.append('message', text)
    url.searchParams.append('chatId', chatId)

    eventSource = new EventSource(url.toString())

    eventSource.onmessage = (event) => {
      // Assuming the backend sends plain text or JSON
      // If it's a JSON string, we should parse it. For now, let's append the raw data.
      // Often SSE text comes chunk by chunk
      let data = event.data
      try {
        const parsed = JSON.parse(data)
        if (parsed.content) {
          data = parsed.content
        }
      } catch (e) {
        // Not JSON, use as plain text
      }
      
      // Sometimes SSE sends a special token to indicate the end
      if (data === '[DONE]') {
        eventSource.close()
        loading.value = false
        return
      }
      
      messages.value[aiMessageIndex].content += data
    }

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error)
      eventSource.close()
      loading.value = false
      if (!messages.value[aiMessageIndex].content) {
         messages.value[aiMessageIndex].content = '抱歉，请求出错，请稍后再试。'
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
    { role: 'ai', content: '你好！有什么我可以帮助你的吗？' }
  ]
}
</script>
