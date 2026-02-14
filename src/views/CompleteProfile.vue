<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-logo">
        <h1>Eureka<span>!</span></h1>
      </div>

      <div class="auth-card">
        <h2>Almost there, {{ firstName }}!</h2>
        <p class="subtitle">Tell us a bit about yourself so we can personalize your experience</p>

        <div v-if="error" class="form-error">{{ error }}</div>

        <form @submit.prevent="handleSubmit">
          <div class="form-row">
            <div class="form-group">
              <label for="age">Age</label>
              <select id="age" v-model="age" required :class="{ error: fieldErrors.age }">
                <option value="" disabled>Select age</option>
                <option v-for="a in ages" :key="a" :value="a">{{ a }}</option>
              </select>
              <p v-if="fieldErrors.age" class="field-error">{{ fieldErrors.age }}</p>
            </div>
            <div class="form-group">
              <label for="grade">Grade</label>
              <select id="grade" v-model="grade" required :class="{ error: fieldErrors.grade }">
                <option value="" disabled>Select grade</option>
                <option v-for="g in 12" :key="g" :value="g">{{ g }}{{ gradeSuffix(g) }} grade</option>
              </select>
              <p v-if="fieldErrors.grade" class="field-error">{{ fieldErrors.grade }}</p>
            </div>
          </div>

          <div v-if="needsParent" class="form-group">
            <label for="parentEmail">Parent or guardian email</label>
            <input
              id="parentEmail"
              v-model="parentEmail"
              type="email"
              placeholder="parent@example.com"
              required
              :class="{ error: fieldErrors.parentEmail }"
            />
            <p class="field-hint">Since you're under 13, a parent or guardian needs to confirm your account</p>
            <p v-if="fieldErrors.parentEmail" class="field-error">{{ fieldErrors.parentEmail }}</p>
          </div>

          <div v-if="!needsParent && age" class="age-note">
            <span>✓</span> No parent approval needed for students 13 and older
          </div>

          <button type="submit" class="btn btn-primary" :disabled="submitting">
            <span v-if="submitting" class="spinner"></span>
            {{ submitting ? 'Saving...' : 'Start learning' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { currentUser, completeGoogleProfile, error } = useAuth()

const firstName = computed(() => currentUser.value?.displayName?.split(' ')[0] || 'there')

const age = ref<number | ''>('')
const grade = ref<number | ''>('')
const parentEmail = ref('')
const submitting = ref(false)
const fieldErrors = reactive<Record<string, string>>({})
const ages = Array.from({ length: 14 }, (_, i) => i + 5)

const needsParent = computed(() => typeof age.value === 'number' && age.value < 13)

function gradeSuffix(n: number): string {
  if (n === 1) return 'st'
  if (n === 2) return 'nd'
  if (n === 3) return 'rd'
  return 'th'
}

function validate(): boolean {
  Object.keys(fieldErrors).forEach((k) => delete fieldErrors[k])
  let valid = true
  if (!age.value) { fieldErrors.age = 'Please select your age'; valid = false }
  if (!grade.value) { fieldErrors.grade = 'Please select your grade'; valid = false }
  if (needsParent.value) {
    if (!parentEmail.value.trim()) { fieldErrors.parentEmail = 'Parent email is required'; valid = false }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail.value)) { fieldErrors.parentEmail = 'Please enter a valid email'; valid = false }
    else if (parentEmail.value.toLowerCase() === currentUser.value?.email?.toLowerCase()) { fieldErrors.parentEmail = 'Parent email must be different from yours'; valid = false }
  }
  return valid
}

async function handleSubmit() {
  if (!validate()) return
  submitting.value = true
  const result = await completeGoogleProfile(
    age.value as number,
    grade.value as number,
    needsParent.value ? parentEmail.value : null,
  )
  submitting.value = false

  if (result.success) {
    router.push('/dashboard')
  }
}
</script>

<style scoped>
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
</style>
