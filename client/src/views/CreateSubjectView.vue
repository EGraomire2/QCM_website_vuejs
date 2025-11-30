<template>
  <div>
    <Header />
    
    <main>
      <div class="forms-container">
        <div id="error-container" class="error-message"></div>
        <div id="success-container" class="success-message"></div>

        <div class="div-body">
      <form id="create-chapter" @submit.prevent="handleChapterSubmit">
        <h2>{{ $t('subjects.createChapterTitle') }}</h2>
        <div class="answers">
          <label for="subject-select">{{ $t('subjects.chooseSubject') }}</label>
          <select v-model="chapterForm.subjectId" id="subject-select" required>
            <option value="" disabled>{{ $t('subjects.selectSubject') }}</option>
            <option v-for="subject in subjects" :key="subject.ID_Subject" :value="subject.ID_Subject">
              {{ subject.Subject_name }}
            </option>
          </select>
          <br><br>
          <label for="chapter-name">{{ $t('subjects.chapterName') }}</label>
          <input 
            v-model="chapterForm.name" 
            type="text" 
            id="chapter-name" 
            required 
            class="chapter-name"
          >
        </div>
        <button type="submit" class="submit-chapter" :disabled="isLoading">
          {{ isLoading ? $t('subjects.creating') : $t('subjects.createChapter') }}
        </button>
      </form>
    </div>

    <div class="div-body">
      <form id="create-subject" @submit.prevent="handleSubjectSubmit">
        <h2>{{ $t('subjects.createSubjectTitle') }}</h2>
        <div class="answers">
          <label for="subject-name">{{ $t('subjects.subjectName') }}</label>
          <input 
            v-model="subjectForm.name" 
            type="text" 
            id="subject-name" 
            required 
            class="subject-name"
          >
        </div>
        <button type="submit" class="submit-subject" :disabled="isLoading">
          {{ isLoading ? $t('subjects.creating') : $t('subjects.createSubject') }}
        </button>
      </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import api from '@/services/api'
import { useNotificationStore } from '@/stores/notification'

export default {
  name: 'CreateSubjectView',
  
  components: {
    Header
  },
  
  setup() {
    const notificationStore = useNotificationStore()
    return { notificationStore }
  },

  data() {
    return {
      subjects: [],
      subjectForm: {
        name: ''
      },
      chapterForm: {
        subjectId: '',
        name: ''
      },
      isLoading: false
    }
  },

  mounted() {
    this.loadSubjects()
  },

  methods: {
    async loadSubjects() {
      try {
        const response = await api.get('/api/subjects')
        this.subjects = response.data.data || []
      } catch (error) {
        console.error('Erreur lors du chargement des matières:', error)
        this.notificationStore.showError(this.$t('subjects.errorLoadingSubjects'))
      }
    },

    async handleSubjectSubmit() {
      const errorContainer = document.getElementById('error-container')
      const successContainer = document.getElementById('success-container')
      
      errorContainer.textContent = ''
      successContainer.textContent = ''

      const subjectName = this.subjectForm.name.trim()

      if (!subjectName) {
        errorContainer.textContent = this.$t('subjects.fillSubjectName')
        return
      }

      this.isLoading = true

      try {
        const response = await api.post('/api/subjects/create', {
          subjectName: subjectName
        })

        if (response.data.success) {
          // Ajouter la nouvelle matière à la liste
          const newOption = {
            ID_Subject: response.data.subjectId,
            Subject_name: subjectName
          }
          this.subjects.push(newOption)
          
          successContainer.textContent = this.$t('subjects.subjectCreatedSuccess')
          this.subjectForm.name = ''
        } else {
          errorContainer.textContent = response.data.message || this.$t('subjects.errorCreating')
        }
      } catch (error) {
        console.error('Erreur:', error)
        errorContainer.textContent = error.response?.data?.message || this.$t('subjects.cannotContactServer')
      } finally {
        this.isLoading = false
      }
    },

    async handleChapterSubmit() {
      const errorContainer = document.getElementById('error-container')
      const successContainer = document.getElementById('success-container')
      
      errorContainer.textContent = ''
      successContainer.textContent = ''

      const subjectId = this.chapterForm.subjectId
      const chapterName = this.chapterForm.name.trim()

      if (!subjectId || !chapterName) {
        errorContainer.textContent = this.$t('subjects.fillChapterName')
        return
      }

      this.isLoading = true

      try {
        const response = await api.post('/api/chapters/create', {
          subjectId: subjectId,
          chapterName: chapterName
        })

        if (response.data.success) {
          successContainer.textContent = this.$t('subjects.chapterCreatedSuccess')
          this.chapterForm.name = ''
          this.chapterForm.subjectId = ''
        } else {
          errorContainer.textContent = response.data.message || this.$t('subjects.errorCreating')
        }
      } catch (error) {
        console.error('Erreur:', error)
        errorContainer.textContent = error.response?.data?.message || this.$t('subjects.cannotContactServer')
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
@import '@/assets/create-qcm.css';
</style>
