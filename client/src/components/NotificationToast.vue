<template>
  <transition name="notification-fade">
    <div 
      v-if="notificationStore.visible" 
      :class="['notification-toast', notificationStore.notificationClass]"
      @click="notificationStore.clear()"
    >
      <div class="notification-content">
        <span class="notification-icon">{{ getIcon }}</span>
        <span class="notification-message">{{ notificationStore.message }}</span>
        <button class="notification-close" @click.stop="notificationStore.clear()">×</button>
      </div>
    </div>
  </transition>
</template>

<script>
import { useNotificationStore } from '@/stores/notification'

export default {
  name: 'NotificationToast',

  setup() {
    const notificationStore = useNotificationStore()
    return { notificationStore }
  },

  computed: {
    getIcon() {
      switch (this.notificationStore.type) {
        case 'success':
          return '✓'
        case 'error':
          return '✕'
        case 'warning':
          return '⚠'
        case 'info':
          return 'ℹ'
        default:
          return 'ℹ'
      }
    }
  }
}
</script>

<style scoped>
.notification-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  min-width: 300px;
  max-width: 500px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  cursor: pointer;
  animation: slideIn 0.3s ease-out;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.notification-icon {
  font-size: 20px;
  font-weight: bold;
  flex-shrink: 0;
}

.notification-message {
  flex: 1;
  text-align: left;
  font-size: 14px;
  line-height: 1.4;
}

.notification-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.notification-close:hover {
  opacity: 1;
}

/* Type-specific styles */
.notification-success {
  background-color: #d4edda;
  color: #155724;
  border-left: 4px solid #28a745;
}

.notification-error {
  background-color: #f8d7da;
  color: #721c24;
  border-left: 4px solid #dc3545;
}

.notification-warning {
  background-color: #fff3cd;
  color: #856404;
  border-left: 4px solid #ffc107;
}

.notification-info {
  background-color: #d1ecf1;
  color: #0c5460;
  border-left: 4px solid #17a2b8;
}

/* Animations */
.notification-fade-enter-active,
.notification-fade-leave-active {
  transition: all 0.3s ease;
}

.notification-fade-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
