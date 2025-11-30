<template>
  <div>
    <!-- Integrate the Header component with dynamic navigation -->
    <Header />

    <main>
      <section>
        <h2>{{ $t('home.whyTitle') }}</h2>
        <ul>
          <li>✅ {{ $t('home.feature1') }}</li>
          <li>✅ {{ $t('home.feature2') }}</li>
          <li>✅ {{ $t('home.feature3') }}</li>
        </ul>
      </section>

      <section>
        <h2>{{ $t('home.forWhoTitle') }}</h2>
        <p>🎓 {{ $t('home.forWhoDesc') }}</p>
      </section>

      <section>
        <h2>{{ $t('home.howTitle') }}</h2>
        <ol>
          <li>📂 {{ $t('home.step1') }}</li>
          <li>📝 {{ $t('home.step2') }}</li>
          <li>📊 {{ $t('home.step3') }}</li>
          <li>🔁 {{ $t('home.step4') }}</li>
        </ol>

        <!-- Conditional button based on authentication -->
        <button 
          v-if="isAuthenticated" 
          id="boutonaction" 
          @click="goToSelectQcm"
        >
          {{ $t('home.ctaAuth') }}
        </button>
        <button 
          v-else 
          id="boutonaction" 
          @click="goToLogin"
        >
          {{ $t('home.ctaGuest') }}
        </button>
      </section>

      <section>
        <h2>{{ $t('home.testimonialsTitle') }}</h2>
        <blockquote>"{{ $t('home.testimonial1') }}"</blockquote>
        <blockquote>"{{ $t('home.testimonial2') }}"</blockquote>
      </section>
    </main>

    <footer>
      <p>{{ $t('app.copyright') }}</p>
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
