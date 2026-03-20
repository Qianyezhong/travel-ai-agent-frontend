<template>
  <ChatBox 
    title="工具调用中心"
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
import { ElMessage } from 'element-plus'

const router = useRouter()
const messages = ref([
  { role: 'ai', content: '欢迎来到工具调用中心！请输入您想使用的工具或任务。' }
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
    { role: 'ai', content: '欢迎来到工具调用中心！请输入您想使用的工具或任务。' }
  ]
}
</script>
