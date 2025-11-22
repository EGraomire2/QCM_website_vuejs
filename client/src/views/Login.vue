<template>
  <div>
    <header id="main-header">
      <h1 class="main_title">Connexion</h1>
      <nav class="nav-link">
        <ul>
          <li><a href="index.html">Accueil</a></li>
          <li><a href="register.html">Créer un compte</a></li>
          <li><a href="select-qcm.html">Liste de QCM</a></li>
        </ul>
      </nav>
    </header>

    <main>
      <form id="login-form" @submit.prevent="submit">
        <div>
          <label for="email">E-mail</label>
          <input id="email" v-model="form.email" type="email" required />
        </div>
        <div>
          <label for="password">Mot de passe</label>
          <input id="password" v-model="form.password" type="password" required />
        </div>
        <button type="submit">Se connecter</button>
      </form>
    </main>
  </div>
</template>

<script>
// filepath: c:\Users\etien\Documents\GitHub\QCM_website_vuejs\client\src\views\Login.vue
import '@/assets/create-qcm.css';

export default {
  name: 'Login',
  data() {
    return { form: { email: '', password: '' } };
  },
  methods: {
    submit() {
      // placeholder client-only
      console.log('login (client only):', this.form);
      window.location.href = 'select-qcm.html';
    }
  }
};
</script>

<style scoped>
main { padding: 1rem; }
</style>
