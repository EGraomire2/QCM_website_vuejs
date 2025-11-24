<template>
  <div>
    <Header />

    <main id="pdf">
      <h2 id="pdf-title">{{ pdfTitle }}</h2>

      <div class="pdf-selector">
        <label for="pdf-select">Choisissez votre fiche de révisions :</label>
        <select id="pdf-select" v-model="selectedPdf" @change="onPdfChange">
          <option value="">-- Sélectionner un PDF --</option>
          <option v-for="opt in pdfOptions" :key="opt.path" :value="opt.path">{{ opt.label }}</option>
        </select>
      </div>

      <button id="download-button" v-if="selectedPdf" @click="downloadPdf">Télécharger</button>

      <iframe id="pdf-viewer" v-if="selectedPdf" :src="iframeSrc"></iframe>
    </main>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';

export default {
  name: 'LessonsView',
  components: {
    Header
  },
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
    onPdfChange() {
      if (this.selectedPdf) {
        // Set the iframe source to display the PDF
        this.iframeSrc = this.selectedPdf;
        
        // Update the title with the selected PDF label
        const selectedOption = this.pdfOptions.find(opt => opt.path === this.selectedPdf);
        this.pdfTitle = selectedOption ? selectedOption.label : '';
      } else {
        // Clear the iframe and title when no PDF is selected
        this.iframeSrc = '';
        this.pdfTitle = '';
      }
    },
    downloadPdf() {
      if (this.selectedPdf) {
        // Open the PDF in a new tab for download
        window.open(this.selectedPdf, '_blank');
      }
    }
  }
};
</script>

<style>
/* Import existing lessons.css for consistent styling */
@import '../assets/lessons.css';
</style>
