// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { public: true }
  },
  {
    path: '/',
    component: () => import('@/components/layout/AppShell.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '',        name: 'Dashboard',   component: () => import('@/views/DashboardView.vue') },
      { path: 'profile', name: 'Profile',     component: () => import('@/views/ProfileView.vue') },
      { path: 'projects',name: 'Projects',    component: () => import('@/views/ProjectsView.vue') },
      { path: 'skills',  name: 'Skills',      component: () => import('@/views/SkillsView.vue') },
      { path: 'experience', name: 'Experience', component: () => import('@/views/ExperienceView.vue') },
      { path: 'messages',name: 'Messages',    component: () => import('@/views/MessagesView.vue') },
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (auth.loading) await auth.init()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return '/login'
  if (to.meta.public && auth.isAuthenticated) return '/'
})

export default router
