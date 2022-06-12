import { createApp } from 'vue'
import App from './client/App.vue'
import router from './client/router'
import { createPinia } from 'pinia'

createApp(App).use(router).use(createPinia()).mount('#app')
