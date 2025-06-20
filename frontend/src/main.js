import { createApp } from 'vue'
import './style.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import Particles from '@tsparticles/vue3'

const app = createApp(App)
app.use(ElementPlus)
app.use(Particles)

app.mount('#app')
