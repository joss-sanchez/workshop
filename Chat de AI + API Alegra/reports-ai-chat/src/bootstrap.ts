import { createApp } from 'vue'
import App from './App.vue'
import routes from '@/micro/router/router'
import '../node_modules/@alegradev/smile-ui-next/dist/style.css'
import './index.css'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)
app.use(routes)
app.use(pinia)
app.mount('#app')
