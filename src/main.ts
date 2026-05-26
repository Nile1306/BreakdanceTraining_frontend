import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// pinia for state management (not really using it much yet but it's set up)
app.use(createPinia())
app.use(router)

app.mount('#app')
