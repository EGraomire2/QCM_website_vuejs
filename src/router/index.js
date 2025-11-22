import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import HomeView from '@/views/HomeView.vue'
import LessonsView from '@/views/LessonsView.vue'
import SelectQcmView from '@/views/SelectQcmView.vue'
import AnswerQcmView from '@/views/AnswerQcmView.vue'
import CreateQcmView from '@/views/CreateQcmView.vue'
import CorrectionView from '@/views/CorrectionView.vue'

const routes = [
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/home', component: HomeView },
  { path: '/lessons', component: LessonsView },
  { path: '/select-qcm', component: SelectQcmView },
  { path: '/answer-qcm', component: AnswerQcmView },
  { path: '/create-qcm', component: CreateQcmView },
  { path: '/correction', component: CorrectionView },
]

export default {
  routes
}