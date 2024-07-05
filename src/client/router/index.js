import { createWebHistory, createRouter } from 'vue-router'

import Photos from '../views/Photos.vue'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/reception',
    name: 'Photos',
    component: Photos
  },
  {
    path: '/',
    name: 'Home',
    component: Home
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
