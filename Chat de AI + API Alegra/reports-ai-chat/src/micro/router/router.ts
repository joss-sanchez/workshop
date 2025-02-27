import { createRouter, createWebHistory } from 'vue-router'
import routes from '@/micro/router/index'

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
