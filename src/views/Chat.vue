<template>
  <ChatBox 
    title="AI旅行智能助手"
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
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

// Dictionary to store messages for each session
const sessionMessages = ref({
  '1': [{ role: 'ai', content: '你好！有什么我可以帮助你的吗？' }]
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
    handleSend(msg, currentSessionId.value)
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
    { role: 'ai', content: '你好！有什么我可以帮助你的吗？' }
  ]
}

const handleDeleteSession = (sessionId) => {
  if (sessionMessages.value[sessionId]) {
    delete sessionMessages.value[sessionId]
  }
}

const handleSend = async (text, chatId) => {
  if (!text) return
  
  if (!sessionMessages.value[chatId]) {
    sessionMessages.value[chatId] = []
  }
  
  const messagesArray = sessionMessages.value[chatId]
  messagesArray.push({ role: 'user', content: text })
  messagesArray.push({ role: 'ai', content: '' })
  const aiMessageIndex = messagesArray.length - 1
  
  loading.value = true

  try {
    const url = new URL('http://localhost:8123/api/ai/trave_app/chat/see')
    url.searchParams.append('message', text)
    url.searchParams.append('chatId', chatId)

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
      
      messagesArray[aiMessageIndex].content += data
    }

    eventSource.onerror = (error) => {
      console.error('SSE Error:', error)
      eventSource.close()
      loading.value = false
      if (!messagesArray[aiMessageIndex].content) {
         messagesArray[aiMessageIndex].content = '抱歉，请求出错，请稍后再试。'
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
    { role: 'ai', content: '你好！有什么我可以帮助你的吗？' }
  ]
}
</script>
