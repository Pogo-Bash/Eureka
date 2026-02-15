<template>
  <div class="dashboard">
    <header class="dash-header">
      <div class="dash-header-inner">
        <h1 class="dash-logo">Eureka<span>!</span></h1>
        <div class="dash-nav">
          <router-link to="/learn" class="nav-link active">Practice</router-link>
          <router-link to="/analytics" class="nav-link">Analytics</router-link>
        </div>
        <div class="dash-user">
          <button class="theme-toggle" @click="toggleTheme()" :title="isDark() ? 'Switch to light mode' : 'Switch to dark mode'">{{ isDark() ? '☀️' : '🌙' }}</button>
          <img v-if="currentUser?.photoURL" :src="currentUser.photoURL" class="dash-avatar" alt="" />
          <span class="dash-greeting">{{ userProfile?.firstName }}</span>
          <button class="btn-sign-out" @click="handleLogout">Sign out</button>
        </div>
      </div>
    </header>

    <main class="dash-main">
      <div class="page-header">
        <h2>Choose your grade</h2>
        <p>Select a grade level to start practicing</p>
      </div>

      <div class="grades-grid">
        <button
          v-for="g in grades"
          :key="g.grade"
          class="grade-card"
          :class="{ active: g.active, locked: !g.active }"
          @click="g.active && selectGrade(g.grade)"
        >
          <span class="grade-number">{{ g.grade }}</span>
          <span class="grade-label">{{ g.grade }}{{ gradeSuffix(g.grade) }} Grade</span>
          <span v-if="!g.active" class="coming-soon">Coming soon</span>
          <span v-if="g.active && g.grade === userProfile?.grade" class="your-grade">Your grade</span>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useTheme } from '../composables/useTheme'
import { getAvailableGrades } from '../data/courses'

const router = useRouter()
const { currentUser, userProfile, logout } = useAuth()
const { toggle: toggleTheme, isDark } = useTheme()

const grades = getAvailableGrades()

function gradeSuffix(n: number): string {
  if (n === 1) return 'st'
  if (n === 2) return 'nd'
  if (n === 3) return 'rd'
  return 'th'
}

function selectGrade(grade: number) {
  router.push(`/learn/${grade}`)
}

async function handleLogout() {
  await logout()
  router.push('/login')
}
</script>

<style scoped>
.page-header {
  margin-bottom: 2rem;
}

.page-header h2 {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.page-header p {
  color: var(--text-muted);
  font-size: 0.938rem;
}

.grades-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
}

.grade-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1.5rem 1rem;
  border: 2px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  cursor: pointer;
  transition: all 0.15s ease;
  position: relative;
}

.grade-card.active:hover {
  border-color: var(--green-primary);
  box-shadow: 0 2px 12px rgba(27, 126, 79, 0.12);
  transform: translateY(-2px);
}

.grade-card.locked {
  opacity: 0.5;
  cursor: not-allowed;
}

.grade-number {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 800;
  color: var(--green-primary);
}

.grade-card.locked .grade-number {
  color: var(--text-muted);
}

.grade-label {
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.coming-soon {
  font-size: 0.6875rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.your-grade {
  font-size: 0.6875rem;
  color: var(--green-primary);
  font-weight: 600;
  background: var(--green-light);
  padding: 0.125rem 0.5rem;
  border-radius: 100px;
  margin-top: 0.25rem;
}

/* Reusing dashboard header styles */
.dashboard { min-height: 100vh; background: var(--bg-page); }
.dash-header { background: var(--bg-card); border-bottom: 1px solid var(--border); padding: 0 1.5rem; }
.dash-header-inner { max-width: 960px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 60px; }
.dash-logo { font-size: 1.375rem; color: var(--green-primary); cursor: pointer; }
.dash-logo span { color: var(--gold); }
.dash-nav { display: flex; gap: 1.5rem; }
.nav-link { font-family: var(--font-display); font-size: 0.875rem; font-weight: 600; color: var(--text-muted); text-decoration: none; padding: 0.25rem 0; border-bottom: 2px solid transparent; }
.nav-link.active, .nav-link:hover { color: var(--green-primary); border-bottom-color: var(--green-primary); }
.dash-user { display: flex; align-items: center; gap: 0.75rem; }
.dash-avatar { width: 32px; height: 32px; border-radius: 50%; }
.dash-greeting { font-family: var(--font-display); font-weight: 600; font-size: 0.875rem; color: var(--text-secondary); }
.btn-sign-out { background: none; border: 1px solid var(--border); border-radius: var(--radius); padding: 0.375rem 0.875rem; font-family: var(--font-display); font-size: 0.8125rem; font-weight: 600; color: var(--text-muted); cursor: pointer; transition: background 0.15s ease; }
.btn-sign-out:hover { background: var(--bg-input); }
.theme-toggle { background: none; border: 1px solid var(--border); border-radius: var(--radius); padding: 0.25rem 0.5rem; cursor: pointer; font-size: 1rem; line-height: 1; transition: background 0.15s ease; }
.theme-toggle:hover { background: var(--bg-input); }
.dash-main { max-width: 960px; margin: 0 auto; padding: 2rem 1.5rem; }
</style>
