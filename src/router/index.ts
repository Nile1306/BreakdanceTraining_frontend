import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import CreateSessions from '../components/DrillComponent.vue'
import Todo from '../components/Todo.vue'
import Statistic from '../components/Statistic.vue'
import Sessions from '../components/Sessions.vue'
import Login from '../components/Login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: Login },
    { path: '/', component: CreateSessions, meta: { requiresAuth: true } },
    { path: '/todo', component: Todo, meta: { requiresAuth: true } },
    { path: '/stats', component: Statistic, meta: { requiresAuth: true } },
    { path: '/sessions', component: Sessions, meta: { requiresAuth: true } },
  ],
})
router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return '/login'
  }

  if (to.path === '/login' && authStore.isLoggedIn) {
    return '/'
  }
})

export default router
