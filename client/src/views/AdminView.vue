<template>
  <div>
    <Header />

    <main>
      <div class="div-header">
        <h2>{{ $t('admin.title') }}</h2>
        
        <!-- Tabs pour switcher entre QCM et Utilisateurs -->
        <div class="tabs">
          <button 
            :class="{ active: activeTab === 'qcm' }" 
            @click="activeTab = 'qcm'"
          >
            {{ $t('admin.qcmManagement') }}
          </button>
          <button 
            :class="{ active: activeTab === 'users' }" 
            @click="activeTab = 'users'"
          >
            {{ $t('admin.userManagement') }}
          </button>
        </div>
      </div>

      <!-- Section Gestion des QCM -->
      <div v-if="activeTab === 'qcm'">
        <div class="div-header">
          <h3>{{ $t('admin.qcmList') }}</h3>
          
          <div style="margin-top: 20px;">
            <label for="subject-select">{{ $t('qcm.subject') }}</label>
            <select 
              id="subject-select" 
              v-model="selectedSubjectId" 
              @change="onSubjectChange"
            >
              <option :value="null">{{ $t('qcm.chooseSubject') }}</option>
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
            <label for="chapter-select">{{ $t('qcm.chapter') }}</label>
            <select 
              id="chapter-select" 
              v-model="selectedChapterId" 
              @change="onChapterChange"
              :disabled="!selectedSubjectId"
            >
              <option :value="null">{{ $t('qcm.chooseChapter') }}</option>
              <option 
                v-for="chapter in filteredChapters" 
                :key="chapter.id" 
                :value="chapter.id"
              >
                {{ chapter.name }}
              </option>
            </select>
          </div>

          <div style="margin-top: 15px;">
            <label for="difficulty-select">{{ $t('qcm.difficulty') }}</label>
            <select 
              id="difficulty-select" 
              v-model="selectedDifficulty"
            >
              <option :value="null">{{ $t('qcm.allDifficulties') }}</option>
              <option :value="0">{{ $t('qcm.easy') }}</option>
              <option :value="1">{{ $t('qcm.medium') }}</option>
              <option :value="2">{{ $t('qcm.hard') }}</option>
            </select>
          </div>
        </div>

        <!-- Liste des QCM -->
        <div v-if="filteredQcms.length > 0">
          <div 
            v-for="qcm in filteredQcms" 
            :key="qcm.id" 
            class="div-body"
          >
            <h3>{{ qcm.name }}</h3>
            <p>
              {{ $t('qcm.difficulty') }} 
              <span v-if="qcm.difficulty === 0">{{ $t('qcm.easy') }}</span>
              <span v-else-if="qcm.difficulty === 1">{{ $t('qcm.medium') }}</span>
              <span v-else>{{ $t('qcm.hard') }}</span>
            </p>
            
            <div style="margin-top: 10px;">
              <button 
                @click="confirmDeleteQcm(qcm)"
                style="background: linear-gradient(50deg, #d64237, #a04945);"
              >
                {{ $t('admin.deleteQcm') }}
              </button>
            </div>
          </div>
        </div>

        <div v-else-if="selectedChapterId" class="div-body">
          <p>{{ $t('qcm.noQcmAvailable') }}</p>
        </div>

        <div v-else class="div-body">
          <p>{{ $t('qcm.selectSubjectChapter') }}</p>
        </div>
      </div>

      <!-- Section Gestion des Utilisateurs -->
      <div v-if="activeTab === 'users'">
        <div class="div-header">
          <h3>{{ $t('admin.userList') }}</h3>
          
          <div style="margin-top: 15px;">
            <label for="role-select">{{ $t('admin.filterByRole') }}</label>
            <select 
              id="role-select" 
              v-model="selectedRole"
            >
              <option :value="null">{{ $t('admin.allRoles') }}</option>
              <option value="admin">{{ $t('admin.administrator') }}</option>
              <option value="teacher">{{ $t('admin.teacher') }}</option>
              <option value="student">{{ $t('admin.student') }}</option>
            </select>
          </div>
        </div>

        <div v-if="filteredUsers.length > 0">
          <div 
            v-for="user in filteredUsers" 
            :key="user.id" 
            class="div-body user-card"
          >
            <div class="user-info">
              <h3>{{ user.nickname }}</h3>
              <p>{{ user.email }}</p>
              <p>
                <span class="badge" :class="{ teacher: user.teacher, admin: user.admin }">
                  <span v-if="user.admin">{{ $t('admin.administrator') }}</span>
                  <span v-else-if="user.teacher">{{ $t('admin.teacher') }}</span>
                  <span v-else>{{ $t('admin.student') }}</span>
                </span>
              </p>
            </div>
            
            <div class="user-actions">
              <button 
                v-if="!user.admin"
                @click="toggleTeacherStatus(user)"
                :disabled="updatingUser === user.id"
              >
                {{ user.teacher ? $t('admin.removeTeacher') : $t('admin.makeTeacher') }}
              </button>
            </div>
          </div>
        </div>

        <div v-else class="div-body">
          <p>{{ $t('admin.loadingUsers') }}</p>
        </div>
      </div>
    </main>

    <!-- Modal de confirmation de suppression -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content" @click.stop>
        <h3>{{ $t('admin.confirmDelete') }}</h3>
        <p>{{ $t('admin.confirmDeleteMessage', { name: qcmToDelete?.name }) }}</p>
        <div class="modal-actions">
          <button @click="showDeleteModal = false">{{ $t('admin.cancel') }}</button>
          <button 
            @click="deleteQcm" 
            style="background: linear-gradient(50deg, #d64237, #a04945);"
            :disabled="deleting"
          >
            {{ deleting ? $t('admin.deleting') : $t('admin.confirmDeleteButton') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import api from '@/services/api';
import { useNotificationStore } from '@/stores/notification';

export default {
  name: 'AdminView',
  components: {
    Header
  },
  data() {
    return {
      activeTab: 'qcm',
      subjects: [],
      chapters: [],
      qcms: [],
      users: [],
      selectedSubjectId: null,
      selectedChapterId: null,
      selectedDifficulty: null,
      selectedRole: null,
      loading: false,
      showDeleteModal: false,
      qcmToDelete: null,
      deleting: false,
      updatingUser: null
    };
  },
  computed: {
    filteredChapters() {
      if (!this.selectedSubjectId) {
        return [];
      }
      return this.chapters.filter(
        chapter => chapter.subjectId === this.selectedSubjectId
      );
    },
    filteredQcms() {
      if (this.selectedDifficulty === null) {
        return this.qcms;
      }
      return this.qcms.filter(qcm => qcm.difficulty === this.selectedDifficulty);
    },
    sortedUsers() {
      // Trier les utilisateurs : Admin > Professeur > Étudiant
      return [...this.users].sort((a, b) => {
        // Admin = 3, Teacher = 2, Student = 1
        const getRolePriority = (user) => {
          if (user.admin) return 3;
          if (user.teacher) return 2;
          return 1;
        };
        
        const priorityA = getRolePriority(a);
        const priorityB = getRolePriority(b);
        
        // Tri décroissant (Admin en premier)
        if (priorityA !== priorityB) {
          return priorityB - priorityA;
        }
        
        // Si même rôle, trier par nom
        return a.nickname.localeCompare(b.nickname);
      });
    },
    filteredUsers() {
      if (this.selectedRole === null) {
        return this.sortedUsers;
      }
      
      return this.sortedUsers.filter(user => {
        if (this.selectedRole === 'admin') return user.admin;
        if (this.selectedRole === 'teacher') return user.teacher && !user.admin;
        if (this.selectedRole === 'student') return !user.teacher && !user.admin;
        return true;
      });
    }
  },
  async mounted() {
    await this.loadSubjects();
    await this.loadChapters();
    await this.loadUsers();
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

    async loadUsers() {
      try {
        const response = await api.get('/api/admin/users');
        this.users = response.data.users;
      } catch (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        const notificationStore = useNotificationStore();
        notificationStore.showError(this.$t('admin.errorLoadingUsers'));
      }
    },

    async onSubjectChange() {
      this.selectedChapterId = null;
      this.qcms = [];
    },

    async onChapterChange() {
      if (!this.selectedChapterId) {
        this.qcms = [];
        return;
      }
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
        notificationStore.showError(this.$t('subjects.errorLoadingSubjects'));
      } finally {
        this.loading = false;
      }
    },

    confirmDeleteQcm(qcm) {
      this.qcmToDelete = qcm;
      this.showDeleteModal = true;
    },

    async deleteQcm() {
      if (!this.qcmToDelete) return;

      this.deleting = true;
      const notificationStore = useNotificationStore();

      try {
        const response = await api.delete(`/api/qcm/${this.qcmToDelete.id}`);
        
        if (response.data.success) {
          notificationStore.showSuccess(this.$t('admin.qcmDeletedSuccess'));
          // Retirer le QCM de la liste
          this.qcms = this.qcms.filter(q => q.id !== this.qcmToDelete.id);
          this.showDeleteModal = false;
          this.qcmToDelete = null;
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        notificationStore.showError(
          error.response?.data?.message || this.$t('admin.errorDeletingQcm')
        );
      } finally {
        this.deleting = false;
      }
    },

    async toggleTeacherStatus(user) {
      this.updatingUser = user.id;
      const notificationStore = useNotificationStore();

      try {
        const response = await api.patch(`/api/admin/users/${user.id}/teacher`, {
          teacher: !user.teacher
        });

        if (response.data.success) {
          // Mettre à jour localement
          user.teacher = !user.teacher;
          notificationStore.showSuccess(
            user.teacher 
              ? this.$t('admin.teacherStatusGranted') 
              : this.$t('admin.teacherStatusRevoked')
          );
        }
      } catch (error) {
        console.error('Erreur lors de la modification:', error);
        notificationStore.showError(
          error.response?.data?.message || this.$t('admin.errorUpdatingUser')
        );
      } finally {
        this.updatingUser = null;
      }
    }
  }
};
</script>

<style scoped>
@import '../assets/select-qcm.css';

.tabs {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.tabs button {
  padding: 10px 20px;
  border: 2px solid #d64237;
  background: transparent;
  color: #d64237;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
}

.tabs button.active {
  background: linear-gradient(50deg, #db7850, #d64237);
  color: white;
}

.tabs button:hover:not(.active) {
  background: rgba(214, 66, 55, 0.1);
}

.user-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info h3 {
  margin: 0 0 5px 0;
}

.user-info p {
  margin: 5px 0;
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: bold;
}

.badge.admin {
  background: linear-gradient(50deg, #491acc, #3f98c2);
  color: white;
}

.badge.teacher {
  background: linear-gradient(50deg, #db7850, #d64237);
  color: white;
}

.badge:not(.admin):not(.teacher) {
  background: #e0e0e0;
  color: #666;
}

.user-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  background: linear-gradient(50deg, #db7850, #d64237);
  color: white;
  transition: all 0.3s ease;
}

.user-actions button:hover:not(:disabled) {
  transform: scale(1.05);
}

.user-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-content h3 {
  margin-top: 0;
  color: #d64237;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.modal-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.modal-actions button:first-child {
  background: #e0e0e0;
  color: #666;
}

.modal-actions button:first-child:hover {
  background: #d0d0d0;
}

.modal-actions button:last-child:hover:not(:disabled) {
  transform: scale(1.05);
}

.modal-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
