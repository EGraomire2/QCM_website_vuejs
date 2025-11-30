<template>
  <div>
    <Header />

    <main v-if="loading" class="loading-container">
      <p>{{ $t('qcm.loading') }}</p>
    </main>

    <main v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="$router.push('/qcm/select')" class="back-button">{{ $t('qcm.backToSelection') }}</button>
    </main>

    <main v-else>
      <!-- QCM Header -->
      <div class="div-header">
        <h2>{{ qcm.name }}</h2>
        <p v-if="qcm.difficulty !== undefined">
          {{ $t('qcm.difficulty') }} 
          <span v-if="qcm.difficulty === 0">{{ $t('qcm.easy') }}</span>
          <span v-if="qcm.difficulty === 1">{{ $t('qcm.medium') }}</span>
          <span v-if="qcm.difficulty === 2">{{ $t('qcm.hard') }}</span>
        </p>
      </div>

      <!-- Questions Form -->
      <form @submit.prevent="submitAnswers">
        <div v-for="(question, idx) in questions" :key="question.id" class="answers">
          <p><strong>{{ $t('qcm.question') }} {{ idx + 1 }}:</strong> {{ question.heading }}</p>
          
          <!-- Single choice question (radio buttons) -->
          <div v-if="question.type === 'unique'">
            <div v-for="answer in question.answers" :key="answer.id" class="answer-option">
              <label>
                <input 
                  type="radio" 
                  :name="'question-' + question.id" 
                  :value="answer.id"
                  v-model="selectedAnswers[question.id]"
                  @change="handleSingleChoice(question.id, answer.id)"
                />
                <span class="answer-dot"></span>
                {{ answer.proposition }}
              </label>
            </div>
          </div>

          <!-- Multiple choice question (checkboxes) -->
          <div v-if="question.type === 'multiple'">
            <div v-for="answer in question.answers" :key="answer.id" class="answer-option">
              <label>
                <input 
                  type="checkbox" 
                  :value="answer.id"
                  v-model="selectedAnswers[question.id]"
                  @change="handleMultipleChoice(question.id, answer.id)"
                />
                <span class="answer-dot"></span>
                {{ answer.proposition }}
              </label>
            </div>
          </div>
        </div>

        <div class="div-body">
          <button type="submit" id="submit-qcm" :disabled="submitting">
            {{ submitting ? $t('qcm.submitting') : $t('qcm.submit') }}
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import api from '@/services/api';
import { useNotificationStore } from '@/stores/notification';

export default {
  name: 'AnswerQcmView',
  components: {
    Header
  },
  data() {
    return {
      qcm: {},
      questions: [],
      selectedAnswers: {}, // { questionId: answerId or [answerIds] }
      loading: true,
      error: null,
      submitting: false
    };
  },
  async mounted() {
    await this.loadQCM();
  },
  methods: {
    async loadQCM() {
      try {
        this.loading = true;
        this.error = null;

        const qcmId = this.$route.params.id;
        
        if (!qcmId) {
          this.error = this.$t('qcm.missingQcmId');
          return;
        }

        // Fetch QCM with questions from API
        const response = await api.get(`/api/qcm/${qcmId}`);
        
        if (response.data.success) {
          this.qcm = response.data.qcm;
          this.questions = response.data.questions;
          
          // Initialize selectedAnswers object
          this.questions.forEach(question => {
            if (question.type === 'unique') {
              // For single choice, store a single value
              this.selectedAnswers[question.id] = null;
            } else {
              // For multiple choice, store an array
              this.selectedAnswers[question.id] = [];
            }
          });
        } else {
          this.error = response.data.message || this.$t('qcm.errorCreatingQcm');
        }
      } catch (err) {
        console.error('Error loading QCM:', err);
        this.error = this.$t('qcm.errorLoadingQcm');
      } finally {
        this.loading = false;
      }
    },

    handleSingleChoice(questionId, answerId) {
      // For single choice questions, selecting a new answer automatically deselects the previous one
      // This is handled automatically by v-model with radio buttons
      // Property 19: Single-choice answer deselection
      this.selectedAnswers[questionId] = answerId;
    },

    handleMultipleChoice() {
      // For multiple choice questions, allow multiple selections
      // Property 20: Multiple-choice multiple selections
      // The v-model with checkboxes handles this automatically
      // selectedAnswers[questionId] is already an array
    },

    async submitAnswers() {
      try {
        this.submitting = true;
        const notificationStore = useNotificationStore();

        // Build answers array in the format expected by the API
        const answers = [];
        
        for (const questionId in this.selectedAnswers) {
          const question = this.questions.find(q => q.id === parseInt(questionId));
          
          if (question.type === 'unique') {
            // Single choice: add single answer if selected
            if (this.selectedAnswers[questionId]) {
              answers.push({
                questionId: parseInt(questionId),
                propositionId: this.selectedAnswers[questionId]
              });
            }
          } else {
            // Multiple choice: add all selected answers
            const selectedIds = this.selectedAnswers[questionId];
            if (Array.isArray(selectedIds)) {
              selectedIds.forEach(propositionId => {
                answers.push({
                  questionId: parseInt(questionId),
                  propositionId: propositionId
                });
              });
            }
          }
        }

        // Submit answers to API
        const qcmId = this.$route.params.id;
        const response = await api.post(`/api/qcm/${qcmId}/submit`, { answers });

        if (response.data.success) {
          const attemptId = response.data.attemptId;
          const grade = response.data.grade;
          
          notificationStore.showSuccess(this.$t('qcm.qcmSubmittedSuccess', { grade: grade.toFixed(2) }));
          
          // Redirect to correction page
          this.$router.push({
            name: 'Correction',
            params: {
              qcmId: qcmId,
              attemptId: attemptId
            }
          });
        } else {
          notificationStore.showError(response.data.message || this.$t('qcm.errorSubmittingMessage'));
        }
      } catch (err) {
        console.error('Error submitting answers:', err);
        const notificationStore = useNotificationStore();
        notificationStore.showError(this.$t('qcm.errorSubmitting'));
      } finally {
        this.submitting = false;
      }
    }
  }
};
</script>

<style scoped>
@import '../assets/answer.css';

.loading-container,
.error-container {
  text-align: center;
  padding: 2rem;
}

.error-message {
  color: #d64237;
  font-size: 18px;
  margin-bottom: 1rem;
}

.back-button {
  display: inline-block;
  font-weight: bold;
  color: #fcf3e8;
  background: linear-gradient(50deg, #db7850, #d64237);
  border-radius: 30px;
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  text-decoration: none;
}

.back-button:hover {
  background: #a04945;
}

.answer-option {
  margin: 10px 0;
}

.answer-option label {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.answer-option label:hover {
  background-color: rgba(219, 120, 80, 0.1);
}

.answer-option input[type="radio"],
.answer-option input[type="checkbox"] {
  margin-right: 10px;
  cursor: pointer;
}

/* Hide default radio/checkbox and use custom styling */
.answer-option input[type="radio"],
.answer-option input[type="checkbox"] {
  position: absolute;
  opacity: 0;
}

.answer-option input[type="radio"] + .answer-dot,
.answer-option input[type="checkbox"] + .answer-dot {
  display: inline-block;
  width: 22px;
  height: 22px;
  margin-right: 14px;
  border-radius: 50%;
  background: #d64237;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.answer-option input[type="radio"]:checked + .answer-dot,
.answer-option input[type="checkbox"]:checked + .answer-dot {
  background: linear-gradient(20deg, #3fc27a, #1ab1cc);
}

.answer-option input[type="checkbox"] + .answer-dot {
  border-radius: 30%;
}
</style>
