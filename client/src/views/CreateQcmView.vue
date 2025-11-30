<template>
  <div>
    <Header />

    <main>
      <form id="create-qcm-form" @submit.prevent="submitQCM">
        <div class="div-header">
          <div class="qcm-name-div">
            <label for="qcm-name">{{ $t('qcm.name') }}</label>
            <input 
              type="text" 
              class="qcm-name" 
              id="qcm-name" 
              v-model="qcmName" 
              required
            >
          </div>

          <div class="qcm-subject-div">
            <label for="qcm-subject">{{ $t('qcm.subject') }}</label>
            <select 
              class="qcm-subject" 
              id="qcm-subject" 
              v-model="selectedSubject" 
              @change="onSubjectChange"
              required
            >
              <option value="">{{ $t('qcm.selectSubject') }}</option>
              <option 
                v-for="subject in subjects" 
                :key="subject.id" 
                :value="subject.id"
              >
                {{ subject.name }}
              </option>
            </select>
          </div>

          <div class="qcm-chapter-div">
            <label for="qcm-chapter">{{ $t('qcm.chapter') }}</label>
            <select 
              class="qcm-chapter" 
              id="qcm-chapter" 
              v-model="selectedChapter"
              required
            >
              <option value="">{{ $t('qcm.selectChapter') }}</option>
              <option 
                v-for="chapter in filteredChapters" 
                :key="chapter.id" 
                :value="chapter.id"
              >
                {{ chapter.name }}
              </option>
            </select>
          </div>

          <p>
            {{ $t('qcm.addSubjectChapter') }}
            <router-link to="/subjects/create">{{ $t('qcm.addLink') }}</router-link>
          </p>
        </div>

        <div id="forms-body">
          <div 
            v-for="(question, index) in questions" 
            :key="question.id" 
            class="div-body"
          >
            <div class="question-field">
              <label :for="`question-${question.id}`">{{ $t('qcm.question') }} :</label>
              <input 
                type="text" 
                :id="`question-${question.id}`"
                class="question-input" 
                v-model="question.heading"
                required
              >
            </div>

            <div class="answers">
              <div 
                v-for="(answer, answerIndex) in question.answers" 
                :key="answer.id" 
                class="answer"
              >
                <span 
                  class="answer-dot" 
                  :class="{ correct: answer.isCorrect }"
                  @click="toggleCorrectAnswer(index, answerIndex)"
                  :title="$t('qcm.clickToMarkCorrect')"
                ></span>
                <label :for="`answer-${question.id}-${answer.id}`">
                  {{ $t('qcm.answer') }} {{ answerIndex + 1}} :
                </label>
                <input 
                  type="text" 
                  :id="`answer-${question.id}-${answer.id}`"
                  v-model="answer.text"
                  required
                >
                <button 
                  v-if="question.answers.length > 2"
                  type="button" 
                  class="remove-answer"
                  @click="removeAnswer(index, answerIndex)"
                >
                  {{ $t('qcm.deleteAnswer') }}
                </button>
              </div>
            </div>

            <div class="button-field">
              <button 
                type="button" 
                class="add-answer"
                @click="addAnswer(index)"
              >
                {{ $t('qcm.addAnswer') }}
              </button>
            </div>

            <div class="toggle-switch-container">
              <span>{{ $t('qcm.responseMode') }}</span>
              <label class="switch">
                <input 
                  type="checkbox" 
                  class="toggle-multiple"
                  v-model="question.multipleChoice"
                  @change="onToggleMultiple(index)"
                >
                <span class="slider round"></span>
              </label>
              <span class="toggle-status">
                {{ question.multipleChoice ? $t('qcm.multipleChoice') : $t('qcm.singleChoice') }}
              </span>
            </div>

            <div class="explanation-field">
              <label :for="`explanation-${question.id}`">{{ $t('qcm.explanation') }}</label>
              <textarea 
                :id="`explanation-${question.id}`"
                class="explanation"
                v-model="question.explanation"
                rows="3" 
                :placeholder="$t('qcm.explanationPlaceholder')"
              ></textarea>
            </div>

            <div class="points-fields">
              <div class="negative-points">
                <label>{{ $t('qcm.negativePoints') }}</label>
                <div class="points">
                  <button 
                    type="button" 
                    class="decrease-negative"
                    @click="decreaseNegativePoints(index)"
                  >
                    -
                  </button>
                  <span class="negative-value">{{ question.negativePoints }}</span>
                  <button 
                    type="button" 
                    class="increase-negative"
                    @click="increaseNegativePoints(index)"
                  >
                    +
                  </button>
                </div>
              </div>
              <div class="question-points">
                <label>{{ $t('qcm.questionPoints') }}</label>
                <div class="points">
                  <button 
                    type="button" 
                    class="decrease-points"
                    @click="decreaseQuestionPoints(index)"
                  >
                    -
                  </button>
                  <span class="points-value">{{ question.points }}</span>
                  <button 
                    type="button" 
                    class="increase-points"
                    @click="increaseQuestionPoints(index)"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div v-if="index > 0" class="button-field">
              <button 
                type="button" 
                class="delete-question"
                @click="removeQuestion(index)"
              >
                {{ $t('qcm.deleteQuestion') }}
              </button>
            </div>
          </div>

          <div class="buttons">
            <button 
              type="button" 
              id="add-question"
              @click="addQuestion"
            >
              {{ $t('qcm.addQuestion') }}
            </button>
            <div class="difficulty-field">
              <label for="difficulty">{{ $t('qcm.difficulty') }}</label>
              <select id="difficulty" v-model="difficulty" required>
                <option value="0">{{ $t('qcm.easy') }}</option>
                <option value="1">{{ $t('qcm.medium') }}</option>
                <option value="2">{{ $t('qcm.hard') }}</option>
              </select>
            </div>
            <button type="submit" id="submit-qcm">{{ $t('qcm.create') }}</button>
          </div>
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
  name: 'CreateQcmView',
  components: {
    Header
  },
  data() {
    return {
      qcmName: '',
      selectedSubject: '',
      selectedChapter: '',
      difficulty: '1',
      subjects: [],
      chapters: [],
      questions: [
        {
          id: 1,
          heading: '',
          answers: [
            { id: 1, text: '', isCorrect: false },
            { id: 2, text: '', isCorrect: false }
          ],
          multipleChoice: false,
          negativePoints: 0,
          points: 2,
          explanation: ''
        }
      ],
      nextQuestionId: 2,
      nextAnswerId: 3
    };
  },
  computed: {
    filteredChapters() {
      if (!this.selectedSubject) return [];
      return this.chapters.filter(ch => ch.subjectId === parseInt(this.selectedSubject));
    }
  },
  async mounted() {
    await this.loadSubjects();
    await this.loadChapters();
  },
  methods: {
    async loadSubjects() {
      try {
        const response = await api.get('/api/subjects');
        this.subjects = response.data.subjects.map(s => ({
          id: s.id,
          name: s.name
        }));
      } catch (error) {
        console.error('Error loading subjects:', error);
        useNotificationStore().showError(this.$t('subjects.errorLoadingSubjects'));
      }
    },
    async loadChapters() {
      try {
        const response = await api.get('/api/chapters');
        this.chapters = response.data.chapters.map(ch => ({
          id: ch.id,
          name: ch.name,
          subjectId: ch.subjectId
        }));
      } catch (error) {
        console.error('Error loading chapters:', error);
        useNotificationStore().showError(this.$t('subjects.errorLoadingChapters'));
      }
    },
    onSubjectChange() {
      this.selectedChapter = '';
    },
    addQuestion() {
      this.questions.push({
        id: this.nextQuestionId++,
        heading: '',
        answers: [
          { id: this.nextAnswerId++, text: '', isCorrect: false },
          { id: this.nextAnswerId++, text: '', isCorrect: false }
        ],
        multipleChoice: false,
        negativePoints: 0,
        points: 2,
        explanation: ''
      });
    },
    removeQuestion(index) {
      this.questions.splice(index, 1);
    },
    addAnswer(questionIndex) {
      this.questions[questionIndex].answers.push({
        id: this.nextAnswerId++,
        text: '',
        isCorrect: false
      });
    },
    removeAnswer(questionIndex, answerIndex) {
      this.questions[questionIndex].answers.splice(answerIndex, 1);
    },
    toggleCorrectAnswer(questionIndex, answerIndex) {
      const question = this.questions[questionIndex];
      
      if (!question.multipleChoice) {
        // Mode unique: désélectionner toutes les autres réponses
        question.answers.forEach((answer, idx) => {
          answer.isCorrect = idx === answerIndex;
        });
      } else {
        // Mode multiple: toggle la réponse
        question.answers[answerIndex].isCorrect = !question.answers[answerIndex].isCorrect;
      }
    },
    onToggleMultiple(questionIndex) {
      const question = this.questions[questionIndex];
      
      if (question.multipleChoice) {
        question.negativePoints = 0.5;
      } else {
        question.negativePoints = 0;
        // En mode unique, garder seulement la première réponse correcte
        let foundFirst = false;
        question.answers.forEach(answer => {
          if (answer.isCorrect && !foundFirst) {
            foundFirst = true;
          } else if (answer.isCorrect) {
            answer.isCorrect = false;
          }
        });
      }
    },
    decreaseNegativePoints(index) {
      const question = this.questions[index];
      if (question.negativePoints > 0) {
        question.negativePoints = Math.round((question.negativePoints - 0.25) * 100) / 100;
      }
    },
    increaseNegativePoints(index) {
      const question = this.questions[index];
      question.negativePoints = Math.round((question.negativePoints + 0.25) * 100) / 100;
    },
    decreaseQuestionPoints(index) {
      const question = this.questions[index];
      if (question.points > 0) {
        question.points = Math.max(0, question.points - 0.5);
      }
    },
    increaseQuestionPoints(index) {
      const question = this.questions[index];
      question.points += 0.5;
    },
    validateForm() {
      // Vérifier que le nom du QCM est rempli
      if (!this.qcmName.trim()) {
        useNotificationStore().showError(this.$t('qcm.qcmNameRequired'));
        return false;
      }

      // Vérifier que la matière et le chapitre sont sélectionnés
      if (!this.selectedSubject) {
        useNotificationStore().showError(this.$t('qcm.selectSubjectRequired'));
        return false;
      }

      if (!this.selectedChapter) {
        useNotificationStore().showError(this.$t('qcm.selectChapterRequired'));
        return false;
      }

      // Vérifier qu'il y a au moins une question
      if (this.questions.length === 0) {
        useNotificationStore().showError(this.$t('qcm.minOneQuestion'));
        return false;
      }

      // Vérifier chaque question
      for (let i = 0; i < this.questions.length; i++) {
        const question = this.questions[i];

        // Vérifier que la question a un texte
        if (!question.heading.trim()) {
          useNotificationStore().showError(this.$t('qcm.questionEmpty', { index: i + 1 }));
          return false;
        }

        // Vérifier qu'il y a au moins 2 réponses
        if (question.answers.length < 2) {
          useNotificationStore().showError(this.$t('qcm.minTwoAnswers', { index: i + 1 }));
          return false;
        }

        // Vérifier que toutes les réponses ont un texte
        for (let j = 0; j < question.answers.length; j++) {
          if (!question.answers[j].text.trim()) {
            useNotificationStore().showError(this.$t('qcm.answerEmpty', { answerIndex: j + 1, questionIndex: i + 1 }));
            return false;
          }
        }

        // Vérifier qu'au moins une réponse est correcte
        const hasCorrectAnswer = question.answers.some(answer => answer.isCorrect);
        if (!hasCorrectAnswer) {
          useNotificationStore().showError(this.$t('qcm.minOneCorrect', { index: i + 1 }));
          return false;
        }
      }

      return true;
    },
    async submitQCM() {
      if (!this.validateForm()) {
        return;
      }

      try {
        // Préparer les données pour l'API
        const questionsData = this.questions.map(question => {
          const isCorrect = question.answers.map(answer => answer.isCorrect);
          return {
            question: question.heading,
            answers: question.answers.map(answer => answer.text),
            isCorrect: isCorrect,
            multipleCorrect: question.multipleChoice,
            negativePoints: question.negativePoints,
            questionPoints: question.points,
            explanation: question.explanation || ''
          };
        });

        const qcmData = {
          qcmName: this.qcmName,
          qcmSubject: parseInt(this.selectedSubject),
          qcmChapter: parseInt(this.selectedChapter),
          difficulty: parseInt(this.difficulty),
          questions: questionsData
        };

        const response = await api.post('/api/qcm/create', qcmData);

        if (response.data.success) {
          useNotificationStore().showSuccess(this.$t('qcm.qcmCreatedSuccess'));
          // Réinitialiser le formulaire
          this.resetForm();
          // Rediriger vers la liste des QCM après un court délai
          setTimeout(() => {
            this.$router.push('/qcm/select');
          }, 1500);
        }
      } catch (error) {
        console.error('Error creating QCM:', error);
        const errorMessage = error.response?.data?.message || this.$t('qcm.errorCreatingQcm');
        useNotificationStore().showError(errorMessage);
      }
    },
    resetForm() {
      this.qcmName = '';
      this.selectedSubject = '';
      this.selectedChapter = '';
      this.difficulty = '1';
      this.questions = [
        {
          id: this.nextQuestionId++,
          heading: '',
          answers: [
            { id: this.nextAnswerId++, text: '', isCorrect: false },
            { id: this.nextAnswerId++, text: '', isCorrect: false }
          ],
          multipleChoice: false,
          negativePoints: 0,
          points: 2,
          explanation: ''
        }
      ];
    }
  }
};
</script>

<style scoped>
@import '../assets/create-qcm.css';
</style>
