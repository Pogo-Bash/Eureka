<template>
  <div class="dashboard">
    <header class="dash-header">
      <div class="dash-header-inner">
        <h1 class="dash-logo" @click="$router.push('/learn')">Eureka<span>!</span></h1>
        <div class="dash-nav">
          <router-link to="/learn" class="nav-link">Practice</router-link>
          <router-link to="/analytics" class="nav-link active">Analytics</router-link>
        </div>
        <div class="dash-user">
          <button class="theme-toggle" @click="toggleTheme()" :title="isDark() ? 'Light mode' : 'Dark mode'">{{ isDark() ? '☀️' : '🌙' }}</button>
          <img v-if="currentUser?.photoURL" :src="currentUser.photoURL" class="dash-avatar" alt="" />
          <span class="dash-greeting">{{ userProfile?.firstName }}</span>
        </div>
      </div>
    </header>

    <main class="dash-main">
      <div class="page-header">
        <h2>Your Analytics</h2>
        <p>Track your learning progress</p>
      </div>

      <!-- No data state -->
      <div v-if="totalQuestions === 0" class="empty-state">
        <div class="empty-icon">📊</div>
        <h3>No practice data yet</h3>
        <p>Start practicing to see your analytics here!</p>
        <button class="btn btn-primary" @click="$router.push('/learn')">Start practicing →</button>
      </div>

      <template v-else>
        <!-- Overview cards -->
        <div class="stats-row">
          <div class="stat-card">
            <span class="stat-card-label">Total Questions</span>
            <span class="stat-card-value">{{ totalQuestions }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-label">Overall Accuracy</span>
            <span class="stat-card-value" :class="accuracyClass(overallAccuracy)">{{ overallAccuracy }}%</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-label">Avg Response Time</span>
            <span class="stat-card-value">{{ formatTime(averageTime) }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-card-label">Best Streak</span>
            <span class="stat-card-value streak-val">🔥 {{ bestStreak }}</span>
          </div>
        </div>

        <!-- Today & This Week -->
        <div class="period-cards">
          <div class="period-card">
            <h3>Today</h3>
            <div class="period-stats">
              <div class="period-stat">
                <span class="period-value">{{ todayQuestions }}</span>
                <span class="period-label">Questions</span>
              </div>
              <div class="period-stat">
                <span class="period-value" :class="accuracyClass(todayAccuracy)">{{ todayAccuracy }}%</span>
                <span class="period-label">Accuracy</span>
              </div>
              <div class="period-stat">
                <span class="period-value">{{ formatDuration(todayPracticeTime) }}</span>
                <span class="period-label">Time</span>
              </div>
            </div>
          </div>
          <div class="period-card">
            <h3>This Week</h3>
            <div class="period-stats">
              <div class="period-stat">
                <span class="period-value">{{ weekQuestions }}</span>
                <span class="period-label">Questions</span>
              </div>
              <div class="period-stat">
                <span class="period-value" :class="accuracyClass(weekAccuracy)">{{ weekAccuracy }}%</span>
                <span class="period-label">Accuracy</span>
              </div>
              <div class="period-stat">
                <span class="period-value">{{ formatDuration(weekPracticeTime) }}</span>
                <span class="period-label">Time</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Daily activity chart -->
        <div class="chart-card">
          <h3>Last 7 Days</h3>
          <div class="bar-chart">
            <div
              v-for="day in dailyBreakdown"
              :key="day.date"
              class="bar-col"
            >
              <div class="bar-container">
                <div
                  class="bar bar-correct"
                  :style="{ height: barHeight(day.correct) }"
                ></div>
                <div
                  class="bar bar-wrong"
                  :style="{ height: barHeight(day.questions - day.correct) }"
                ></div>
              </div>
              <span class="bar-label">{{ day.label }}</span>
              <span class="bar-count">{{ day.questions }}</span>
            </div>
          </div>
          <div class="chart-legend">
            <span class="legend-item"><span class="legend-dot correct"></span> Correct</span>
            <span class="legend-item"><span class="legend-dot wrong"></span> Incorrect</span>
          </div>
        </div>

        <!-- Difficulty breakdown -->
        <div class="diff-card">
          <h3>Performance by Difficulty</h3>
          <div class="diff-rows">
            <div class="diff-row">
              <span class="diff-name">Easy</span>
              <div class="diff-bar-track">
                <div class="diff-bar-fill" :style="{ width: difficultyDistribution.easy.accuracy + '%' }" :class="accuracyClass(difficultyDistribution.easy.accuracy)"></div>
              </div>
              <span class="diff-pct" :class="accuracyClass(difficultyDistribution.easy.accuracy)">{{ difficultyDistribution.easy.accuracy }}%</span>
              <span class="diff-count">{{ difficultyDistribution.easy.total }} Q</span>
            </div>
            <div class="diff-row">
              <span class="diff-name">Medium</span>
              <div class="diff-bar-track">
                <div class="diff-bar-fill" :style="{ width: difficultyDistribution.medium.accuracy + '%' }" :class="accuracyClass(difficultyDistribution.medium.accuracy)"></div>
              </div>
              <span class="diff-pct" :class="accuracyClass(difficultyDistribution.medium.accuracy)">{{ difficultyDistribution.medium.accuracy }}%</span>
              <span class="diff-count">{{ difficultyDistribution.medium.total }} Q</span>
            </div>
            <div class="diff-row">
              <span class="diff-name">Hard</span>
              <div class="diff-bar-track">
                <div class="diff-bar-fill" :style="{ width: difficultyDistribution.hard.accuracy + '%' }" :class="accuracyClass(difficultyDistribution.hard.accuracy)"></div>
              </div>
              <span class="diff-pct" :class="accuracyClass(difficultyDistribution.hard.accuracy)">{{ difficultyDistribution.hard.accuracy }}%</span>
              <span class="diff-count">{{ difficultyDistribution.hard.total }} Q</span>
            </div>
          </div>
        </div>

        <!-- Topic breakdown -->
        <div class="topics-card" v-if="topicStats.length > 0">
          <h3>Topics Practiced</h3>
          <div class="topic-rows">
            <div v-for="t in topicStats" :key="t.topicId" class="topic-row">
              <div class="topic-info">
                <span class="topic-name">{{ getTopicName(t.courseId, t.topicId) }}</span>
                <span class="topic-course">{{ getCourseName(t.courseId) }}</span>
              </div>
              <div class="topic-metrics">
                <span class="topic-metric">{{ t.questions }} Q</span>
                <span class="topic-metric" :class="accuracyClass(Math.round((t.correct / t.questions) * 100))">
                  {{ Math.round((t.correct / t.questions) * 100) }}%
                </span>
                <span class="topic-metric time">{{ formatTime(Math.round(t.timeMs / t.questions)) }} avg</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Total practice time -->
        <div class="total-time-card">
          <span class="total-time-label">Total Practice Time</span>
          <span class="total-time-value">{{ formatDuration(totalPracticeTime) }}</span>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../composables/useAuth'
import { useTheme } from '../composables/useTheme'
import { useAnalytics } from '../composables/useAnalytics'
import { getCourse, getTopic } from '../data/courses'

const { currentUser, userProfile } = useAuth()
const { toggle: toggleTheme, isDark } = useTheme()
const {
  totalQuestions,
  overallAccuracy,
  averageTime,
  bestStreak,
  todayQuestions,
  todayAccuracy,
  todayPracticeTime,
  weekQuestions,
  weekAccuracy,
  weekPracticeTime,
  dailyBreakdown,
  topicStats,
  difficultyDistribution,
  totalPracticeTime,
} = useAnalytics()

function accuracyClass(pct: number): string {
  if (pct >= 80) return 'acc-high'
  if (pct >= 50) return 'acc-mid'
  return 'acc-low'
}

function formatTime(ms: number): string {
  if (ms === 0) return '—'
  if (ms < 1000) return '<1s'
  const s = Math.floor(ms / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  return `${m}m ${s % 60}s`
}

function formatDuration(ms: number): string {
  if (ms === 0) return '0m'
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) return `${hours}h ${minutes}m`
  if (minutes > 0) return `${minutes}m ${seconds}s`
  return `${seconds}s`
}

function barHeight(count: number): string {
  const maxQ = Math.max(...dailyBreakdown.value.map((d) => d.questions), 1)
  return `${Math.max((count / maxQ) * 120, count > 0 ? 4 : 0)}px`
}

function getTopicName(courseId: string, topicId: string): string {
  const t = getTopic(courseId, topicId)
  return t?.name || topicId
}

function getCourseName(courseId: string): string {
  const c = getCourse(courseId)
  return c ? `${c.icon} ${c.name} (Grade ${c.grade})` : courseId
}
</script>

<style scoped>
/* Layout */
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
.theme-toggle { background: none; border: 1px solid var(--border); border-radius: var(--radius); padding: 0.25rem 0.5rem; cursor: pointer; font-size: 1rem; line-height: 1; transition: background 0.15s ease; }
.theme-toggle:hover { background: var(--bg-input); }
.dash-main { max-width: 960px; margin: 0 auto; padding: 2rem 1.5rem; }

.page-header { margin-bottom: 1.5rem; }
.page-header h2 { font-size: 1.5rem; color: var(--text-primary); margin-bottom: 0.25rem; }
.page-header p { color: var(--text-muted); font-size: 0.938rem; }

/* Empty state */
.empty-state { text-align: center; padding: 4rem 2rem; }
.empty-icon { font-size: 4rem; margin-bottom: 1rem; }
.empty-state h3 { font-size: 1.25rem; margin-bottom: 0.5rem; }
.empty-state p { color: var(--text-muted); margin-bottom: 1.5rem; }

/* Stats row */
.stats-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
.stat-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.375rem; }
.stat-card-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; font-family: var(--font-display); font-weight: 600; }
.stat-card-value { font-family: var(--font-display); font-weight: 800; font-size: 1.75rem; color: var(--text-primary); }
.stat-card-value.acc-high { color: var(--green-primary); }
.stat-card-value.acc-mid { color: #d4a800; }
.stat-card-value.acc-low { color: #d92916; }
.streak-val { color: #e8890c; }

/* Period cards */
.period-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
.period-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; }
.period-card h3 { font-size: 1rem; color: var(--text-primary); margin-bottom: 1rem; }
.period-stats { display: flex; justify-content: space-around; }
.period-stat { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
.period-value { font-family: var(--font-display); font-weight: 800; font-size: 1.5rem; color: var(--text-primary); }
.period-value.acc-high { color: var(--green-primary); }
.period-value.acc-mid { color: #d4a800; }
.period-value.acc-low { color: #d92916; }
.period-label { font-size: 0.6875rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px; }

/* Bar chart */
.chart-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem; }
.chart-card h3 { font-size: 1rem; color: var(--text-primary); margin-bottom: 1.25rem; }
.bar-chart { display: flex; justify-content: space-around; align-items: flex-end; gap: 0.5rem; min-height: 160px; padding-bottom: 0.5rem; }
.bar-col { display: flex; flex-direction: column; align-items: center; gap: 0.375rem; flex: 1; }
.bar-container { display: flex; flex-direction: column-reverse; width: 100%; max-width: 48px; min-height: 120px; align-items: stretch; justify-content: flex-start; }
.bar { border-radius: 3px 3px 0 0; transition: height 0.3s ease; min-width: 100%; }
.bar-correct { background: var(--green-primary); }
.bar-wrong { background: #f5c6c0; border-radius: 0; }
.bar-label { font-size: 0.6875rem; color: var(--text-muted); font-family: var(--font-display); font-weight: 600; }
.bar-count { font-size: 0.625rem; color: var(--text-muted); }
.chart-legend { display: flex; gap: 1.25rem; justify-content: center; margin-top: 1rem; }
.legend-item { display: flex; align-items: center; gap: 0.375rem; font-size: 0.75rem; color: var(--text-muted); }
.legend-dot { width: 10px; height: 10px; border-radius: 2px; }
.legend-dot.correct { background: var(--green-primary); }
.legend-dot.wrong { background: #f5c6c0; }

/* Difficulty breakdown */
.diff-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem; }
.diff-card h3 { font-size: 1rem; color: var(--text-primary); margin-bottom: 1rem; }
.diff-rows { display: flex; flex-direction: column; gap: 0.875rem; }
.diff-row { display: flex; align-items: center; gap: 0.75rem; }
.diff-name { font-family: var(--font-display); font-weight: 600; font-size: 0.8125rem; width: 60px; color: var(--text-secondary); }
.diff-bar-track { flex: 1; height: 10px; background: var(--bg-input); border-radius: 5px; overflow: hidden; }
.diff-bar-fill { height: 100%; border-radius: 5px; transition: width 0.5s ease; }
.diff-bar-fill.acc-high { background: var(--green-primary); }
.diff-bar-fill.acc-mid { background: #d4a800; }
.diff-bar-fill.acc-low { background: #d92916; }
.diff-pct { font-family: var(--font-display); font-weight: 700; font-size: 0.875rem; width: 45px; text-align: right; }
.diff-pct.acc-high { color: var(--green-primary); }
.diff-pct.acc-mid { color: #d4a800; }
.diff-pct.acc-low { color: #d92916; }
.diff-count { font-size: 0.75rem; color: var(--text-muted); width: 35px; text-align: right; }

/* Topics */
.topics-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 1.5rem; }
.topics-card h3 { font-size: 1rem; color: var(--text-primary); margin-bottom: 1rem; }
.topic-rows { display: flex; flex-direction: column; gap: 0.75rem; }
.topic-row { display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; background: var(--bg-page); border-radius: var(--radius); }
.topic-info { display: flex; flex-direction: column; gap: 0.125rem; }
.topic-name { font-family: var(--font-display); font-weight: 700; font-size: 0.875rem; color: var(--text-primary); }
.topic-course { font-size: 0.6875rem; color: var(--text-muted); }
.topic-metrics { display: flex; gap: 1rem; }
.topic-metric { font-family: var(--font-display); font-weight: 600; font-size: 0.8125rem; color: var(--text-secondary); }
.topic-metric.acc-high { color: var(--green-primary); }
.topic-metric.acc-mid { color: #d4a800; }
.topic-metric.acc-low { color: #d92916; }
.topic-metric.time { color: var(--text-muted); }

/* Total time */
.total-time-card { background: var(--green-light); border-radius: var(--radius-lg); padding: 1.5rem; text-align: center; }
.total-time-label { font-family: var(--font-display); font-weight: 600; font-size: 0.875rem; color: var(--text-secondary); display: block; margin-bottom: 0.5rem; }
.total-time-value { font-family: var(--font-display); font-weight: 800; font-size: 2rem; color: var(--green-primary); }

@media (max-width: 600px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .period-cards { grid-template-columns: 1fr; }
  .topic-row { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
}
</style>
