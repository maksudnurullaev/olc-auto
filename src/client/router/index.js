import { createWebHistory, createRouter } from 'vue-router'

import Config from '../views/Config.vue'
import Kpp from '../views/Kpp.vue'

const routes = [
  {
    path: '/',
    name: 'Config',
    component: Config
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
