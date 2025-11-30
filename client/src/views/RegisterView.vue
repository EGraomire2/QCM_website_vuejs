<template>
  <div class="container">
    <form id="register-form" @submit.prevent="handleSubmit">
      <h2>{{ $t('auth.registerTitle') }}</h2>

      <div class="inputBox">
        <input
          type="text"
          name="username"
          :placeholder="$t('auth.username')"
          v-model="form.username"
          required
          :disabled="isLoading"
        >
      </div>

      <div class="inputBox">
        <input
          type="email"
          name="email"
          :placeholder="$t('auth.email')"
          v-model="form.email"
          required
          :disabled="isLoading"
        >
      </div>

      <div class="inputBox">
        <input
          type="password"
          name="password1"
          :placeholder="$t('auth.password')"
          v-model="form.password1"
          required
          minlength="6"
          :disabled="isLoading"
        >
      </div>

      <div class="inputBox">
        <input
          type="password"
          name="password2"
          :placeholder="$t('auth.confirmPassword')"
          v-model="form.password2"
          required
          minlength="6"
          :disabled="isLoading"
        >
      </div>

      <div class="inputBox">
        <input 
          type="submit" 
          name="inscription" 
          :value="isLoading ? $t('auth.registering') : $t('auth.registerButton')"
          :disabled="isLoading"
        >
      </div>

      <div class="inputBox">
        <p>{{ $t('auth.hasAccount') }}
          <router-link to="/login">{{ $t('auth.signIn') }}</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import { useRouter } from 'vue-router'

export default {
  name: 'RegisterView',

  setup() {
    const authStore = useAuthStore()
    const notificationStore = useNotificationStore()
    const router = useRouter()

    return {
      authStore,
      notificationStore,
      router
    }
  },

  data() {
    return {
      form: {
        username: '',
        email: '',
        password1: '',
        password2: ''
      },
      isLoading: false
    }
  },

  methods: {
    validateForm() {
      // Validation du nom d'utilisateur
      if (!this.form.username || this.form.username.trim().length < 3) {
        this.notificationStore.showError(this.$t('auth.usernameMinLength'))
        return false
      }

      // Validation de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.form.email)) {
        this.notificationStore.showError(this.$t('auth.invalidEmail'))
        return false
      }

      // Validation de la longueur du mot de passe
      if (this.form.password1.length < 6) {
        this.notificationStore.showError(this.$t('auth.passwordMinLength'))
        return false
      }

      // Validation de la correspondance des mots de passe
      if (this.form.password1 !== this.form.password2) {
        this.notificationStore.showError(this.$t('auth.passwordMismatch'))
        return false
      }

      return true
    },

    async handleSubmit() {
      // Validation côté client
      if (!this.validateForm()) {
        return
      }

      this.isLoading = true

      try {
        const result = await this.authStore.register(
          this.form.username,
          this.form.email,
          this.form.password1
        )

        if (result.success) {
          // Redirection vers la page de connexion après inscription réussie
          this.router.push('/login')
        }
      } catch (error) {
        console.error('Erreur lors de l\'inscription:', error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
@import '../assets/login.css';
</style>
