import './styles/tailwind.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import initFingerprint from './utils/initFingerprint.ts'


const app = createApp(App)

app.use(createPinia())
app.use(router)

initFingerprint()

app.mount('#app')
