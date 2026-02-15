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
      <button class="back-btn" @click="$router.push(`/learn/${grade}`)">← {{ course?.name }}</button>

      <div class="page-header" v-if="course">
        <div class="course-badge" :style="{ background: course.color + '15', color: course.color }">
          {{ course.icon }} {{ course.name }}
        </div>
        <h2>Choose a topic</h2>
        <p>Pick what you want to practice</p>
      </div>

      <div class="topics-list" v-if="course">
        <button
          v-for="topic in course.topics"
          :key="topic.id"
          class="topic-card"
          @click="startPractice(topic.id)"
        >
          <div class="topic-left">
            <span class="topic-icon">{{ topic.icon }}</span>
            <div class="topic-info">
              <span class="topic-name">{{ topic.name }}</span>
              <span class="topic-desc">{{ topic.description }}</span>
            </div>
          </div>
          <div class="topic-right">
            <span class="topic-count">{{ topic.questionTemplates.length }} question types</span>
            <span class="topic-arrow">→</span>
          </div>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { getCourse } from '../data/courses'

const route = useRoute()
const router = useRouter()
const { currentUser, userProfile, logout } = useAuth()

const grade = computed(() => route.params.grade as string)
const courseId = computed(() => route.params.courseId as string)
const course = computed(() => getCourse(courseId.value))

function startPractice(topicId: string) {
  router.push(`/learn/${grade.value}/${courseId.value}/${topicId}`)
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

.course-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 100px;
  margin-bottom: 0.75rem;
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

.topics-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.topic-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border: 2px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--bg-card);
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
  width: 100%;
}

.topic-card:hover {
  border-color: var(--green-primary);
  box-shadow: 0 2px 12px rgba(27, 126, 79, 0.08);
}

.topic-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.topic-icon {
  font-size: 1.75rem;
  flex-shrink: 0;
}

.topic-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.topic-name {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.topic-desc {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.topic-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-shrink: 0;
}

.topic-count {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-family: var(--font-display);
}

.topic-arrow {
  font-size: 1.25rem;
  color: var(--green-primary);
  font-weight: 600;
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
