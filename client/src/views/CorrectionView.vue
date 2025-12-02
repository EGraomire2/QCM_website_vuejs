<template>
  <div>
    <Header />

    <main v-if="!loading && correctionData" class="correction-container">
      <!-- QCM Header Information -->
      <div class="div-header">
        <h2>{{ $t('qcm.correctionTitle') }} {{ correctionData.qcm.name }}</h2>
        <p>{{ $t('qcm.difficulty') }} {{ getDifficultyLabel(correctionData.qcm.difficulty) }}</p>
        <p>{{ $t('qcm.gradeObtained') }} <strong>{{ correctionData.attempt.grade.toFixed(2) }} / 20</strong></p>
        <p>{{ $t('qcm.date') }} {{ formatDate(correctionData.attempt.date) }}</p>
      </div>

      <!-- Questions and Answers -->
      <div v-for="(question, index) in correctionData.questions" :key="question.id" class="div-body">
        <h3>{{ $t('qcm.question') }} {{ index + 1 }}</h3>
        <p><strong>{{ question.heading }}</strong></p>
        <p>{{ $t('qcm.type') }} {{ question.type === 'unique' ? $t('qcm.uniqueChoice') : $t('qcm.multipleChoiceType') }}</p>
        <p>{{ $t('qcm.points') }} : {{ question.points }} | {{ $t('qcm.negativePointsLabel') }} : {{ question.negativePoints }}</p>

        <!-- Propositions -->
        <div class="answers">
          <div 
            v-for="proposition in question.propositions" 
            :key="proposition.id"
            :class="getPropositionClass(proposition, question.userAnswers)"
          >
            <span 
              class="answer-dot" 
              :class="{ 'correct': proposition.validity }"
            ></span>
            <span>{{ proposition.proposition }}</span>
            <span v-if="isUserAnswer(proposition.id, question.userAnswers)"> {{ $t('qcm.yourAnswer') }}</span>
          </div>
        </div>

        <!-- Explanation if exists -->
        <div v-if="question.explanation" class="explanation">
          <strong>{{ $t('qcm.explanation') }}</strong> {{ question.explanation }}
        </div>

        <!-- Points earned for this question -->
        <div class="points-fields">
          <p><strong>{{ $t('qcm.pointsEarned') }} {{ question.pointsEarned }} / {{ question.points }}</strong></p>
        </div>
      </div>

      <!-- Back button -->
      <div class="div-body back-button-container">
        <button @click="backToList">{{ $t('qcm.backToList') }}</button>
      </div>
    </main>

    <main v-else-if="loading">
      <div class="div-header">
        <p>{{ $t('qcm.loadingCorrection') }}</p>
      </div>
    </main>

    <main v-else-if="error">
      <div class="div-header">
        <p style="color: red;">{{ error }}</p>
        <button @click="backToList">{{ $t('qcm.backToList') }}</button>
      </div>
    </main>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import api from '@/services/api';
import { useNotificationStore } from '@/stores/notification';

export default {
  name: 'CorrectionView',
  components: {
    Header
  },
  data() {
    return {
      correctionData: null,
      loading: true,
      error: null
    };
  },
  async mounted() {
    await this.loadCorrection();
  },
  methods: {
    async loadCorrection() {
      try {
        this.loading = true;
        this.error = null;

        const qcmId = this.$route.params.qcmId;
        const attemptId = this.$route.params.attemptId;

        if (!qcmId || !attemptId) {
          this.error = this.$t('qcm.missingParams');
          return;
        }

        // Fetch correction data from API
        const response = await api.get(`/api/qcm/${qcmId}/correction/${attemptId}`);

        if (response.data.success) {
          this.correctionData = response.data;
        } else {
          this.error = response.data.message || this.$t('qcm.errorLoadingCorrection');
        }
      } catch (err) {
        console.error('Error loading correction:', err);
        this.error = err.response?.data?.message || this.$t('qcm.errorLoadingCorrection');
        
        const notificationStore = useNotificationStore();
        notificationStore.showError(this.error);
      } finally {
        this.loading = false;
      }
    },

    getDifficultyLabel(difficulty) {
      const labels = {
        0: this.$t('qcm.easy'),
        1: this.$t('qcm.medium'),
        2: this.$t('qcm.hard')
      };
      return labels[difficulty] || '';
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    isUserAnswer(propositionId, userAnswers) {
      return userAnswers.includes(propositionId);
    },

    getPropositionClass(proposition, userAnswers) {
      const isSelected = this.isUserAnswer(proposition.id, userAnswers);
      const isCorrect = proposition.validity;

      let classes = [];

      // Ajouter la classe pour les bonnes réponses (background vert)
      if (isCorrect) {
        classes.push('correct-answer');
      }

      // Ajouter la classe selon si l'utilisateur a sélectionné ou non (couleur du dot)
      if (isSelected) {
        classes.push('user-selected');
      } else {
        classes.push('user-not-selected');
      }

      return classes.join(' ');
    },

    backToList() {
      this.$router.push('/qcm/select');
    }
  }
};
</script>

<style scoped>
@import '../assets/correct.css';
</style>
