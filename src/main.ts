import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'
import { useTheme } from './composables/useTheme'

// Initialize theme before mount
useTheme()

createApp(App).use(router).mount('#app')
