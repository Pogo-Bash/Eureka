<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-logo">
        <h1>Eureka<span>!</span></h1>
      </div>

      <div class="auth-card verify-card">
        <div class="verify-icon">✉️</div>
        <h2>Check your email</h2>
        <p class="subtitle">
          We sent a verification link to <strong>{{ userProfile?.email || currentUser?.email }}</strong>.
          Click the link to verify your account.
        </p>

        <div v-if="userProfile?.requiresParentApproval" class="verify-info">
          <p>A confirmation email was also sent to your parent or guardian at <strong>{{ userProfile?.parentEmail }}</strong>. They'll need to approve your account before you can start learning.</p>
        </div>

        <button class="btn btn-primary" @click="checkVerification" :disabled="checking">
          <span v-if="checking" class="spinner"></span>
          {{ checking ? 'Checking...' : 'I\'ve verified my email' }}
        </button>

        <div class="resend-section">
          <p>Didn't get the email?</p>
          <button
            class="btn btn-outline"
            @click="handleResend"
            :disabled="resendCooldown > 0"
          >
            {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend verification email' }}
          </button>
        </div>

        <button class="btn-link" @click="handleLogout">Sign out and use a different account</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { currentUser, userProfile, resendVerification, logout } = useAuth()

const checking = ref(false)
const resendCooldown = ref(0)
let cooldownTimer: ReturnType<typeof setInterval> | null = null

async function checkVerification() {
  checking.value = true
  try {
    await currentUser.value?.reload()
    if (currentUser.value?.emailVerified) {
      router.push('/dashboard')
    } else {
      alert('Email not verified yet. Please check your inbox and click the verification link.')
    }
  } catch {
    alert('Could not check verification status. Please try again.')
  }
  checking.value = false
}

async function handleResend() {
  await resendVerification()
  resendCooldown.value = 60
  cooldownTimer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0 && cooldownTimer) {
      clearInterval(cooldownTimer)
      cooldownTimer = null
    }
  }, 1000)
}

async function handleLogout() {
  await logout()
  router.push('/login')
}

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})
</script>

<style scoped>
.verify-card {
  text-align: center;
}

.verify-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.verify-card h2 {
  margin-bottom: 0.5rem;
}

.verify-card .subtitle {
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.verify-info {
  background: var(--gold-light);
  border-radius: var(--radius);
  padding: 0.875rem 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
  text-align: left;
}

.resend-section {
  margin-top: 1.25rem;
}

.resend-section p {
  font-size: 0.8125rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.btn-link {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.8125rem;
  cursor: pointer;
  margin-top: 1rem;
  font-family: var(--font-body);
  text-decoration: underline;
}

.btn-link:hover {
  color: var(--text-secondary);
}
</style>
