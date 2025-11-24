<template>
  <div id="app">
    <NotificationToast />
    <router-view/>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import NotificationToast from '@/components/NotificationToast.vue'

export default {
  name: 'App',

  components: {
    NotificationToast
  },

  setup() {
    const authStore = useAuthStore()
    return { authStore }
  },

  created() {
    // Initialiser l'état d'authentification depuis localStorage
    this.authStore.initializeFromStorage()
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
