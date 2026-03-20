<template>
  <ChatBox 
    title="知识库问答 (RAG)"
    :messages="messages"
    :loading="loading"
    @send="handleSend"
    @clear="handleClear"
  />
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ChatBox from '../components/ChatBox.vue'

const router = useRouter()
const messages = ref([
  { role: 'ai', content: '欢迎使用知识库问答系统！您可以向我提问关于知识库中的内容。' }
])
const loading = ref(false)

const handleSend = async (text) => {
  if (!text) return
  
  messages.value.push({ role: 'user', content: text })
  messages.value.push({ role: 'ai', content: '' })
  const aiMessageIndex = messages.value.length - 1
  
  loading.value = true

  // Mocking real-time display and then redirecting
  const reply = '接口暂时未定，3秒后将为您重定向到首页...'
  let i = 0
  
  const timer = setInterval(() => {
    if (i < reply.length) {
      messages.value[aiMessageIndex].content += reply.charAt(i)
      i++
    } else {
      clearInterval(timer)
      loading.value = false
      setTimeout(() => {
        router.push('/')
      }, 1500)
    }
  }, 100)
}

const handleClear = () => {
  messages.value = [
    { role: 'ai', content: '欢迎使用知识库问答系统！您可以向我提问关于知识库中的内容。' }
  ]
}
</script>
