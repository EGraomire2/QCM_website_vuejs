<template>
  <div>
    <header id="main-header">
      <h1 class="main_title">Correction</h1>
      <nav class="nav-link">
        <ul>
          <li><a href="index.html">Accueil</a></li>
          <li><a href="select-qcm.html">Liste de QCM</a></li>
          <li><a href="lessons.html">Notions de cours</a></li>
        </ul>
      </nav>
    </header>

    <main>
      <section>
        <h2>Correction du QCM</h2>
        <ul>
          <li v-for="(c, idx) in corrections" :key="idx">
            <p><strong>Q{{ idx + 1 }}.</strong> {{ c.question }}</p>
            <p>Votre réponse : <em>{{ c.your }}</em></p>
            <p>Réponse correcte : <strong>{{ c.correct }}</strong></p>
          </li>
        </ul>

        <button @click="backToList">Retour à la liste</button>
      </section>
    </main>
  </div>
</template>

<script>
// filepath: c:\Users\etien\Documents\GitHub\QCM_website_vuejs\client\src\views\Correction.vue
import '@/assets/create-qcm.css';

export default {
  name: 'Correction',
  data() {
    return {
      corrections: [
        { question: '2+2 = ?', your: '4', correct: '4' },
        { question: 'Capitale de la France ?', your: 'Paris', correct: 'Paris' }
      ]
    };
  },
  methods: {
    backToList() {
      window.location.href = 'select-qcm.html';
    }
  }
};
</script>

<style scoped>
main { padding: 1rem; }
ul { list-style: none; padding: 0; }
li { margin-bottom: 1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem; }
button { margin-top: 1rem; }
@import '../assets/correct.css';
</style>
