<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="logo-area">
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
        <el-button type="primary" class="submit-btn" size="large" @click="handleLogin">登录</el-button>
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

const router = useRouter()
const form = ref({
  username: '',
  password: ''
})

const handleLogin = () => {
  if (!form.value.username || !form.value.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  ElMessage.success('登录成功')
  router.push('/')
}
</script>

<style scoped>
.auth-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
}

.auth-card {
  width: 400px;
  background: #ffffff;
  border-radius: 12px;
  padding: 40px 32px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
  text-align: center;
  box-sizing: border-box;
}

.logo-area {
  margin-bottom: 24px;
}

.logo-text {
  font-size: 28px;
  font-weight: bold;
  background: linear-gradient(90deg, #4b6cb7 0%, #182848 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title {
  font-size: 22px;
  color: #303133;
  margin: 0 0 12px 0;
  font-weight: 600;
}

.subtitle {
  font-size: 14px;
  color: #909399;
  margin: 0 0 32px 0;
}

.auth-form {
  margin-bottom: 24px;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
}

.submit-btn {
  width: 100%;
  border-radius: 8px;
  font-size: 16px;
  margin-top: 8px;
  background-color: #409eff;
  border-color: #409eff;
}

.switch-action {
  font-size: 14px;
  color: #909399;
}

@media (max-width: 480px) {
  .auth-card {
    width: 90%;
    padding: 32px 24px;
  }
}
</style>