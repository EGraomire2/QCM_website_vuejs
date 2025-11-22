<template>
  <div>
    <header id="main-header">
      <h1 class="main_title">Bienvenue sur SOSprépa</h1>
      <nav class="nav-link">
        <ul>
          <!-- Liens statiques (auth désactivée / ignorée) -->
          <li><a href="register.html">Créer un compte</a></li>
          <li><a href="login.html">Connexion</a></li>
          <li><a href="index.html">Accueil</a></li>
          <li><a href="create-qcm.html">Créer un QCM</a></li>
          <li><a href="select-qcm.html">Liste de QCM</a></li>
          <li><a href="lessons.html">Notions de cours</a></li>
        </ul>
      </nav>
    </header>

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

        <button id="boutonaction" @click="goToSelectQcm">Passer à l'action !</button>
      </section>

      <section>
        <h2>Témoignages</h2>
        <blockquote>“C’est exactement ce qu’il me fallait pour mes révisions !”</blockquote>
        <blockquote>“Super simple d’utilisation et très pratique pour les contrôles !”</blockquote>
      </section>
    </main>

    <footer>
      <p>&copy; 2025 QCM Website</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  methods: {
    goToSelectQcm() {
      // simple navigation vers la page liste de QCM (ajustez selon votre router)
      window.location.href = 'select-qcm.html';
    }
  },
  mounted() {
    // injecte le css existant (conserve css/create-qcm.css)
    const href = '/css/create-qcm.css';
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  }
};
</script>

<style scoped>
/* styles extraits du bouton présent dans l'original */
#boutonaction {
  display: inline-block;
  font-weight: bold;
  color: #fcf3e8;
  background: linear-gradient(50deg, #db7850, #d64237);
  border-radius: 30px;
  padding: 10px 10px;
  cursor: pointer;
  border: none;
  margin-top: 0;
}
#boutonaction:hover {
  background: #a04945;
}

/* spacing de base */
main { padding: 1rem; }
</style>
