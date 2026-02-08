<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-logo">
        <h1>Eureka<span>!</span></h1>
        <p>Learning that adapts to you</p>
      </div>

      <div class="auth-card">
        <div class="step-indicator">
          <div
            v-for="n in 3"
            :key="n"
            class="step-dot"
            :class="{
              active: step === n,
              completed: step > n,
            }"
          ></div>
        </div>

        <!-- Step 1: Name + signup method -->
        <template v-if="step === 1">
          <h2>Create your account</h2>
          <p class="subtitle">Let's start with the basics</p>

          <div v-if="error" class="form-error">{{ error }}</div>

          <form @submit.prevent="nextStep">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First name</label>
                <input
                  id="firstName"
                  v-model="form.firstName"
                  type="text"
                  placeholder="First name"
                  required
                  :class="{ error: fieldErrors.firstName }"
                />
                <p v-if="fieldErrors.firstName" class="field-error">{{ fieldErrors.firstName }}</p>
              </div>
              <div class="form-group">
                <label for="lastName">Last name</label>
                <input
                  id="lastName"
                  v-model="form.lastName"
                  type="text"
                  placeholder="Last name"
                  required
                  :class="{ error: fieldErrors.lastName }"
                />
                <p v-if="fieldErrors.lastName" class="field-error">{{ fieldErrors.lastName }}</p>
              </div>
            </div>

            <div class="form-group">
              <label>How do you want to sign in?</label>
              <div class="method-toggle">
                <button
                  type="button"
                  class="method-btn"
                  :class="{ active: form.signupMethod === 'email' }"
                  @click="form.signupMethod = 'email'"
                >
                  Email
                </button>
                <button
                  type="button"
                  class="method-btn"
                  :class="{ active: form.signupMethod === 'username' }"
                  @click="form.signupMethod = 'username'"
                >
                  Username
                </button>
              </div>
            </div>

            <div v-if="form.signupMethod === 'email'" class="form-group">
              <label for="email">Your email</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="you@example.com"
                required
                :class="{ error: fieldErrors.email }"
                autocomplete="email"
              />
              <p class="field-hint">We'll send a verification link to this address</p>
              <p v-if="fieldErrors.email" class="field-error">{{ fieldErrors.email }}</p>
            </div>

            <div v-if="form.signupMethod === 'username'" class="form-group">
              <label for="username">Choose a username</label>
              <input
                id="username"
                v-model="form.username"
                type="text"
                placeholder="coollearner42"
                required
                :class="{ error: fieldErrors.username }"
                autocomplete="username"
              />
              <p class="field-hint">This is what you'll use to sign in</p>
              <p v-if="fieldErrors.username" class="field-error">{{ fieldErrors.username }}</p>
            </div>

            <button type="submit" class="btn btn-primary">Continue</button>
          </form>
        </template>

        <!-- Step 2: Age, grade, parent email if needed -->
        <template v-if="step === 2">
          <h2>Tell us about yourself</h2>
          <p class="subtitle">This helps us personalize your experience</p>

          <form @submit.prevent="nextStep">
            <div class="form-row">
              <div class="form-group">
                <label for="age">Age</label>
                <select
                  id="age"
                  v-model="form.age"
                  required
                  :class="{ error: fieldErrors.age }"
                >
                  <option value="" disabled>Select age</option>
                  <option v-for="a in ages" :key="a" :value="String(a)">{{ a }}</option>
                </select>
                <p v-if="fieldErrors.age" class="field-error">{{ fieldErrors.age }}</p>
              </div>
              <div class="form-group">
                <label for="grade">Grade</label>
                <select
                  id="grade"
                  v-model="form.grade"
                  required
                  :class="{ error: fieldErrors.grade }"
                >
                  <option value="" disabled>Select grade</option>
                  <option v-for="g in 12" :key="g" :value="String(g)">
                    {{ g }}{{ gradeSuffix(g) }} grade
                  </option>
                </select>
                <p v-if="fieldErrors.grade" class="field-error">{{ fieldErrors.grade }}</p>
              </div>
            </div>

            <div v-if="needsParentEmail" class="form-group">
              <label for="parentEmail">Parent or guardian email</label>
              <input
                id="parentEmail"
                v-model="form.parentEmail"
                type="email"
                placeholder="parent@example.com"
                required
                :class="{ error: fieldErrors.parentEmail }"
              />
              <p class="field-hint">Since you're under 13, a parent or guardian needs to confirm your account</p>
              <p v-if="fieldErrors.parentEmail" class="field-error">{{ fieldErrors.parentEmail }}</p>
            </div>

            <div v-if="!needsParentEmail && form.age" class="age-note">
              <span>✓</span> No parent approval needed for students 13 and older
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-outline" @click="step--" style="margin-bottom: 0.75rem;">
                Back
              </button>
              <button type="submit" class="btn btn-primary">Continue</button>
            </div>
          </form>
        </template>

        <!-- Step 3: Password -->
        <template v-if="step === 3">
          <h2>Secure your account</h2>
          <p class="subtitle">Choose a strong password</p>

          <div v-if="error" class="form-error">{{ error }}</div>

          <form @submit.prevent="handleRegister">
            <div class="form-group">
              <label for="password">Password</label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="At least 8 characters"
                required
                :class="{ error: fieldErrors.password }"
                autocomplete="new-password"
              />
              <p v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</p>

              <div class="password-strength" v-if="form.password">
                <div class="strength-bars">
                  <div
                    v-for="n in 4"
                    :key="n"
                    class="strength-bar"
                    :class="{ filled: passwordStrength >= n }"
                    :style="{ background: n <= passwordStrength ? strengthColor : '' }"
                  ></div>
                </div>
                <span class="strength-label" :style="{ color: strengthColor }">{{ strengthLabel }}</span>
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                v-model="form.confirmPassword"
                type="password"
                placeholder="Type your password again"
                required
                :class="{ error: fieldErrors.confirmPassword }"
                autocomplete="new-password"
              />
              <p v-if="fieldErrors.confirmPassword" class="field-error">{{ fieldErrors.confirmPassword }}</p>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-outline" @click="step--" style="margin-bottom: 0.75rem;">
                Back
              </button>
              <button type="submit" class="btn btn-primary" :disabled="submitting">
                <span v-if="submitting" class="spinner"></span>
                {{ submitting ? 'Creating account...' : 'Create account' }}
              </button>
            </div>
          </form>
        </template>
      </div>

      <p class="auth-footer">
        Already have an account? <router-link to="/login">Sign in</router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import type { RegistrationForm } from '../types'

