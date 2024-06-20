import { createWebHistory, createRouter } from 'vue-router'

import Photos from '../views/Photos.vue'

const routes = [
  {
    path: '/:receptionId?',
    name: 'Photos',
    component: Photos
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
