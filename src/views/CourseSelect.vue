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
      <button class="back-btn" @click="$router.push('/learn')">← All grades</button>

      <div class="page-header">
        <h2>{{ grade }}{{ gradeSuffix(grade) }} Grade</h2>
        <p>Choose a subject to start practicing</p>
      </div>

      <div class="courses-grid">
        <button
          v-for="course in gradeCourses"
          :key="course.id"
          class="course-card"
          :style="{ '--course-color': course.color }"
          @click="$router.push(`/learn/${grade}/${course.id}`)"
        >
          <span class="course-icon">{{ course.icon }}</span>
          <span class="course-name">{{ course.name }}</span>
          <span class="course-topics">{{ course.topics.length }} topics</span>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { getCoursesForGrade } from '../data/courses'

const route = useRoute()
const router = useRouter()
const { currentUser, userProfile, logout } = useAuth()

const grade = computed(() => parseInt(route.params.grade as string))
const gradeCourses = computed(() => getCoursesForGrade(grade.value))

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
.back-btn {
  background: none;
  border: none;
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0;
  margin-bottom: 1.5rem;
  transition: color 0.15s ease;
}

.back-btn:hover {
  color: var(--green-primary);
}

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

.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.25rem;
}

.course-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem 1.5rem;
  border: 2px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  cursor: pointer;
  transition: all 0.15s ease;
}

.course-card:hover {
  border-color: var(--course-color);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.course-icon {
  font-size: 2.5rem;
}

.course-name {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--course-color);
}

.course-topics {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

/* Reusing layout styles */
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
</style>
