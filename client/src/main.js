import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/styles.css'
// importer l'instance du router (index.js doit exporter par défaut le router)
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialiser l'état d'authentification depuis localStorage
const authStore = useAuthStore()
authStore.initializeFromStorage()

app.mount('#app')
