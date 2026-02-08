import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Dashboard from '../views/Dashboard.vue'
import VerifyEmail from '../views/VerifyEmail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: { guest: true },
    },
    {
      path: '/verify-email',
      name: 'VerifyEmail',
      component: VerifyEmail,
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
    },
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
    if (!user.emailVerified) {
      return { name: 'VerifyEmail' }
    }
    return { name: 'Dashboard' }
  }
})

export default router
