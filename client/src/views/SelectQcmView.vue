<template>
  <div>
    <Header />

    <main>
      <!-- Formulaire de sélection de matière et chapitre -->
      <div class="div-header">
        <h2>Sélectionner un QCM</h2>
        
        <div style="margin-top: 20px;">
          <label for="subject-select">Matière :</label>
          <select 
            id="subject-select" 
            v-model="selectedSubjectId" 
            @change="onSubjectChange"
          >
            <option :value="null">-- Choisir une matière --</option>
            <option 
              v-for="subject in subjects" 
              :key="subject.id" 
              :value="subject.id"
            >
              {{ subject.name }}
            </option>
          </select>
        </div>

        <div style="margin-top: 15px;">
          <label for="chapter-select">Chapitre :</label>
          <select 
            id="chapter-select" 
            v-model="selectedChapterId" 
            @change="onChapterChange"
            :disabled="!selectedSubjectId"
          >
            <option :value="null">-- Choisir un chapitre --</option>
            <option 
              v-for="chapter in filteredChapters" 
              :key="chapter.id" 
              :value="chapter.id"
            >
              {{ chapter.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Liste des QCM filtrés -->
      <div v-if="qcms.length > 0">
        <div 
          v-for="qcm in qcms" 
          :key="qcm.id" 
          class="div-body"
        >
          <h3>{{ qcm.name }}</h3>
          <p>
            Difficulté : 
            <span v-if="qcm.difficulty === 0">Facile</span>
            <span v-else-if="qcm.difficulty === 1">Moyen</span>
            <span v-else>Difficile</span>
          </p>
          
          <!-- Afficher la tentative précédente si elle existe -->
          <p v-if="getAttemptForQcm(qcm.id)">
            Dernière tentative : 
            <strong>{{ getAttemptForQcm(qcm.id).grade.toFixed(2) }}/20</strong>
            le {{ formatDate(getAttemptForQcm(qcm.id).date) }}
          </p>
          
          <div style="margin-top: 10px;">
            <button @click="startQcm(qcm.id)">
              {{ getAttemptForQcm(qcm.id) ? 'Refaire le QCM' : 'Lancer le QCM' }}
            </button>
            
            <!-- Lien vers la correction si une tentative existe -->
            <button 
              v-if="getAttemptForQcm(qcm.id)" 
              @click="viewCorrection(qcm.id, getAttemptForQcm(qcm.id).id)"
              style="margin-left: 45px !important; background: linear-gradient(50deg, #3f98c2, #491acc);"
            >
              Voir la correction
            </button>
          </div>
        </div>
      </div>

      <!-- Message si aucun QCM trouvé -->
      <div v-else-if="selectedChapterId" class="div-body">
        <p>Aucun QCM disponible pour ce chapitre.</p>
      </div>

      <!-- Message initial -->
      <div v-else class="div-body">
        <p>Sélectionnez une matière et un chapitre pour voir les QCM disponibles.</p>
      </div>
    </main>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import api from '@/services/api';
import { useNotificationStore } from '@/stores/notification';

export default {
  name: 'SelectQcmView',
  components: {
    Header
  },
  data() {
    return {
      subjects: [],
      chapters: [],
      qcms: [],
      attempts: [],
      selectedSubjectId: null,
      selectedChapterId: null,
      loading: false
    };
  },
  computed: {
    // Filtrer les chapitres par matière sélectionnée
    filteredChapters() {
      if (!this.selectedSubjectId) {
        return [];
      }
      return this.chapters.filter(
        chapter => chapter.subjectId === this.selectedSubjectId
      );
    }
  },
  async mounted() {
    await this.loadSubjects();
    await this.loadChapters();
    await this.loadAttempts();
  },
  methods: {
    async loadSubjects() {
      try {
        const response = await api.get('/api/subjects');
        this.subjects = response.data.subjects;
      } catch (error) {
        console.error('Erreur lors du chargement des matières:', error);
      }
    },

    async loadChapters() {
      try {
        const response = await api.get('/api/chapters');
        this.chapters = response.data.chapters;
      } catch (error) {
        console.error('Erreur lors du chargement des chapitres:', error);
      }
    },

    async loadAttempts() {
      try {
        const response = await api.get('/api/attempts');
        this.attempts = response.data.attempts;
      } catch (error) {
        console.error('Erreur lors du chargement des tentatives:', error);
      }
    },

    async onSubjectChange() {
      // Réinitialiser le chapitre et les QCM quand la matière change
      this.selectedChapterId = null;
      this.qcms = [];
    },

    async onChapterChange() {
      if (!this.selectedChapterId) {
        this.qcms = [];
        return;
      }

      // Charger les QCM pour le chapitre sélectionné
      await this.loadQcms();
    },

    async loadQcms() {
      try {
        this.loading = true;
        const response = await api.get('/api/qcm', {
          params: {
            subjectId: this.selectedSubjectId,
            chapterId: this.selectedChapterId
          }
        });
        this.qcms = response.data.qcms;
      } catch (error) {
        console.error('Erreur lors du chargement des QCM:', error);
        const notificationStore = useNotificationStore();
        notificationStore.showError('Erreur lors du chargement des QCM');
      } finally {
        this.loading = false;
      }
    },

    getAttemptForQcm(qcmId) {
      return this.attempts.find(attempt => attempt.qcmId === qcmId);
    },

    startQcm(qcmId) {
      this.$router.push({ name: 'AnswerQCM', params: { id: qcmId } });
    },

    viewCorrection(qcmId, attemptId) {
      this.$router.push({ 
        name: 'Correction', 
        params: { qcmId, attemptId } 
      });
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>

<style scoped>
@import '../assets/select-qcm.css';
</style>
