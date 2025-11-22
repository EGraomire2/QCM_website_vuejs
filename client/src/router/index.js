import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/LoginView.vue'

const routes = [
  { path: '/login', name: 'Login', component: Login },
  // ajouter tes autres routes ici (/, /register, /select-qcm, etc.)
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
