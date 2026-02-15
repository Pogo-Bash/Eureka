import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import VerifyEmail from '../views/VerifyEmail.vue'
import CompleteProfile from '../views/CompleteProfile.vue'
import GradeSelect from '../views/GradeSelect.vue'
import CourseSelect from '../views/CourseSelect.vue'
import TopicSelect from '../views/TopicSelect.vue'
import Analytics from '../views/Analytics.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/learn' },
    { path: '/login', name: 'Login', component: Login, meta: { guest: true } },
    { path: '/register', name: 'Register', component: Register, meta: { guest: true } },
    { path: '/verify-email', name: 'VerifyEmail', component: VerifyEmail, meta: { requiresAuth: true } },
    { path: '/complete-profile', name: 'CompleteProfile', component: CompleteProfile, meta: { requiresAuth: true } },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/learn', name: 'GradeSelect', component: GradeSelect, meta: { requiresAuth: true } },
    { path: '/learn/:grade', name: 'CourseSelect', component: CourseSelect, meta: { requiresAuth: true } },
    { path: '/learn/:grade/:courseId', name: 'TopicSelect', component: TopicSelect, meta: { requiresAuth: true } },
    { path: '/analytics', name: 'Analytics', component: Analytics, meta: { requiresAuth: true } },
    { path: '/learn/:grade/:courseId/:topicId', name: 'Practice', component: () => import('../views/Practice.vue'), meta: { requiresAuth: true } },
  ],
})

function getCurrentUser(): Promise<any> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

router.beforeEach(async (to) => {
  const user = await getCurrentUser()

  if (to.meta.requiresAuth && !user) {
    return { name: 'Login' }
  }

  if (to.meta.guest && user) {
    const docSnap = await getDoc(doc(db, 'students', user.uid))
    if (!docSnap.exists()) {
      return { name: 'CompleteProfile' }
    }
    if (!user.emailVerified && docSnap.data()?.email) {
      return { name: 'VerifyEmail' }
    }
    return { name: 'GradeSelect' }
  }
})

export default router
