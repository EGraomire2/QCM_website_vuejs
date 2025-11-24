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
/* Main content spacing to account for fixed header */
main { 
  padding: 1rem;
  margin-top: 180px; /* Space for fixed header */
}

/* Section styling */
section {
  max-width: 900px;
  margin: 30px auto;
  padding: 20px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

section h2 {
  color: #d64237;
  margin-bottom: 15px;
}

section ul, section ol {
  line-height: 1.8;
  color: #35424a;
}

section p {
  line-height: 1.8;
  color: #35424a;
  font-size: 16px;
}

/* Button styling */
#boutonaction {
  display: inline-block;
  font-weight: bold;
  color: #fcf3e8;
  background: linear-gradient(50deg, #db7850, #d64237);
  border-radius: 30px;
  padding: 12px 24px;
  cursor: pointer;
  border: none;
  margin-top: 20px;
  font-size: 16px;
  transition: all 0.3s ease;
}

#boutonaction:hover {
  background: #a04945;
  transform: scale(1.05);
}

/* Testimonials styling */
blockquote {
  background: #fcf3e8;
  border-left: 4px solid #db7850;
  padding: 15px 20px;
  margin: 15px 0;
  font-style: italic;
  color: #35424a;
}

/* Footer styling */
footer {
  text-align: center;
  padding: 20px;
  background: linear-gradient(50deg, #db6c50 70%, #d64237);
  color: #ffeace;
  margin-top: 40px;
}
</style>
