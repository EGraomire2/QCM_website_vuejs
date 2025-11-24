<template>
  <div>
    <Header />
    
    <main>
      <div class="forms-container">
        <div id="error-container" class="error-message"></div>
        <div id="success-container" class="success-message"></div>

        <div class="div-body">
      <form id="create-chapter" @submit.prevent="handleChapterSubmit">
        <h2>Créer un chapitre</h2>
        <div class="answers">
          <label for="subject-select">Choisir une matière : </label>
          <select v-model="chapterForm.subjectId" id="subject-select" required>
            <option value="" disabled>-- Sélectionner une matière --</option>
            <option v-for="subject in subjects" :key="subject.ID_Subject" :value="subject.ID_Subject">
              {{ subject.Subject_name }}
            </option>
          </select>
          <br><br>
          <label for="chapter-name">Nom du chapitre : </label>
          <input 
            v-model="chapterForm.name" 
            type="text" 
            id="chapter-name" 
            required 
            class="chapter-name"
          >
        </div>
        <button type="submit" class="submit-chapter" :disabled="isLoading">
          {{ isLoading ? 'Création...' : 'Créer le chapitre' }}
        </button>
      </form>
    </div>

    <div class="div-body">
      <form id="create-subject" @submit.prevent="handleSubjectSubmit">
        <h2>Créer une matière</h2>
        <div class="answers">
          <label for="subject-name">Nom de la matière : </label>
          <input 
            v-model="subjectForm.name" 
            type="text" 
            id="subject-name" 
            required 
            class="subject-name"
          >
        </div>
        <button type="submit" class="submit-subject" :disabled="isLoading">
          {{ isLoading ? 'Création...' : 'Créer la matière' }}
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
        this.notificationStore.showError('Erreur lors du chargement des matières')
      }
    },

    async handleSubjectSubmit() {
      const errorContainer = document.getElementById('error-container')
      const successContainer = document.getElementById('success-container')
      
      errorContainer.textContent = ''
      successContainer.textContent = ''

      const subjectName = this.subjectForm.name.trim()

      if (!subjectName) {
        errorContainer.textContent = 'Merci de remplir le nom du sujet !'
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
          
          successContainer.textContent = 'Matière créée avec succès !'
          this.subjectForm.name = ''
        } else {
          errorContainer.textContent = response.data.message || 'Erreur lors de la création'
        }
      } catch (error) {
        console.error('Erreur:', error)
        errorContainer.textContent = error.response?.data?.message || 'Impossible de contacter le serveur.'
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
        errorContainer.textContent = 'Merci de remplir le nom du chapitre et de choisir un sujet !'
        return
      }

      this.isLoading = true

      try {
        const response = await api.post('/api/chapters/create', {
          subjectId: subjectId,
          chapterName: chapterName
        })

        if (response.data.success) {
          successContainer.textContent = 'Chapitre créé avec succès !'
          this.chapterForm.name = ''
          this.chapterForm.subjectId = ''
        } else {
          errorContainer.textContent = response.data.message || 'Erreur lors de la création'
        }
      } catch (error) {
        console.error('Erreur:', error)
        errorContainer.textContent = error.response?.data?.message || 'Impossible de contacter le serveur.'
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
