<template>
  <div>
    <header id="main-header">
      <h1 class="main_title">Créer un QCM</h1>
      <nav class="nav-link">
        <ul>
          <li><a href="index.html">Accueil</a></li>
          <li><a href="select-qcm.html">Liste de QCM</a></li>
          <li><a href="lessons.html">Notions de cours</a></li>
        </ul>
      </nav>
    </header>

    <main>
      <form id="create-qcm-form" @submit.prevent="submit">
        <div>
          <label for="title">Titre</label>
          <input id="title" v-model="qcm.title" required />
        </div>
        <div>
          <label for="desc">Description</label>
          <textarea id="desc" v-model="qcm.description"></textarea>
        </div>
        <!-- zone questions simplifiée -->
        <button type="submit">Enregistrer (template uniquement)</button>
      </form>
    </main>
  </div>
</template>

<script>
// filepath: c:\Users\etien\Documents\GitHub\QCM_website_vuejs\client\src\views\CreateQcm.vue
import '@/assets/create-qcm.css';

export default {
  name: 'CreateQcm',
  data() {
    return {
      qcm: { title: '', description: '' }
    };
  },
  methods: {
    submit() {
      console.log('create qcm (client only):', this.qcm);
      window.location.href = 'select-qcm.html';
    }
  }
};
</script>

<style scoped>
main { padding: 1rem; }
</style>
