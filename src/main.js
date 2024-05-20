import { createApp } from 'vue'
import App from './client/App.vue'

import { createPinia } from 'pinia'
const pinia = createPinia();

import router from './client/router'

const app = createApp(App)

import { isDevMode } from './utils/common'
app.config.devtools = isDevMode();

app.use(pinia)
app.use(router)
app.mount('#app')
