<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="logo-area">
        <div class="logo-icon">E</div>
        <span class="logo-text">EtravelAI</span>
      </div>
      <h2 class="title">欢迎登录 EtravelAI</h2>
      <p class="subtitle">智能对话，无限可能</p>
      
      <el-form :model="form" class="auth-form">
        <el-form-item>
          <el-input 
            v-model="form.username" 
            placeholder="admin" 
            :prefix-icon="User"
            size="large"
          />
        </el-form-item>
        <el-form-item>
          <el-input 
            v-model="form.password" 
            type="password" 
            placeholder="••••••" 
            :prefix-icon="Lock"
            show-password
            size="large"
          />
        </el-form-item>
        <el-button type="primary" class="submit-btn" size="large" @click="handleLogin" :loading="loading">登录</el-button>
      </el-form>
      
      <div class="switch-action">
        还没有账号？ <el-link type="primary" :underline="false" @click="router.push('/register')">立即注册</el-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const router = useRouter()
const form = ref({
  username: '',
  password: ''
})

const loading = ref(false)

const handleLogin = async () => {
  if (!form.value.username || !form.value.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  
  loading.value = true
  try {
    const response = await axios.post('http://localhost:8123/api/auth/login', {
      username: form.value.username,
      password: form.value.password
    })

    const result = response.data
    
    // Check custom Result structure (code 200 is success)
    if (result.code === 200) {
      ElMessage.success('登录成功')
      
      // Store tokens in localStorage
      if (result.data) {
        if (result.data.accessToken) {
          localStorage.setItem('accessToken', result.data.accessToken)
        }
        if (result.data.refreshToken) {
          localStorage.setItem('refreshToken', result.data.refreshToken)
        }
        // Also save username for display in header
        localStorage.setItem('username', form.value.username)
      }
      
      router.push('/')
    } else {
      ElMessage.error(result.message || '登录失败')
    }
  } catch (error) {
    console.error('Login error:', error)
    ElMessage.error('登录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  background-color: #f8fafc;
  background-image: 
    radial-gradient(at 0% 0%, rgba(124, 77, 255, 0.15) 0px, transparent 50%),
    radial-gradient(at 100% 0%, rgba(64, 158, 255, 0.1) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(233, 30, 99, 0.1) 0px, transparent 50%),
    radial-gradient(at 0% 100%, rgba(64, 158, 255, 0.15) 0px, transparent 50%);
}

.auth-container::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: 
    linear-gradient(rgba(64, 158, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(64, 158, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: 0;
  pointer-events: none;
}

.auth-card {
  width: 460px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(24px);
  border-radius: 24px;
  padding: 60px 48px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 1);
  text-align: center;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}

.logo-area {
  margin-bottom: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #7c4dff 0%, #409eff 100%);
  color: #fff;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 26px;
  box-shadow: 0 8px 16px rgba(124, 77, 255, 0.3);
}

.logo-text {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #1f2937 0%, #4b5563 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title {
  font-size: 28px;
  color: #1f2937;
  margin: 0 0 12px 0;
  font-weight: 700;
}

.subtitle {
  font-size: 16px;
  color: #6b7280;
  margin: 0 0 40px 0;
}

.auth-form {
  margin-bottom: 32px;
}

:deep(.el-input__wrapper) {
  border-radius: 12px;
  padding: 4px 16px;
  background-color: rgba(244, 244, 245, 0.8);
  box-shadow: none !important;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper.is-focus) {
  background-color: #ffffff;
  border: 1px solid #7c4dff;
  box-shadow: 0 0 0 2px rgba(124, 77, 255, 0.1) !important;
}

:deep(.el-input__inner) {
  height: 44px;
  font-size: 16px;
}

.submit-btn {
  width: 100%;
  height: 52px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  margin-top: 16px;
  background: linear-gradient(135deg, #7c4dff 0%, #651fff 100%);
  border: none;
  box-shadow: 0 8px 20px rgba(124, 77, 255, 0.3);
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(124, 77, 255, 0.4);
  background: linear-gradient(135deg, #8c62ff 0%, #753bff 100%);
}

.switch-action {
  font-size: 15px;
  color: #6b7280;
}

.switch-action .el-link {
  font-size: 15px;
  font-weight: 600;
  color: #7c4dff;
}

@media (max-width: 480px) {
  .auth-card {
    width: 90%;
    padding: 40px 24px;
  }
}
</style>