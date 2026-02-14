<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-logo">
        <h1>Eureka<span>!</span></h1>
        <p>Learning that adapts to you</p>
      </div>

      <div class="auth-card">
        <h2>Create your account</h2>
        <p class="subtitle">Start your learning journey</p>

        <div v-if="error" class="form-error">{{ error }}</div>

        <!-- Google signup (primary) -->
        <button class="btn btn-google" @click="handleGoogle" :disabled="googleLoading">
          <svg v-if="!googleLoading" class="google-icon" viewBox="0 0 24 24" width="20" height="20">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span v-if="googleLoading" class="spinner spinner-dark"></span>
          {{ googleLoading ? 'Signing up...' : 'Sign up with Google' }}
        </button>

        <div class="divider">or sign up manually</div>

        <!-- Toggle for manual signup -->
        <div v-if="!showManual" class="manual-options">
          <button class="btn btn-outline" @click="showManual = true; form.signupMethod = 'email'">
            Sign up with email
          </button>
          <button class="btn-link-alt" @click="showManual = true; form.signupMethod = 'username'">
            I don't have an email — use a username
          </button>
        </div>

        <!-- Manual signup steps -->
        <template v-if="showManual">
          <div class="step-indicator">
            <div
              v-for="n in 3"
              :key="n"
              class="step-dot"
              :class="{ active: step === n, completed: step > n }"
            ></div>
          </div>

          <!-- Step 1: Name + identifier -->
          <template v-if="step === 1">
            <form @submit.prevent="nextStep">
              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">First name</label>
                  <input id="firstName" v-model="form.firstName" type="text" placeholder="First name" required :class="{ error: fieldErrors.firstName }" />
                  <p v-if="fieldErrors.firstName" class="field-error">{{ fieldErrors.firstName }}</p>
                </div>
                <div class="form-group">
                  <label for="lastName">Last name</label>
                  <input id="lastName" v-model="form.lastName" type="text" placeholder="Last name" required :class="{ error: fieldErrors.lastName }" />
                  <p v-if="fieldErrors.lastName" class="field-error">{{ fieldErrors.lastName }}</p>
                </div>
              </div>

              <div v-if="form.signupMethod === 'email'" class="form-group">
                <label for="email">Your email</label>
                <input id="email" v-model="form.email" type="email" placeholder="you@example.com" required :class="{ error: fieldErrors.email }" autocomplete="email" />
                <p class="field-hint">We'll send a verification link to this address</p>
                <p v-if="fieldErrors.email" class="field-error">{{ fieldErrors.email }}</p>
              </div>

              <div v-if="form.signupMethod === 'username'" class="form-group">
                <label for="username">Choose a username</label>
                <input id="username" v-model="form.username" type="text" placeholder="coollearner42" required :class="{ error: fieldErrors.username }" autocomplete="username" />
                <p class="field-hint">This is what you'll use to sign in</p>
                <p v-if="fieldErrors.username" class="field-error">{{ fieldErrors.username }}</p>
              </div>

              <button type="submit" class="btn btn-primary">Continue</button>
              <button type="button" class="btn-link-alt" @click="showManual = false; step = 1" style="margin-top: 0.75rem;">Back to sign up options</button>
            </form>
          </template>

          <!-- Step 2: Age, grade, parent email -->
          <template v-if="step === 2">
            <form @submit.prevent="nextStep">
              <div class="form-row">
                <div class="form-group">
                  <label for="age">Age</label>
                  <select id="age" v-model="form.age" required :class="{ error: fieldErrors.age }">
                    <option value="" disabled>Select age</option>
                    <option v-for="a in ages" :key="a" :value="String(a)">{{ a }}</option>
                  </select>
                  <p v-if="fieldErrors.age" class="field-error">{{ fieldErrors.age }}</p>
                </div>
                <div class="form-group">
                  <label for="grade">Grade</label>
                  <select id="grade" v-model="form.grade" required :class="{ error: fieldErrors.grade }">
                    <option value="" disabled>Select grade</option>
                    <option v-for="g in 12" :key="g" :value="String(g)">{{ g }}{{ gradeSuffix(g) }} grade</option>
                  </select>
                  <p v-if="fieldErrors.grade" class="field-error">{{ fieldErrors.grade }}</p>
                </div>
              </div>

              <div v-if="needsParentEmail" class="form-group">
                <label for="parentEmail">Parent or guardian email</label>
                <input id="parentEmail" v-model="form.parentEmail" type="email" placeholder="parent@example.com" required :class="{ error: fieldErrors.parentEmail }" />
                <p class="field-hint">Since you're under 13, a parent or guardian needs to confirm your account</p>
                <p v-if="fieldErrors.parentEmail" class="field-error">{{ fieldErrors.parentEmail }}</p>
              </div>

              <div v-if="!needsParentEmail && form.age" class="age-note">
                <span>✓</span> No parent approval needed for students 13 and older
              </div>

              <div class="form-actions">
                <button type="button" class="btn btn-outline" @click="step--" style="margin-bottom: 0.75rem;">Back</button>
                <button type="submit" class="btn btn-primary">Continue</button>
              </div>
            </form>
          </template>

          <!-- Step 3: Password -->
          <template v-if="step === 3">
            <form @submit.prevent="handleRegister">
              <div class="form-group">
                <label for="password">Password</label>
                <input id="password" v-model="form.password" type="password" placeholder="At least 8 characters" required :class="{ error: fieldErrors.password }" autocomplete="new-password" />
                <p v-if="fieldErrors.password" class="field-error">{{ fieldErrors.password }}</p>
                <div class="password-strength" v-if="form.password">
                  <div class="strength-bars">
                    <div v-for="n in 4" :key="n" class="strength-bar" :style="{ background: n <= passwordStrength ? strengthColor : '' }"></div>
                  </div>
                  <span class="strength-label" :style="{ color: strengthColor }">{{ strengthLabel }}</span>
                </div>
              </div>

              <div class="form-group">
                <label for="confirmPassword">Confirm password</label>
                <input id="confirmPassword" v-model="form.confirmPassword" type="password" placeholder="Type your password again" required :class="{ error: fieldErrors.confirmPassword }" autocomplete="new-password" />
                <p v-if="fieldErrors.confirmPassword" class="field-error">{{ fieldErrors.confirmPassword }}</p>
              </div>

              <div class="form-actions">
                <button type="button" class="btn btn-outline" @click="step--" style="margin-bottom: 0.75rem;">Back</button>
                <button type="submit" class="btn btn-primary" :disabled="submitting">
                  <span v-if="submitting" class="spinner"></span>
                  {{ submitting ? 'Creating account...' : 'Create account' }}
                </button>
              </div>
            </form>
          </template>
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
const { register, signInWithGoogle, error } = useAuth()

