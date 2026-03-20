import { createRouter, createWebHistory } from 'vue-router'
import BasicLayout from '../layout/BasicLayout.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { title: '注册' }
  },
  {
    path: '/',
    component: BasicLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'chat',
        name: 'Chat',
        component: () => import('../views/Chat.vue'),
        meta: { title: '智能对话' }
      },
      {
        path: 'tool-center',
        name: 'ToolCenter',
        component: () => import('../views/ToolCenter.vue'),
        meta: { title: '工具调用中心' }
      },
      {
        path: 'knowledge-base',
        name: 'KnowledgeBase',
        component: () => import('../views/KnowledgeBase.vue'),
        meta: { title: '知识库问答 (RAG)' }
      },
      {
        path: 'agent',
        name: 'Agent',
        component: () => import('../views/Agent.vue'),
        meta: { title: '自主智能体' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
