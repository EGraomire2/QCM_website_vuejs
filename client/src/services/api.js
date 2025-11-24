import axios from 'axios'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  response => response,
  error => {
    // Import dynamique pour éviter les dépendances circulaires
    const handleError = async () => {
      const { useNotificationStore } = await import('@/stores/notification')
      const notificationStore = useNotificationStore()
      
      if (error.response?.status === 401) {
        // Token invalide ou expiré
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        notificationStore.showError('Session expirée. Veuillez vous reconnecter.')
        
        // Redirection vers login
        setTimeout(() => {
          window.location.href = '/login'
        }, 1000)
      } else if (error.response?.status === 403) {
        // Accès interdit
        notificationStore.showError('Accès non autorisé.')
      } else if (error.response?.status === 404) {
        // Ressource non trouvée
        notificationStore.showError('Ressource non trouvée.')
      } else if (error.response?.status === 409) {
        // Conflit (ex: email déjà utilisé)
        const message = error.response?.data?.message || 'Cette entrée existe déjà.'
        notificationStore.showError(message)
      } else if (error.response?.status >= 500) {
        // Erreur serveur
        notificationStore.showError('Erreur serveur. Veuillez réessayer plus tard.')
      } else if (error.response?.data?.message) {
        // Message d'erreur personnalisé du serveur
        notificationStore.showError(error.response.data.message)
      } else if (error.message === 'Network Error') {
        // Erreur réseau
        notificationStore.showError('Erreur de connexion au serveur.')
      }
    }
    
    handleError()
    return Promise.reject(error)
  }
)

export default api
