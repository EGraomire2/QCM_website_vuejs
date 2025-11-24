<template>
  <div>
    <!-- Integrate the Header component with dynamic navigation -->
    <Header />

    <main>
      <section>
        <h2>Pourquoi choisir SOSprépa ?</h2>
        <ul>
          <li>✅ Aligné avec le programme EFREI</li>
          <li>✅ Révision efficace et interactive</li>
          <li>✅ Accessible sur tous les appareils</li>
        </ul>
      </section>

      <section>
        <h2>Pour qui ?</h2>
        <p>🎓 Élèves de 1ʳᵉ et 2ᵉ année motivés à réussir leurs CC et à gagner en confiance.</p>
      </section>

      <section>
        <h2>Comment ça marche ?</h2>
        <ol>
          <li>📂 Choisis une matière</li>
          <li>📝 Lance un QCM</li>
          <li>📊 Analyse tes résultats</li>
          <li>🔁 Progresse à ton rythme</li>
        </ol>

        <!-- Conditional button based on authentication -->
        <button 
          v-if="isAuthenticated" 
          id="boutonaction" 
          @click="goToSelectQcm"
        >
          Passer à l'action !
        </button>
        <button 
          v-else 
          id="boutonaction" 
          @click="goToLogin"
        >
          Connectez-vous pour commencer !
        </button>
      </section>

      <section>
        <h2>Témoignages</h2>
        <blockquote>"C'est exactement ce qu'il me fallait pour mes révisions !"</blockquote>
        <blockquote>"Super simple d'utilisation et très pratique pour les contrôles !"</blockquote>
      </section>
    </main>

    <footer>
      <p>&copy; 2025 QCM Website</p>
    </footer>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'HomeView',
  
  components: {
    Header
  },
  
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  
  computed: {
    isAuthenticated() {
      // Use the auth store instead of directly accessing localStorage
      return this.authStore.isAuthenticated;
    }
  },
  
  methods: {
    goToSelectQcm() {
      // Navigate to QCM selection page using Vue Router
      this.$router.push({ name: 'SelectQCM' });
    },
    
    goToLogin() {
      // Navigate to login page using Vue Router
      this.$router.push({ name: 'Login' });
    }
  }
};
</script>

<style scoped>
@import '../assets/create-qcm.css';
</style>
