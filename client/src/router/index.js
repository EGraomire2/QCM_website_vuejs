import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/LoginView.vue'
import Register from '@/views/RegisterView.vue'
import Home from '@/views/HomeView.vue'
import CreateQcmView from '@/views/CreateQcmView.vue'
import SelectQcmView from '@/views/SelectQcmView.vue'
import AnswerQcmView from '@/views/AnswerQcmView.vue'
import CorrectionView from '@/views/CorrectionView.vue'
import LessonsView from '@/views/LessonsView.vue'
import CreateSubjectView from '@/views/CreateSubjectView.vue'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'

const routes = [
  { 
    path: '/', 
    name: 'Home', 
    component: Home 
  },
  { 
    path: '/login', 
    name: 'Login', 
    component: Login 
  },
  { 
    path: '/register', 
    name: 'Register', 
    component: Register 
  },
  { 
    path: '/qcm/create', 
    name: 'CreateQCM', 
    component: CreateQcmView,
    meta: { requiresAuth: true, requiresTeacher: true }
  },
  { 
    path: '/qcm/select', 
    name: 'SelectQCM', 
    component: SelectQcmView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/qcm/:id/answer', 
    name: 'AnswerQCM', 
    component: AnswerQcmView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/qcm/:qcmId/correction/:attemptId', 
    name: 'Correction', 
    component: CorrectionView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/lessons', 
    name: 'Lessons', 
    component: LessonsView 
  },
  { 
    path: '/subjects/create', 
    name: 'CreateSubject', 
    component: CreateSubjectView,
    meta: { requiresAuth: true, requiresTeacher: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard pour l'authentification
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore()
  const notificationStore = useNotificationStore()
  
  // Effacer les notifications lors de la navigation
  notificationStore.clearOnNavigation()
  
  // Vérifier le token si l'utilisateur semble authentifié mais qu'on n'a pas encore vérifié
  if (authStore.token && to.meta.requiresAuth) {
    // Vérifier la validité du token avant d'accéder aux routes protégées
    const isValid = await authStore.checkAuth()
    if (!isValid) {
      notificationStore.showError('Votre session a expiré. Veuillez vous reconnecter.')
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }
  }
  
  // Vérifier si la route nécessite une authentification
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Rediriger vers la page de connexion
      notificationStore.showError('Vous devez être connecté pour accéder à cette page.')
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }
    
    // Vérifier si la route nécessite le rôle de professeur
    if (to.meta.requiresTeacher && !authStore.isTeacher) {
      // Rediriger vers la page d'accueil
      notificationStore.showError('Accès réservé aux professeurs.')
      next({ name: 'Home' })
      return
    }
  }
  
  // Rediriger les utilisateurs connectés depuis login/register vers home
  if ((to.name === 'Login' || to.name === 'Register') && authStore.isAuthenticated) {
    next({ name: 'Home' })
    return
  }
  
  next()
})

export default router
