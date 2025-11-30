<template>
  <div>
    <Header />

    <main id="pdf">
      <h2 id="pdf-title">{{ pdfTitle }}</h2>

      <div class="pdf-selector">
        <label for="pdf-select">{{ $t('lessons.selectPdf') }}</label>
        <select id="pdf-select" v-model="selectedPdf" @change="onPdfChange">
          <option value="">{{ $t('lessons.selectOption') }}</option>
          <option v-for="opt in pdfOptions" :key="opt.path" :value="opt.path">{{ $t(opt.labelKey) }}</option>
        </select>
      </div>

      <button id="download-button" v-if="selectedPdf" @click="downloadPdf">{{ $t('lessons.download') }}</button>

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
        { path: 'docs/Fiche_Methodes_1_SM301.pdf', labelKey: 'lessons.s3Proba1' },
        { path: 'docs/Fiche_Methodes_2_SM301.pdf', labelKey: 'lessons.s3Proba2' },
        { path: 'docs/Fiche_Methodes_SM302.pdf', labelKey: 'lessons.s3Functions' },
        { path: 'docs/Fiche_Methodes_Chapitre_1_SM202.pdf', labelKey: 'lessons.s2Analysis1' },
        { path: 'docs/Fiche_Methodes_Chapitre_1_SM402.pdf', labelKey: 'lessons.s4Automata' },
        { path: 'docs/Fiche_Methodes_Chapitre_2_1_SM202.pdf', labelKey: 'lessons.s2Analysis2_1' },
        { path: 'docs/Fiche_Methodes_Chapitre_2_2_SM202.pdf', labelKey: 'lessons.s2Analysis2_2' },
        { path: 'docs/Fiche_Methodes_Chapitre_3_SM202.pdf', labelKey: 'lessons.s2Analysis3' },
        { path: 'docs/Fiche_Methodes_SM401.pdf', labelKey: 'lessons.s4MathModeling' },
        { path: 'docs/Fiche_Trigonometrie.pdf', labelKey: 'lessons.trigonometry' }
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
        this.pdfTitle = selectedOption ? this.$t(selectedOption.labelKey) : '';
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
