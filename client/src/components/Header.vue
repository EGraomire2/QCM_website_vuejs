<template>
  <header id="main-header">
    <h1 class="main_title">Bienvenue sur SOSprépa</h1>
    <nav class="nav-link">
      <ul>
        <!-- Links when not authenticated -->
        <template v-if="!authStore.isAuthenticated">
          <li><router-link to="/register">Créer un compte</router-link></li>
          <li><router-link to="/login">Connexion</router-link></li>
          <li><router-link to="/">Accueil</router-link></li>
        </template>

        <!-- Links when authenticated -->
        <template v-else>
          <li><router-link to="/">Accueil</router-link></li>
          
          <!-- Teacher-only links -->
          <template v-if="authStore.isTeacher">
            <li><router-link to="/qcm/create">Créer un QCM</router-link></li>
          </template>
          
          <!-- Links for all authenticated users -->
          <li><router-link to="/qcm/select">Liste de QCM</router-link></li>
          <li><router-link to="/lessons">Notions de cours</router-link></li>
          
          <!-- Logout button -->
          <li><a href="#" @click.prevent="handleLogout">Déconnexion</a></li>
        </template>
      </ul>
    </nav>
  </header>
</template>

<script>
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'AppHeader',
  
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  
  methods: {
    async handleLogout() {
      // Use the auth store logout action
      await this.authStore.logout();
      
      // Redirect to login page
      this.$router.push('/login');
    }
  }
};
</script>

<style>
/* Styles are in client/src/assets/styles.css (imported globally in main.js) */
</style>
