import { createApp } from 'vue'
import App from './client/App.vue'

import { createPinia } from 'pinia'
const pinia = createPinia();

import router from './client/router'

createApp(App).use(pinia).use(router).mount('#app')
