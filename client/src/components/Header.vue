<template>
  <header id="main-header">
    <h1 class="main_title">{{ $t('app.title') }}</h1>
    
    <!-- Language Selector -->
    <div class="language-selector">
      <button @click="toggleLanguage" :title="currentLocale === 'fr' ? 'Switch to English' : 'Passer en français'">
        <img v-if="currentLocale === 'fr'" src="@/assets/france.webp" alt="Français" />
        <img v-else src="@/assets/britain.avif" alt="English" />
      </button>
    </div>
    
    <nav class="nav-link">
      <ul>
        <!-- Links when not authenticated -->
        <template v-if="!authStore.isAuthenticated">
          <li><router-link to="/register">{{ $t('nav.register') }}</router-link></li>
          <li><router-link to="/login">{{ $t('nav.login') }}</router-link></li>
          <li><router-link to="/">{{ $t('nav.home') }}</router-link></li>
        </template>

        <!-- Links when authenticated -->
        <template v-else>
          <li><router-link to="/">{{ $t('nav.home') }}</router-link></li>
          
          <!-- Teacher-only links -->
          <template v-if="authStore.isTeacher">
            <li><router-link to="/qcm/create">{{ $t('nav.createQcm') }}</router-link></li>
          </template>
          
          <!-- Links for all authenticated users -->
          <li><router-link to="/qcm/select">{{ $t('nav.qcmList') }}</router-link></li>
          <li><router-link to="/lessons">{{ $t('nav.lessons') }}</router-link></li>
          
          <!-- Logout button -->
          <li><a href="#" @click.prevent="handleLogout">{{ $t('nav.logout') }}</a></li>
        </template>
      </ul>
    </nav>
  </header>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';

export default {
  name: 'AppHeader',
  
  setup() {
    const authStore = useAuthStore();
    const { locale } = useI18n();
    
    const currentLocale = computed(() => locale.value);
    
    const changeLanguage = (lang) => {
      locale.value = lang;
      localStorage.setItem('locale', lang);
    };
    
    const toggleLanguage = () => {
      const newLang = locale.value === 'fr' ? 'en' : 'fr';
      changeLanguage(newLang);
    };
    
    return { 
      authStore,
      currentLocale,
      changeLanguage,
      toggleLanguage
    };
  },
  
  methods: {
    async handleLogout() {
      await this.authStore.logout();
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.language-selector {
  position: absolute;
  top: 20px;
  right: 30px;
  z-index: 1001;
}

.language-selector button {
  background: rgba(255, 255, 255, 0.95);
  border: 3px solid #d64237;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.language-selector button img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.language-selector button:hover {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border-color: #3f98c2;
}

.language-selector button:active {
  transform: scale(0.95);
}
</style>
