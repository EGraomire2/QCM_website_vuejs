<template>
  <div>
    <header id="main-header">
      <h1 class="main_title">Créer un compte</h1>
      <nav class="nav-link">
        <ul>
          <li><a href="index.html">Accueil</a></li>
          <li><a href="login.html">Connexion</a></li>
          <li><a href="select-qcm.html">Liste de QCM</a></li>
          <li><a href="lessons.html">Notions de cours</a></li>
        </ul>
      </nav>
    </header>

    <main>
      <form id="register-form" @submit.prevent="submit">
        <div>
          <label for="username">Nom d'utilisateur</label>
          <input id="username" v-model="form.username" type="text" required />
        </div>
        <div>
          <label for="email">E-mail</label>
          <input id="email" v-model="form.email" type="email" required />
        </div>
        <div>
          <label for="password">Mot de passe</label>
          <input id="password" v-model="form.password" type="password" required />
        </div>
        <button type="submit">Créer</button>
      </form>
    </main>
  </div>
</template>

<script>
// filepath: c:\Users\etien\Documents\GitHub\QCM_website_vuejs\client\src\views\Register.vue
import '@/assets/create-qcm.css';

export default {
  name: 'Register',
  data() {
    return {
      form: { username: '', email: '', password: '' }
    };
  },
  methods: {
    submit() {
      // placeholder : la logique serveur/auth est ignorée pour le portage de template
      console.log('register (client only):', this.form);
      // redirection simple vers login ou liste QCM
      window.location.href = 'login.html';
    }
  }
};
</script>

<style scoped>
/* styles spécifiques courts si besoin */
main { padding: 1rem; }
</style>
