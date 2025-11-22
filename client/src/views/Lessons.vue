<template>
  <div>
    <header id="main-header">
      <h1 class="main_title">Fiches de révisions</h1>
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

    <main id="pdf">
      <h2 id="pdf-title">{{ pdfTitle }}</h2>

      <div class="pdf-selector">
        <label for="pdf-select">Choisissez votre fiche de révisions :</label>
        <select id="pdf-select" v-model="selectedPdf" @change="onChange">
          <option value="">-- Sélectionner un PDF --</option>
          <option v-for="opt in pdfOptions" :key="opt.path" :value="opt.path">{{ opt.label }}</option>
        </select>
      </div>

      <button id="download-button" v-show="selectedPdf" @click="downloadPdf">Télécharger</button>

      <iframe id="pdf-viewer" v-show="selectedPdf" :src="iframeSrc"></iframe>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Lessons',
  data() {
    return {
      selectedPdf: '',
      iframeSrc: '',
      pdfTitle: '',
      pdfOptions: [
        { path: 'docs/Fiche_Methodes_1_SM301.pdf', label: 'S3-Probabilités-1' },
        { path: 'docs/Fiche_Methodes_2_SM301.pdf', label: 'S3-Probabilités-2' },
        { path: 'docs/Fiche_Methodes_SM302.pdf', label: 'S3-Fonctions de plusieurs variables' },
        { path: 'docs/Fiche_Methodes_Chapitre_1_SM202.pdf', label: 'S2-Analyse 2 Chapitre 1' },
        { path: 'docs/Fiche_Methodes_Chapitre_1_SM402.pdf', label: 'S4-Automates finis et expression rationnelles' },
        { path: 'docs/Fiche_Methodes_Chapitre_2_1_SM202.pdf', label: 'S2-Analyse 2 Chapitre 2 n°1' },
        { path: 'docs/Fiche_Methodes_Chapitre_2_2_SM202.pdf', label: 'S2-Analyse 2 Chapitre 2 n°2' },
        { path: 'docs/Fiche_Methodes_Chapitre_3_SM202.pdf', label: 'S2-Analyse 2 Chapitre 3' },
        { path: 'docs/Fiche_Methodes_SM401.pdf', label: 'S4-Modélisation Mathématiques' },
        { path: 'docs/Fiche_Trigonometrie.pdf', label: 'Fiche trigonométrie' }
      ]
    };
  },
  methods: {
    onChange() {
      if (this.selectedPdf) {
        this.iframeSrc = this.selectedPdf;
        const opt = this.pdfOptions.find(o => o.path === this.selectedPdf);
        this.pdfTitle = opt ? opt.label : '';
      } else {
        this.iframeSrc = '';
        this.pdfTitle = '';
      }
    },
    downloadPdf() {
      if (this.selectedPdf) {
        window.open(this.selectedPdf, '_blank');
      }
    }
  },
  mounted() {
    // injecte le css existant (conserve /css/lessons.css tel quel)
    const href = '/css/lessons.css';
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
/* styles de base pour garder un rendu proche de l'original */
#pdf { padding: 1rem; }
.pdf-selector { margin-top: 1rem; }
#download-button { margin-top: 0.5rem; }
iframe#pdf-viewer { width: 100%; height: 800px; border: none; margin-top: 1rem; }
</style>
