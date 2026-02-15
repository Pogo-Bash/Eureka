<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-logo">
        <h1>Eureka<span>!</span></h1>
        <p>Learning that adapts to you</p>
      </div>

      <div class="auth-card">
        <h2>Welcome back</h2>
        <p class="subtitle">Sign in to continue learning</p>

        <div v-if="error" class="form-error">{{ error }}</div>

        <button class="btn btn-google" @click="handleGoogle" :disabled="googleLoading">
          <svg v-if="!googleLoading" class="google-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span v-if="googleLoading" class="spinner spinner-dark"></span>
          {{ googleLoading ? 'Signing in...' : 'Continue with Google' }}
        </button>

        <div class="divider">or</div>

        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="identifier">Email or username</label>
            <input
              id="identifier"
              v-model="form.identifier"
              type="text"
              placeholder="you@example.com or your username"
              required
              autocomplete="username"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="Your password"
              required
              autocomplete="current-password"
            />
          </div>

          <button type="submit" class="btn btn-primary" :disabled="submitting">
            <span v-if="submitting" class="spinner"></span>
            {{ submitting ? 'Signing in...' : 'Sign in' }}
          </button>
        </form>
      </div>

      <p class="auth-footer">
        Don't have an account? <router-link to="/register">Sign up</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import type { LoginForm } from '../types'

const router = useRouter()
const { login, signInWithGoogle, error } = useAuth()

const submitting = ref(false)
const googleLoading = ref(false)
const form = reactive<LoginForm>({
  identifier: '',
  password: '',
})

async function handleGoogle() {
  googleLoading.value = true
  const result = await signInWithGoogle()
  googleLoading.value = false

  if (result.success) {
    if (result.needsProfile) {
      router.push('/complete-profile')
    } else {
      router.push('/dashboard')
    }
  }
}

async function handleLogin() {
  submitting.value = true
  const result = await login(form.identifier, form.password)
  submitting.value = false

  if (result.success) {
    router.push('/dashboard')
  }
}
</script>

<style scoped>
.btn-google {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.625rem;
  width: 100%;
  padding: 0.75rem 1.5rem;
  font-family: var(--font-display);
  font-size: 0.938rem;
  font-weight: 700;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-card);
  color: var(--text-primary);
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.btn-google:hover:not(:disabled) {
  background: var(--bg-input);
  border-color: #bbb;
}

.btn-google:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.google-icon {
  flex-shrink: 0;
}

.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.25rem 0;
  color: var(--text-muted);
  font-size: 0.8125rem;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

.spinner-dark {
  border: 2px solid rgba(0, 0, 0, 0.15);
  border-top-color: var(--text-primary);
}
</style>
