<template>
  <div class="layout-container">
    <header class="header">
      <div class="header-left">
        <el-icon class="mobile-menu-btn" @click="drawerVisible = true"><Menu /></el-icon>
        <div class="logo" @click="goHome">
          <div class="logo-icon">E</div>
          <span class="logo-text">EtravelAI</span>
        </div>
      </div>
      
      <nav class="nav-menu desktop-nav">
        <div 
          class="nav-item" 
          :class="{ active: currentRoute === '/' }"
          @click="router.push('/')"
        >
          首页
        </div>
        <div 
          class="nav-item" 
          :class="{ active: currentRoute.includes('/chat') }"
          @click="router.push('/chat')"
        >
          智能对话
        </div>
        <div 
          class="nav-item" 
          :class="{ active: currentRoute.includes('/knowledge-base') }"
          @click="router.push('/knowledge-base')"
        >
          知识库问答 (RAG)
        </div>
        <div 
          class="nav-item" 
          :class="{ active: currentRoute.includes('/agent') }"
          @click="router.push('/agent')"
        >
          自主智能体
        </div>
        <div class="nav-item">场景助手</div>
        <div class="nav-item">知识库上传</div>
      </nav>

      <div class="user-info">
        <el-button type="primary" class="login-btn" @click="router.push('/login')">
          登录使用
        </el-button>
      </div>
    </header>

    <el-drawer
      v-model="drawerVisible"
      title="导航菜单"
      direction="ltr"
      size="240px"
      :with-header="false"
    >
      <div class="mobile-nav">
        <div class="logo" @click="goHome(); drawerVisible = false" style="margin-bottom: 24px;">
          <div class="logo-icon">E</div>
          <span class="logo-text">EtravelAI</span>
        </div>
        
        <div class="mobile-nav-menu">
          <div class="nav-item" :class="{ active: currentRoute === '/' }" @click="router.push('/'); drawerVisible = false">首页</div>
          <div class="nav-item" :class="{ active: currentRoute.includes('/chat') }" @click="router.push('/chat'); drawerVisible = false">智能对话</div>
          <div class="nav-item" :class="{ active: currentRoute.includes('/knowledge-base') }" @click="router.push('/knowledge-base'); drawerVisible = false">知识库问答 (RAG)</div>
          <div class="nav-item" :class="{ active: currentRoute.includes('/agent') }" @click="router.push('/agent'); drawerVisible = false">自主智能体</div>
          <div class="nav-item">场景助手</div>
          <div class="nav-item">知识库上传</div>
        </div>
      </div>
    </el-drawer>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { User, Menu } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()

const currentRoute = computed(() => route.path)
const drawerVisible = ref(false)

const goHome = () => {
  router.push('/')
}

const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessage.success('退出登录成功')
    router.push('/login')
  }
}
</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  background-color: #f5f7fc;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px; /* Increased from 60px */
  background-color: #ffffff;
  padding: 0 40px; /* Increased from 24px */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  z-index: 10;
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 16px; /* Increased from 12px */
}

.logo-icon {
  width: 40px; /* Increased from 32px */
  height: 40px;
  background: #000;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 22px; /* Increased from 18px */
}

.logo-text {
  font-size: 26px; /* Increased from 20px */
  font-weight: 700;
  color: #333;
  /* mimic gradient from image */
  background: linear-gradient(90deg, #4b6cb7 0%, #182848 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-menu {
  display: flex;
  align-items: center;
  height: 100%;
}

.nav-item {
  margin: 0 24px; /* Increased from 16px */
  font-size: 17px; /* Increased from 14px */
  color: #606266;
  cursor: pointer;
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
  transition: color 0.3s;
}

.nav-item:hover {
  color: #409eff;
}

.nav-item.active {
  color: #409eff;
  font-weight: 600; /* Increased weight */
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px; /* Increased from 2px */
  background-color: #409eff;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
  font-size: 14px;
  cursor: pointer;
  outline: none;
}

.user-icon {
  font-size: 18px;
}

.login-btn {
  background: linear-gradient(135deg, #7c4dff 0%, #651fff 100%);
  border: none;
  border-radius: 10px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(124, 77, 255, 0.3);
  transition: all 0.3s ease;
  height: 44px;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(124, 77, 255, 0.4);
  background: linear-gradient(135deg, #8c62ff 0%, #753bff 100%);
}

.main-content {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.header-left {
  display: flex;
  align-items: center;
}

.mobile-menu-btn {
  display: none;
  font-size: 24px;
  margin-right: 16px;
  cursor: pointer;
  color: #606266;
}

.mobile-nav {
  padding: 20px 0;
}

.mobile-nav-menu {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mobile-nav-menu .nav-item {
  margin: 0;
  padding: 12px 24px;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
}

.mobile-nav-menu .nav-item.active {
  background-color: #ecf5ff;
}

.mobile-nav-menu .nav-item.active::after {
  display: none;
}

@media (max-width: 1024px) {
  .desktop-nav {
    display: none;
  }
  .mobile-menu-btn {
    display: block;
  }
  .user-name {
    display: none;
  }
}
</style>
