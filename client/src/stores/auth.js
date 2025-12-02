import { defineStore } from 'pinia'
import api from '@/services/api'
import { useNotificationStore } from './notification'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    isAuthenticated: false,
    isTeacher: false,
    isAdmin: false
  }),
  
  getters: {
    // Getter pour vérifier si l'utilisateur est connecté
    isLoggedIn: (state) => state.isAuthenticated,
    
    // Getter pour obtenir le rôle de l'utilisateur
    userRole: (state) => state.isTeacher ? 'teacher' : 'student',
    
    // Getter pour obtenir les informations de l'utilisateur
    currentUser: (state) => state.user
  },
  
  actions: {
    async login(email, password) {
      try {
        const response = await api.post('/api/login', { email, password })
        
        if (response.data.token && response.data.user) {
          this.token = response.data.token
          this.user = response.data.user
          this.isAuthenticated = true
          this.isTeacher = response.data.user.teacher || false
          this.isAdmin = response.data.user.admin || false
          
          // Sauvegarder dans localStorage
          localStorage.setItem('token', this.token)
          localStorage.setItem('user', JSON.stringify(this.user))
          
          // Afficher un message de succès
          const notificationStore = useNotificationStore()
          notificationStore.showSuccess(`Bienvenue ${this.user.nickname || this.user.email}!`)
          
          return { success: true }
        } else {
          throw new Error('Réponse invalide du serveur')
        }
      } catch (error) {
        const notificationStore = useNotificationStore()
        
        // Gérer les erreurs spécifiques
        if (error.response?.status === 401) {
          notificationStore.showError('Email ou mot de passe incorrect.')
        } else if (error.response?.data?.message) {
          notificationStore.showError(error.response.data.message)
        } else {
          notificationStore.showError('Erreur lors de la connexion.')
        }
        
        return { success: false, error: error.message }
      }
    },
    
    async register(username, email, password) {
      try {
        const response = await api.post('/api/register', { 
          username, 
          email, 
          password 
        })
        
        if (response.data.success) {
          const notificationStore = useNotificationStore()
          notificationStore.showSuccess('Inscription réussie! Vous pouvez maintenant vous connecter.')
          return { success: true }
        } else {
          throw new Error('Échec de l\'inscription')
        }
      } catch (error) {
        const notificationStore = useNotificationStore()
        
        if (error.response?.status === 409) {
          notificationStore.showError('Cet email est déjà utilisé.')
        } else if (error.response?.data?.message) {
          notificationStore.showError(error.response.data.message)
        } else {
          notificationStore.showError('Erreur lors de l\'inscription.')
        }
        
        return { success: false, error: error.message }
      }
    },
    
    async logout() {
      try {
        // Optionnel: appeler l'endpoint de logout si disponible
        // await api.post('/api/logout')
        
        this.user = null
        this.token = null
        this.isAuthenticated = false
        this.isTeacher = false
        this.isAdmin = false
        
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        
        const notificationStore = useNotificationStore()
        notificationStore.showSuccess('Déconnexion réussie.')
      } catch (error) {
        // Même en cas d'erreur, on déconnecte localement
        this.user = null
        this.token = null
        this.isAuthenticated = false
        this.isTeacher = false
        this.isAdmin = false
        
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },
    
    async checkAuth() {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          const response = await api.get('/api/auth/verify')
          
          if (response.data.user) {
            this.token = token
            this.user = response.data.user
            this.isAuthenticated = true
            this.isTeacher = response.data.user.teacher || false
            this.isAdmin = response.data.user.admin || false
            
            // Mettre à jour localStorage avec les données fraîches
            localStorage.setItem('user', JSON.stringify(this.user))
            
            return true
          } else {
            this.logout()
            return false
          }
        } catch (error) {
          // Token invalide ou expiré
          this.logout()
          return false
        }
      }
      return false
    },
    
    initializeFromStorage() {
      const token = localStorage.getItem('token')
      const userStr = localStorage.getItem('user')
      
      if (token && userStr) {
        try {
          this.token = token
          this.user = JSON.parse(userStr)
          this.isAuthenticated = true
          this.isTeacher = this.user.teacher || false
          this.isAdmin = this.user.admin || false
          
          // Vérifier la validité du token de manière asynchrone
          this.checkAuth()
        } catch (error) {
          // Données corrompues dans localStorage
          this.logout()
        }
      }
    }
  }
})
