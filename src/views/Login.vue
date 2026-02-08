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
const { login, error } = useAuth()

const submitting = ref(false)
const form = reactive<LoginForm>({
  identifier: '',
  password: '',
})

async function handleLogin() {
  submitting.value = true
  const result = await login(form.identifier, form.password)
  submitting.value = false

  if (result.success) {
    router.push('/dashboard')
  }
}
</script>
