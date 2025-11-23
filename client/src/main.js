import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles.css'
// importer l'instance du router (index.js doit exporter par défaut le router)
import router from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
