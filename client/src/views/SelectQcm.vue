<template>
  <div>
    <header id="main-header">
      <h1 class="main_title">Liste de QCM</h1>
      <nav class="nav-link">
        <ul>
          <li><a href="index.html">Accueil</a></li>
          <li><a href="create-qcm.html">Créer un QCM</a></li>
          <li><a href="lessons.html">Notions de cours</a></li>
        </ul>
      </nav>
    </header>

    <main>
      <section>
        <ul>
          <li v-for="q in qcms" :key="q.id">
            <h3>{{ q.title }}</h3>
            <p>{{ q.description }}</p>
            <button @click="start(q.id)">Lancer</button>
          </li>
        </ul>
      </section>
    </main>
  </div>
</template>

<script>
// filepath: c:\Users\etien\Documents\GitHub\QCM_website_vuejs\client\src\views\SelectQcm.vue
import '@/assets/create-qcm.css';

export default {
  name: 'SelectQcm',
  data() {
    return {
      qcms: [
        { id: 1, title: 'Maths - Chapitre 1', description: 'QCM de révision Chapitre 1' },
        { id: 2, title: 'Algo - Structures', description: 'Structures de données basiques' }
      ]
    };
  },
  methods: {
    start(id) {
      // redirection placeholder vers la page du QCM
      window.location.href = `qcm-${id}.html`;
    }
  }
};
</script>

<style scoped>
main { padding: 1rem; }
ul { list-style: none; padding: 0; }
li { margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
</style>
