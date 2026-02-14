<template>
  <div class="dashboard">
    <header class="dash-header">
      <div class="dash-header-inner">
        <h1 class="dash-logo" @click="$router.push('/learn')">Eureka<span>!</span></h1>
        <div class="dash-user">
          <img v-if="currentUser?.photoURL" :src="currentUser.photoURL" class="dash-avatar" alt="" />
          <span class="dash-greeting">{{ userProfile?.firstName }}</span>
          <button class="btn-sign-out" @click="handleLogout">Sign out</button>
        </div>
      </div>
    </header>

    <main class="dash-main">
      <div class="welcome-banner">
        <div class="welcome-text">
          <h2>Welcome back, {{ userProfile?.firstName }}!</h2>
          <p>Ready to keep learning?</p>
        </div>
        <button class="btn btn-primary" @click="$router.push('/learn')">Start practicing →</button>
      </div>

      <div class="info-cards">
        <div class="info-card">
          <div class="info-card-icon">📚</div>
          <h3>Your Profile</h3>
          <div class="info-items">
            <div class="info-item">
              <span class="info-label">Name</span>
              <span class="info-value">{{ userProfile?.firstName }} {{ userProfile?.lastName }}</span>
            </div>
            <div v-if="userProfile?.username" class="info-item">
              <span class="info-label">Username</span>
              <span class="info-value">{{ userProfile.username }}</span>
            </div>
            <div v-if="userProfile?.email" class="info-item">
              <span class="info-label">Email</span>
              <span class="info-value">{{ userProfile.email }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Grade</span>
              <span class="info-value">{{ userProfile?.grade }}{{ gradeSuffix(userProfile?.grade || 0) }}</span>
            </div>
          </div>
        </div>

        <div class="info-card">
          <div class="info-card-icon">✅</div>
          <h3>Account Status</h3>
          <div class="info-items">
            <div v-if="userProfile?.email" class="info-item">
              <span class="info-label">Email</span>
              <span class="info-value status" :class="currentUser?.emailVerified ? 'verified' : 'pending'">
                {{ currentUser?.emailVerified ? 'Verified' : 'Pending' }}
              </span>
            </div>
            <div v-if="userProfile?.requiresParentApproval" class="info-item">
              <span class="info-label">Parent approval</span>
              <span class="info-value status" :class="userProfile?.parentConfirmed ? 'verified' : 'pending'">
                {{ userProfile?.parentConfirmed ? 'Confirmed' : 'Pending' }}
              </span>
            </div>
            <div v-if="!userProfile?.requiresParentApproval" class="info-item">
              <span class="info-label">Account type</span>
              <span class="info-value status verified">Independent (13+)</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { currentUser, userProfile, logout } = useAuth()

function gradeSuffix(n: number): string {
  if (n === 1) return 'st'
  if (n === 2) return 'nd'
  if (n === 3) return 'rd'
  return 'th'
}

async function handleLogout() {
  await logout()
  router.push('/login')
}
</script>

<style scoped>
.dashboard { min-height: 100vh; background: var(--bg-page); }
.dash-header { background: var(--bg-card); border-bottom: 1px solid var(--border); padding: 0 1.5rem; }
.dash-header-inner { max-width: 960px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 60px; }
.dash-logo { font-size: 1.375rem; color: var(--green-primary); cursor: pointer; }
.dash-logo span { color: var(--gold); }
.dash-user { display: flex; align-items: center; gap: 0.75rem; }
.dash-avatar { width: 32px; height: 32px; border-radius: 50%; }
.dash-greeting { font-family: var(--font-display); font-weight: 600; font-size: 0.875rem; color: var(--text-secondary); }
.btn-sign-out { background: none; border: 1px solid var(--border); border-radius: var(--radius); padding: 0.375rem 0.875rem; font-family: var(--font-display); font-size: 0.8125rem; font-weight: 600; color: var(--text-muted); cursor: pointer; transition: background 0.15s ease; }
.btn-sign-out:hover { background: var(--bg-input); }
.dash-main { max-width: 960px; margin: 0 auto; padding: 2rem 1.5rem; }
.welcome-banner { background: var(--green-light); border-radius: var(--radius-lg); padding: 2rem; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; flex-wrap: wrap; }
.welcome-text h2 { font-size: 1.5rem; color: var(--green-primary); margin-bottom: 0.25rem; }
.welcome-text p { color: var(--text-secondary); font-size: 0.938rem; }
.info-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; }
.info-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; }
.info-card-icon { font-size: 1.5rem; margin-bottom: 0.75rem; }
.info-card h3 { font-size: 1rem; margin-bottom: 1rem; color: var(--text-primary); }
.info-items { display: flex; flex-direction: column; gap: 0.75rem; }
.info-item { display: flex; justify-content: space-between; align-items: center; }
.info-label { font-size: 0.8125rem; color: var(--text-muted); }
.info-value { font-family: var(--font-display); font-weight: 600; font-size: 0.875rem; }
.status { padding: 0.125rem 0.625rem; border-radius: 100px; font-size: 0.75rem; }
.status.verified { background: var(--green-light); color: var(--green-primary); }
.status.pending { background: var(--gold-light); color: #946800; }
</style>
