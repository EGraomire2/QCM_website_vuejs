<template>
  <div>
    <header id="main-header">
      <h1 class="main_title">Répondre au QCM</h1>
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
        <h2>{{ qcm.title || 'QCM - Exemple' }}</h2>
        <p v-if="qcm.description">{{ qcm.description }}</p>

        <form @submit.prevent="submitAnswers">
          <div v-for="(q, idx) in questions" :key="q.id" class="question">
            <p><strong>Q{{ idx + 1 }}.</strong> {{ q.text }}</p>
            <div v-for="opt in q.options" :key="opt">
              <label>
                <input type="radio" :name="'q'+q.id" :value="opt" v-model="answers[q.id]" />
                {{ opt }}
              </label>
            </div>
          </div>

          <button type="submit">Valider</button>
        </form>
      </section>
    </main>
  </div>
</template>

<script>
// filepath: c:\Users\etien\Documents\GitHub\QCM_website_vuejs\client\src\views\AnswerQcm.vue
import '@/assets/create-qcm.css';

export default {
  name: 'AnswerQcmView',
  data() {
    return {
      qcm: { title: '', description: '' },
      questions: [
        { id: 1, text: 'Exemple : 2+2 = ?', options: ['3', '4', '5'] },
        { id: 2, text: 'Exemple : capitale de la France ?', options: ['Paris', 'Lyon', 'Marseille'] }
      ],
      answers: {} // { questionId: selectedOption }
    };
  },
  methods: {
    submitAnswers() {
      // placeholder: la logique serveur est ignorée pour le portage
      console.log('answers (client-only):', this.answers);
      // redirection vers la page de correction (ajustez selon router)
      window.location.href = 'correction.html';
    }
  },
  mounted() {
    // si besoin, vous pouvez récupérer qcm/questions depuis props ou store
  }
};
</script>

<style scoped>
main { padding: 1rem; }
.question { margin-bottom: 1rem; }
button { margin-top: 1rem; }
</style>