const router = useRouter()
const { register, error } = useAuth()

const step = ref(1)
const submitting = ref(false)
const fieldErrors = reactive<Record<string, string>>({})

const form = reactive<RegistrationForm>({
  firstName: '',
  lastName: '',
  signupMethod: 'email',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  age: '',
  grade: '',
  parentEmail: '',
})

const ages = Array.from({ length: 14 }, (_, i) => i + 5) // 5 to 18

const needsParentEmail = computed(() => {
  const age = parseInt(form.age)
  return !isNaN(age) && age < 13
})

function gradeSuffix(n: number): string {
  if (n === 1) return 'st'
  if (n === 2) return 'nd'
  if (n === 3) return 'rd'
  return 'th'
}

const passwordStrength = computed(() => {
  const p = form.password
  if (!p) return 0
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++
  if (/\d/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  return score
})

const strengthColor = computed(() => {
  const colors = ['', '#d92916', '#e8890c', '#d4a800', '#1b7e4f']
  return colors[passwordStrength.value]
})

const strengthLabel = computed(() => {
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']
  return labels[passwordStrength.value]
})

function clearFieldErrors() {
  Object.keys(fieldErrors).forEach((k) => delete fieldErrors[k])
}

function validateStep1(): boolean {
  clearFieldErrors()
  let valid = true

  if (!form.firstName.trim()) {
    fieldErrors.firstName = 'First name is required'
    valid = false
  }
  if (!form.lastName.trim()) {
    fieldErrors.lastName = 'Last name is required'
    valid = false
  }

  if (form.signupMethod === 'email') {
    if (!form.email.trim()) {
      fieldErrors.email = 'Email is required'
      valid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      fieldErrors.email = 'Please enter a valid email'
      valid = false
    }
  } else {
    if (!form.username.trim()) {
      fieldErrors.username = 'Username is required'
      valid = false
    } else if (form.username.length < 3) {
      fieldErrors.username = 'Username must be at least 3 characters'
      valid = false
    } else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) {
      fieldErrors.username = 'Only letters, numbers, and underscores'
      valid = false
    }
  }

  return valid
}

function validateStep2(): boolean {
  clearFieldErrors()
  let valid = true

  if (!form.age) {
    fieldErrors.age = 'Please select your age'
    valid = false
  }
  if (!form.grade) {
    fieldErrors.grade = 'Please select your grade'
    valid = false
  }

  if (needsParentEmail.value) {
    if (!form.parentEmail.trim()) {
      fieldErrors.parentEmail = 'Parent email is required'
      valid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.parentEmail)) {
      fieldErrors.parentEmail = 'Please enter a valid email'
      valid = false
    } else if (
      form.signupMethod === 'email' &&
      form.parentEmail.toLowerCase() === form.email.toLowerCase()
    ) {
      fieldErrors.parentEmail = 'Parent email must be different from yours'
      valid = false
    }
  }

  return valid
}

function validateStep3(): boolean {
  clearFieldErrors()
  let valid = true

  if (form.password.length < 8) {
    fieldErrors.password = 'Password must be at least 8 characters'
    valid = false
  }
  if (form.password !== form.confirmPassword) {
    fieldErrors.confirmPassword = 'Passwords don\'t match'
    valid = false
  }

  return valid
}

function nextStep() {
  if (step.value === 1 && validateStep1()) {
    step.value = 2
  } else if (step.value === 2 && validateStep2()) {
    step.value = 3
  }
}

async function handleRegister() {
  if (!validateStep3()) return

  submitting.value = true
  error.value = null
  const result = await register(form)
  submitting.value = false

  if (result.success) {
    if (result.usesUsername) {
      // Username users go straight to dashboard (no email to verify)
      router.push('/dashboard')
    } else {
      // Email users need to verify
      router.push('/verify-email')
    }
  }
}
</script>

<style scoped>
.form-actions {
  margin-top: 0.5rem;
}

.method-toggle {
  display: flex;
  gap: 0;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.method-btn {
  flex: 1;
  padding: 0.625rem;
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  background: var(--bg-input);
  color: var(--text-muted);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.method-btn.active {
  background: var(--green-primary);
  color: white;
}

.method-btn:first-child {
  border-right: 1px solid var(--border);
}

.age-note {
  background: var(--green-light);
  color: var(--green-primary);
  padding: 0.75rem 1rem;
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.age-note span {
  margin-right: 0.25rem;
}

.password-strength {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-top: 0.5rem;
}

.strength-bars {
  display: flex;
  gap: 4px;
  flex: 1;
}

.strength-bar {
  height: 4px;
  flex: 1;
  border-radius: 2px;
  background: var(--border);
  transition: background 0.2s ease;
}

.strength-label {
  font-size: 0.75rem;
  font-weight: 600;
  font-family: var(--font-display);
  min-width: 3rem;
}
</style>
