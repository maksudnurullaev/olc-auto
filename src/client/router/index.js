import { createWebHistory, createRouter } from 'vue-router'

import LogInOut from '../views/LogInOut.vue'
import Kpp from '../views/Kpp.vue'

const routes = [
  {
    path: '/',
    name: 'LogInOut',
    component: LogInOut
  },
  {
    path: '/kpp',
    name: 'Kpp',
    component: Kpp
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
