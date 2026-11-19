import { createApp } from 'vue'
import App from './App.vue'
import { i18n } from './i18n'
import { initializePreferences } from './preferences'
import './style.css'

initializePreferences()
createApp(App).use(i18n).mount('#app')