const step = ref(1)
const submitting = ref(false)
const googleLoading = ref(false)
const showManual = ref(false)
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

const ages = Array.from({ length: 14 }, (_, i) => i + 5)

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
  let s = 0
  if (p.length >= 8) s++
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++
  if (/\d/.test(p)) s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return s
})

const strengthColor = computed(() => ['', '#d92916', '#e8890c', '#d4a800', '#1b7e4f'][passwordStrength.value])
const strengthLabel = computed(() => ['', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength.value])

function clearFieldErrors() {
  Object.keys(fieldErrors).forEach((k) => delete fieldErrors[k])
}

function validateStep1(): boolean {
  clearFieldErrors()
  let valid = true
  if (!form.firstName.trim()) { fieldErrors.firstName = 'First name is required'; valid = false }
  if (!form.lastName.trim()) { fieldErrors.lastName = 'Last name is required'; valid = false }
  if (form.signupMethod === 'email') {
    if (!form.email.trim()) { fieldErrors.email = 'Email is required'; valid = false }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { fieldErrors.email = 'Please enter a valid email'; valid = false }
  } else {
    if (!form.username.trim()) { fieldErrors.username = 'Username is required'; valid = false }
    else if (form.username.length < 3) { fieldErrors.username = 'Username must be at least 3 characters'; valid = false }
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username)) { fieldErrors.username = 'Only letters, numbers, and underscores'; valid = false }
  }
  return valid
}

function validateStep2(): boolean {
  clearFieldErrors()
  let valid = true
  if (!form.age) { fieldErrors.age = 'Please select your age'; valid = false }
  if (!form.grade) { fieldErrors.grade = 'Please select your grade'; valid = false }
  if (needsParentEmail.value) {
    if (!form.parentEmail.trim()) { fieldErrors.parentEmail = 'Parent email is required'; valid = false }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.parentEmail)) { fieldErrors.parentEmail = 'Please enter a valid email'; valid = false }
    else if (form.signupMethod === 'email' && form.parentEmail.toLowerCase() === form.email.toLowerCase()) { fieldErrors.parentEmail = 'Parent email must be different from yours'; valid = false }
  }
  return valid
}

function validateStep3(): boolean {
  clearFieldErrors()
  let valid = true
  if (form.password.length < 8) { fieldErrors.password = 'Password must be at least 8 characters'; valid = false }
  if (form.password !== form.confirmPassword) { fieldErrors.confirmPassword = 'Passwords don\'t match'; valid = false }
  return valid
}

function nextStep() {
  if (step.value === 1 && validateStep1()) step.value = 2
  else if (step.value === 2 && validateStep2()) step.value = 3
}

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

async function handleRegister() {
  if (!validateStep3()) return
  submitting.value = true
  error.value = null
  const result = await register(form)
  submitting.value = false

  if (result.success) {
    if (result.usesUsername) {
      router.push('/dashboard')
    } else {
      router.push('/verify-email')
    }
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

.google-icon { flex-shrink: 0; }

.spinner-dark {
  border: 2px solid rgba(0, 0, 0, 0.15);
  border-top-color: var(--text-primary);
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

.manual-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.btn-link-alt {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.8125rem;
  font-family: var(--font-body);
  cursor: pointer;
  text-decoration: underline;
  text-align: center;
  padding: 0.25rem;
}

.btn-link-alt:hover {
  color: var(--text-secondary);
}

.form-actions { margin-top: 0.5rem; }

.age-note {
  background: var(--green-light);
  color: var(--green-primary);
  padding: 0.75rem 1rem;
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.age-note span { margin-right: 0.25rem; }

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
