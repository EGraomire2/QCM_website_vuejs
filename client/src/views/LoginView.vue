<template>
  <div class="container">
    <form id="login-form" @submit.prevent="handleSubmit">
      <h2>{{ $t('auth.loginTitle') }}</h2>

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
          name="password"
          :placeholder="$t('auth.password')"
          v-model="form.password"
          required
          :disabled="isLoading"
        >
      </div>

      <div class="inputBox">
        <input 
          type="submit" 
          name="connexion" 
          :value="isLoading ? $t('auth.connecting') : $t('auth.loginButton')"
          :disabled="isLoading"
        >
      </div>

      <div class="inputBox">
        <p>{{ $t('auth.noAccount') }}
          <router-link to="/register">{{ $t('auth.signUp') }}</router-link>
        </p>
      </div>
    </form>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'LoginView',

  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    const route = useRoute()

    return {
      authStore,
      router,
      route
    }
  },

  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      isLoading: false
    }
  },

  methods: {
    async handleSubmit() {
      // Validation côté client
      if (!this.form.email || !this.form.password) {
        return
      }

      this.isLoading = true

      try {
        const result = await this.authStore.login(this.form.email, this.form.password)

        if (result.success) {
          // Redirection après connexion réussie
          const redirectPath = this.route.query.redirect || '/'
          this.router.push(redirectPath)
        }
      } catch (error) {
        console.error('Erreur lors de la connexion:', error)
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
