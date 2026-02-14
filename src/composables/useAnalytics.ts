import { ref, computed } from 'vue'
import type { QuestionAttempt, TopicMastery } from '../types'

const STORAGE_KEY = 'eureka-analytics'

interface AnalyticsData {
  attempts: StoredAttempt[]
  topicMasteries: Record<string, TopicMastery>
}

interface StoredAttempt {
  questionId: string
  templateId: string
  topicId: string
  courseId: string
  correct: boolean
  timeMs: number
  difficulty: number
  timestamp: number
}

function loadData(): AnalyticsData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return { attempts: [], topicMasteries: {} }
}

function saveData(data: AnalyticsData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch { /* ignore */ }
}

const data = ref<AnalyticsData>(loadData())

export function useAnalytics() {
  // Record a batch of attempts from a session
  function recordSession(attempts: QuestionAttempt[]) {
    const stored: StoredAttempt[] = attempts.map((a) => ({
      questionId: a.questionId,
      templateId: a.templateId,
      topicId: a.topicId,
      courseId: a.courseId,
      correct: a.correct,
      timeMs: a.timeMs,
      difficulty: a.difficulty,
      timestamp: a.timestamp,
    }))
    data.value.attempts.push(...stored)
    saveData(data.value)
  }

  function updateTopicMastery(topicId: string, mastery: TopicMastery) {
    data.value.topicMasteries[topicId] = mastery
    saveData(data.value)
  }

  // === Computed stats ===

  const allAttempts = computed(() => data.value.attempts)

  const totalQuestions = computed(() => allAttempts.value.length)

  const totalCorrect = computed(() => allAttempts.value.filter((a) => a.correct).length)

  const overallAccuracy = computed(() => {
    if (totalQuestions.value === 0) return 0
    return Math.round((totalCorrect.value / totalQuestions.value) * 100)
  })

  const averageTime = computed(() => {
    if (totalQuestions.value === 0) return 0
    return Math.round(allAttempts.value.reduce((s, a) => s + a.timeMs, 0) / totalQuestions.value)
  })

  const totalPracticeTime = computed(() => {
    return allAttempts.value.reduce((s, a) => s + a.timeMs, 0)
  })

  // Today's stats
  const todayAttempts = computed(() => {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    return allAttempts.value.filter((a) => a.timestamp >= start.getTime())
  })

  const todayQuestions = computed(() => todayAttempts.value.length)

  const todayCorrect = computed(() => todayAttempts.value.filter((a) => a.correct).length)

  const todayAccuracy = computed(() => {
    if (todayQuestions.value === 0) return 0
    return Math.round((todayCorrect.value / todayQuestions.value) * 100)
  })

  const todayPracticeTime = computed(() => {
    return todayAttempts.value.reduce((s, a) => s + a.timeMs, 0)
  })

  // This week's stats
  const weekAttempts = computed(() => {
    const now = new Date()
    const dayOfWeek = now.getDay() // 0 = Sunday
    const start = new Date(now)
    start.setDate(now.getDate() - dayOfWeek)
    start.setHours(0, 0, 0, 0)
    return allAttempts.value.filter((a) => a.timestamp >= start.getTime())
  })

  const weekQuestions = computed(() => weekAttempts.value.length)

  const weekCorrect = computed(() => weekAttempts.value.filter((a) => a.correct).length)

  const weekAccuracy = computed(() => {
    if (weekQuestions.value === 0) return 0
    return Math.round((weekCorrect.value / weekQuestions.value) * 100)
  })

  const weekPracticeTime = computed(() => {
    return weekAttempts.value.reduce((s, a) => s + a.timeMs, 0)
  })

  // Daily breakdown for the last 7 days
  const dailyBreakdown = computed(() => {
    const days: { date: string; label: string; questions: number; correct: number; timeMs: number }[] = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      const end = new Date(date)
      end.setHours(23, 59, 59, 999)

      const dayAttempts = allAttempts.value.filter(
        (a) => a.timestamp >= date.getTime() && a.timestamp <= end.getTime(),
      )

      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

      days.push({
        date: date.toISOString().split('T')[0]!,
        label: i === 0 ? 'Today' : i === 1 ? 'Yesterday' : dayNames[date.getDay()]!,
        questions: dayAttempts.length,
        correct: dayAttempts.filter((a) => a.correct).length,
        timeMs: dayAttempts.reduce((s, a) => s + a.timeMs, 0),
      })
    }

    return days
  })

  // Per-topic stats
  const topicStats = computed(() => {
    const map = new Map<string, { topicId: string; courseId: string; questions: number; correct: number; timeMs: number; lastPracticed: number }>()

    for (const a of allAttempts.value) {
      const key = `${a.courseId}:${a.topicId}`
      const existing = map.get(key)
      if (existing) {
        existing.questions++
        if (a.correct) existing.correct++
        existing.timeMs += a.timeMs
        existing.lastPracticed = Math.max(existing.lastPracticed, a.timestamp)
      } else {
        map.set(key, {
          topicId: a.topicId,
          courseId: a.courseId,
          questions: 1,
          correct: a.correct ? 1 : 0,
          timeMs: a.timeMs,
          lastPracticed: a.timestamp,
        })
      }
    }

    return Array.from(map.values()).sort((a, b) => b.lastPracticed - a.lastPracticed)
  })

  // Best streak ever
  const bestStreak = computed(() => {
    let best = 0
    let current = 0
    for (const a of allAttempts.value) {
      if (a.correct) {
        current++
        best = Math.max(best, current)
      } else {
        current = 0
      }
    }
    return best
  })

  // Difficulty distribution
  const difficultyDistribution = computed(() => {
    const buckets = { easy: 0, medium: 0, hard: 0 }
    const correct = { easy: 0, medium: 0, hard: 0 }

    for (const a of allAttempts.value) {
      if (a.difficulty < 0.35) {
        buckets.easy++
        if (a.correct) correct.easy++
      } else if (a.difficulty < 0.55) {
        buckets.medium++
        if (a.correct) correct.medium++
      } else {
        buckets.hard++
        if (a.correct) correct.hard++
      }
    }

    return {
      easy: { total: buckets.easy, correct: correct.easy, accuracy: buckets.easy ? Math.round((correct.easy / buckets.easy) * 100) : 0 },
      medium: { total: buckets.medium, correct: correct.medium, accuracy: buckets.medium ? Math.round((correct.medium / buckets.medium) * 100) : 0 },
      hard: { total: buckets.hard, correct: correct.hard, accuracy: buckets.hard ? Math.round((correct.hard / buckets.hard) * 100) : 0 },
    }
  })

  function clearData() {
    data.value = { attempts: [], topicMasteries: {} }
    saveData(data.value)
  }

  return {
    recordSession,
    updateTopicMastery,
    totalQuestions,
    totalCorrect,
    overallAccuracy,
    averageTime,
    totalPracticeTime,
    todayQuestions,
    todayCorrect,
    todayAccuracy,
    todayPracticeTime,
    weekQuestions,
    weekCorrect,
    weekAccuracy,
    weekPracticeTime,
    dailyBreakdown,
    topicStats,
    bestStreak,
    difficultyDistribution,
    clearData,
  }
}
