import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    message: null,
    type: null, // 'success', 'error', 'info', 'warning'
    visible: false,
    timeout: null,
    duration: 5000 // Durée par défaut en millisecondes
  }),
  
  getters: {
    // Getter pour vérifier si une notification est visible
    hasNotification: (state) => state.visible && state.message !== null,
    
    // Getter pour obtenir la classe CSS basée sur le type
    notificationClass: (state) => {
      if (!state.type) return ''
      return `notification-${state.type}`
    }
  },
  
  actions: {
    showSuccess(message, duration = 5000) {
      this.show(message, 'success', duration)
    },
    
    showError(message, duration = 5000) {
      this.show(message, 'error', duration)
    },
    
    showInfo(message, duration = 5000) {
      this.show(message, 'info', duration)
    },
    
    showWarning(message, duration = 5000) {
      this.show(message, 'warning', duration)
    },
    
    show(message, type = 'info', duration = 5000) {
      // Effacer le timeout précédent si existant
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }
      
      this.message = message
      this.type = type
      this.visible = true
      this.duration = duration
      
      // Auto-dismiss après la durée spécifiée
      if (duration > 0) {
        this.timeout = setTimeout(() => {
          this.clear()
        }, duration)
      }
    },
    
    clear() {
      // Effacer le timeout si existant
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }
      
      this.message = null
      this.type = null
      this.visible = false
    },
    
    // Méthode pour effacer les messages lors de la navigation
    clearOnNavigation() {
      this.clear()
    }
  }
})
