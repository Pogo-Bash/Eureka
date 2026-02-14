<template>
  <div class="practice-page">
    <header class="practice-header">
      <div class="practice-header-inner">
        <div class="practice-title">
          <span class="topic-badge" v-if="topic">{{ topic.icon }} {{ topic.name }}</span>
        </div>
        <div class="practice-stats">
          <div class="stat">
            <span class="stat-value">{{ stats.correct }}</span>
            <span class="stat-label">Correct</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ stats.total }}</span>
            <span class="stat-label">Total</span>
          </div>
          <div class="stat">
            <span class="stat-value" :class="masteryClass">{{ masteryPercent }}%</span>
            <span class="stat-label">Mastery</span>
          </div>
          <div class="stat streak-stat" v-if="stats.streak > 0">
            <span class="stat-value streak">🔥 {{ stats.streak }}</span>
            <span class="stat-label">Streak</span>
          </div>
        </div>
        <button class="end-btn" @click="endSession">✕ End</button>
      </div>
      <!-- Progress bar -->
      <div class="mastery-bar">
        <div class="mastery-fill" :style="{ width: masteryPercent + '%' }" :class="masteryClass"></div>
      </div>
    </header>

    <main class="practice-main">
      <!-- Loading state -->
      <div v-if="!currentQuestion" class="loading-state">
        <div class="spinner-lg"></div>
        <p>Generating question...</p>
      </div>

      <!-- Question -->
      <div v-else class="question-container" :class="{ 'show-feedback': showFeedback }">
        <div class="difficulty-indicator">
          <span v-for="n in 5" :key="n" class="diff-dot" :class="{ filled: n <= difficultyDots }"></span>
          <span class="diff-label">{{ difficultyLabel }}</span>
        </div>

        <div class="question-card">
          <p class="question-text">{{ currentQuestion.questionText }}</p>

          <!-- Multiple choice -->
          <div v-if="currentQuestion.answerType === 'multiple_choice'" class="choices">
            <button
              v-for="(choice, i) in currentQuestion.choices"
              :key="i"
              class="choice-btn"
              :class="{
                selected: selectedChoice === String(choice),
                correct: showFeedback && String(choice) === String(currentQuestion.correctAnswer),
                wrong: showFeedback && selectedChoice === String(choice) && String(choice) !== String(currentQuestion.correctAnswer),
              }"
              @click="!showFeedback && selectChoice(String(choice))"
              :disabled="showFeedback"
            >
              <span class="choice-letter">{{ ['A', 'B', 'C', 'D'][i] }}</span>
              <span class="choice-text">{{ choice }}</span>
            </button>
          </div>

          <!-- Numeric / text input -->
          <div v-else class="answer-input-group">
            <input
              ref="answerInput"
              v-model="typedAnswer"
              type="text"
              class="answer-input"
              :class="{
                correct: showFeedback && isCorrect,
                wrong: showFeedback && !isCorrect,
              }"
              placeholder="Type your answer..."
              @keydown.enter="!showFeedback && submitAnswer()"
              :disabled="showFeedback"
              autocomplete="off"
            />
            <button
              v-if="!showFeedback"
              class="submit-btn"
              @click="submitAnswer()"
              :disabled="!typedAnswer.trim()"
            >
              Check
            </button>
          </div>
        </div>

        <!-- Feedback -->
        <div v-if="showFeedback" class="feedback" :class="isCorrect ? 'correct' : 'wrong'">
          <div class="feedback-icon">{{ isCorrect ? '✅' : '❌' }}</div>
          <div class="feedback-content">
            <p class="feedback-title">{{ isCorrect ? feedbackMessage : 'Not quite!' }}</p>
            <p v-if="!isCorrect" class="feedback-answer">
              The correct answer is <strong>{{ currentQuestion.correctAnswer }}</strong>
            </p>
            <p class="feedback-time">Answered in {{ formatTime(lastTimeMs) }}</p>
          </div>
          <button class="btn btn-primary next-btn" @click="nextQuestion">
            Next question →
          </button>
        </div>

        <!-- Timer (subtle) -->
        <div v-if="!showFeedback" class="timer">
          <span class="timer-dot" :class="{ slow: elapsedMs > 20000 }"></span>
          {{ formatTime(elapsedMs) }}
        </div>
      </div>

      <!-- Session summary (when ending) -->
      <div v-if="showSummary" class="summary-overlay">
        <div class="summary-card">
          <h2>Session Complete!</h2>
          <div class="summary-stats">
            <div class="summary-stat">
              <span class="summary-value">{{ stats.total }}</span>
              <span class="summary-label">Questions</span>
            </div>
            <div class="summary-stat">
              <span class="summary-value correct-text">{{ stats.correct }}</span>
              <span class="summary-label">Correct</span>
            </div>
            <div class="summary-stat">
              <span class="summary-value">{{ Math.round((stats.correct / Math.max(stats.total, 1)) * 100) }}%</span>
              <span class="summary-label">Accuracy</span>
            </div>
            <div class="summary-stat">
              <span class="summary-value">{{ formatTime(stats.avgTime) }}</span>
              <span class="summary-label">Avg Time</span>
            </div>
          </div>
          <div class="summary-mastery">
            <p>Topic Mastery</p>
            <div class="mastery-bar-lg">
              <div class="mastery-fill-lg" :style="{ width: masteryPercent + '%' }" :class="masteryClass"></div>
            </div>
            <span class="mastery-pct">{{ masteryPercent }}%</span>
          </div>
          <div class="summary-actions">
            <button class="btn btn-primary" @click="restartSession">Practice again</button>
            <button class="btn btn-outline" @click="$router.push(`/learn/${grade}/${courseId}`)">Choose another topic</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTopic } from '../data/courses'
import { generateAdaptiveQuestion } from '../engine/adaptive'
import { initWeight, updateWeight, calculateMastery } from '../engine/adaptive'
import { checkAnswer } from '../engine/math'
import { useAnalytics } from '../composables/useAnalytics'
import type { GeneratedQuestion, QuestionAttempt, TemplateWeight } from '../types'

const route = useRoute()
const router = useRouter()
const { recordSession } = useAnalytics()

const grade = computed(() => route.params.grade as string)
const courseId = computed(() => route.params.courseId as string)
const topicId = computed(() => route.params.topicId as string)
const topic = computed(() => getTopic(courseId.value, topicId.value))

// State
const currentQuestion = ref<GeneratedQuestion | null>(null)
const selectedChoice = ref<string | null>(null)
const typedAnswer = ref('')
const showFeedback = ref(false)
const showSummary = ref(false)
const isCorrect = ref(false)
const lastTimeMs = ref(0)
const answerInput = ref<HTMLInputElement | null>(null)

// Timer
const startTime = ref(0)
const elapsedMs = ref(0)
let timerInterval: ReturnType<typeof setInterval> | null = null

// Adaptive state
const weights = ref(new Map<string, TemplateWeight>())
const attempts = ref<QuestionAttempt[]>([])
const streak = ref(0)
const wrongStreak = ref(0)

// Stats
const stats = computed(() => {
  const total = attempts.value.length
  const correct = attempts.value.filter((a) => a.correct).length
  const totalTime = attempts.value.reduce((s, a) => s + a.timeMs, 0)
  return {
    total,
    correct,
    streak: streak.value,
    avgTime: total > 0 ? totalTime / total : 0,
  }
})

const masteryPercent = computed(() => {
  if (attempts.value.length === 0) return 0
  const mastery = calculateMastery(weights.value, attempts.value)
  return mastery ? Math.round(mastery.mastery * 100) : 0
})

const masteryClass = computed(() => {
  const m = masteryPercent.value
  if (m >= 80) return 'high'
  if (m >= 50) return 'medium'
  return 'low'
})

const difficultyDots = computed(() => {
  if (!currentQuestion.value) return 1
  const d = currentQuestion.value.difficulty
  if (d < 0.2) return 1
  if (d < 0.3) return 2
  if (d < 0.4) return 3
  if (d < 0.5) return 4
  return 5
})

const difficultyLabel = computed(() => {
  const labels = ['', 'Easy', 'Easy-Medium', 'Medium', 'Medium-Hard', 'Hard']
  return labels[difficultyDots.value] || ''
})

const feedbackMessages = [
  'Nice job!', 'Correct!', 'Nailed it!', 'Well done!',
  'You got it!', 'Perfect!', 'Great work!', 'Exactly right!',
]
const feedbackMessage = computed(() =>
  feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)]
)

function formatTime(ms: number): string {
  if (ms < 1000) return '<1s'
  const seconds = Math.floor(ms / 1000)
  if (seconds < 60) return `${seconds}s`
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}m ${secs}s`
}

function startTimer() {
  startTime.value = Date.now()
  elapsedMs.value = 0
  timerInterval = setInterval(() => {
    elapsedMs.value = Date.now() - startTime.value
  }, 100)
}

function stopTimer(): number {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  return Date.now() - startTime.value
}

function loadQuestion() {
  if (!topic.value) return
  showFeedback.value = false
  selectedChoice.value = null
  typedAnswer.value = ''

  const ctx = {
    weights: weights.value,
    recentAttempts: attempts.value.slice(-10),
    streak: streak.value,
    wrongStreak: wrongStreak.value,
  }

  currentQuestion.value = generateAdaptiveQuestion(
    topic.value.questionTemplates,
    topicId.value,
    courseId.value,
    ctx,
  )

  startTimer()

  // Focus input for text answers
  nextTick(() => {
    if (currentQuestion.value?.answerType !== 'multiple_choice') {
      answerInput.value?.focus()
    }
  })
}

function selectChoice(choice: string) {
  selectedChoice.value = choice
  processAnswer(choice)
}

function submitAnswer() {
  if (!typedAnswer.value.trim()) return
  processAnswer(typedAnswer.value.trim())
}

function processAnswer(answer: string) {
  if (!currentQuestion.value) return

  const timeMs = stopTimer()
  lastTimeMs.value = timeMs
  const correct = checkAnswer(answer, currentQuestion.value.correctAnswer)
  isCorrect.value = correct

  // Update streaks
  if (correct) {
    streak.value++
    wrongStreak.value = 0
  } else {
    wrongStreak.value++
    streak.value = 0
  }

  // Record attempt
  const attempt: QuestionAttempt = {
    questionId: currentQuestion.value.id,
    templateId: currentQuestion.value.templateId,
    topicId: topicId.value,
    courseId: courseId.value,
    correct,
    timeMs,
    difficulty: currentQuestion.value.difficulty,
    timestamp: Date.now(),
  }
  attempts.value.push(attempt)

  // Update adaptive weights
  const templateId = currentQuestion.value.templateId
  let weight = weights.value.get(templateId)
  if (!weight) {
    weight = initWeight(templateId, topicId.value)
  }
  weights.value.set(templateId, updateWeight(weight, attempt))

  showFeedback.value = true
}

function nextQuestion() {
  loadQuestion()
}

function endSession() {
  stopTimer()
  if (attempts.value.length > 0) {
    recordSession(attempts.value)
    showSummary.value = true
  } else {
    router.push(`/learn/${grade.value}/${courseId.value}`)
  }
}

function restartSession() {
  attempts.value = []
  weights.value = new Map()
  streak.value = 0
  wrongStreak.value = 0
  showSummary.value = false
  loadQuestion()
}

onMounted(() => {
  loadQuestion()
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<style scoped>
.practice-page {
  min-height: 100vh;
  background: var(--bg-page);
  display: flex;
  flex-direction: column;
}

/* Header */
.practice-header {
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
}

.practice-header-inner {
  max-width: 720px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.topic-badge {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.938rem;
  color: var(--text-primary);
}

.practice-stats {
  display: flex;
  gap: 1.25rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
}

.stat-value {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.125rem;
  color: var(--text-primary);
}

.stat-value.high { color: var(--green-primary); }
.stat-value.medium { color: #d4a800; }
.stat-value.low { color: var(--text-muted); }
.stat-value.streak { color: #e8890c; }

.stat-label {
  font-size: 0.6875rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.end-btn {
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.375rem 0.75rem;
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
}

.end-btn:hover {
  background: var(--bg-input);
}

.mastery-bar {
  height: 3px;
  background: var(--border);
}

.mastery-fill {
  height: 100%;
  transition: width 0.5s ease;
  border-radius: 0 2px 2px 0;
}

.mastery-fill.high { background: var(--green-primary); }
.mastery-fill.medium { background: #d4a800; }
.mastery-fill.low { background: var(--border); }

/* Main content */
.practice-main {
  flex: 1;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem 1.5rem;
}

.loading-state {
  text-align: center;
  padding: 4rem;
  color: var(--text-muted);
}

.spinner-lg {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border);
  border-top-color: var(--green-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

/* Question */
.question-container {
  max-width: 640px;
  width: 100%;
}

.difficulty-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 1rem;
}

.diff-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border);
}

.diff-dot.filled {
  background: var(--green-primary);
}

.diff-label {
  font-size: 0.6875rem;
  color: var(--text-muted);
  margin-left: 0.5rem;
  font-family: var(--font-display);
  font-weight: 600;
}

.question-card {
  background: var(--bg-card);
  border: 2px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 2rem;
}

.question-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-family: var(--font-display);
}

/* Multiple choice */
.choices {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.choice-btn {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-card);
  cursor: pointer;
  transition: all 0.15s ease;
  text-align: left;
}

.choice-btn:hover:not(:disabled) {
  border-color: var(--blue-primary);
  background: var(--blue-light);
}

.choice-btn.selected:not(.correct):not(.wrong) {
  border-color: var(--blue-primary);
  background: var(--blue-light);
}

.choice-btn.correct {
  border-color: var(--green-primary);
  background: var(--green-light);
}

.choice-btn.wrong {
  border-color: var(--coral);
  background: var(--error-bg);
}

.choice-letter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--bg-input);
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--text-secondary);
  flex-shrink: 0;
}

.choice-btn.correct .choice-letter {
  background: var(--green-primary);
  color: white;
}

.choice-btn.wrong .choice-letter {
  background: var(--coral);
  color: white;
}

.choice-text {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

/* Text input */
.answer-input-group {
  display: flex;
  gap: 0.75rem;
}

.answer-input {
  flex: 1;
  padding: 0.875rem 1rem;
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 600;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  background: var(--bg-input);
  color: var(--text-primary);
  outline: none;
  transition: border-color 0.15s ease;
}

.answer-input:focus {
  border-color: var(--blue-primary);
}

.answer-input.correct {
  border-color: var(--green-primary);
  background: var(--green-light);
}

.answer-input.wrong {
  border-color: var(--coral);
  background: var(--error-bg);
}

.submit-btn {
  padding: 0.875rem 1.5rem;
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  border: none;
  border-radius: var(--radius);
  background: var(--green-primary);
  color: white;
  cursor: pointer;
  transition: background 0.15s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #166b43;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Feedback */
.feedback {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-radius: var(--radius-lg);
  margin-top: 1rem;
  flex-wrap: wrap;
}

.feedback.correct {
  background: var(--green-light);
  border: 1px solid #b8e6cc;
}

.feedback.wrong {
  background: var(--error-bg);
  border: 1px solid var(--coral);
}

.feedback-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.feedback-content {
  flex: 1;
  min-width: 200px;
}

.feedback-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1rem;
  color: var(--text-primary);
}

.feedback-answer {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.feedback-time {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.next-btn {
  flex-shrink: 0;
}

/* Timer */
.timer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
  font-family: var(--font-display);
  font-weight: 600;
}

.timer-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--green-primary);
  animation: pulse 2s ease-in-out infinite;
}

.timer-dot.slow {
  background: #e8890c;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* Summary overlay */
.summary-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 100;
}

.summary-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: 2.5rem;
  max-width: 480px;
  width: 100%;
  text-align: center;
}

.summary-card h2 {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.summary-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.summary-value {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.5rem;
  color: var(--text-primary);
}

.summary-value.correct-text {
  color: var(--green-primary);
}

.summary-label {
  font-size: 0.6875rem;
  color: var(--text-muted);
  text-transform: uppercase;
}

.summary-mastery {
  margin-bottom: 2rem;
}

.summary-mastery p {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.mastery-bar-lg {
  height: 10px;
  background: var(--border);
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.mastery-fill-lg {
  height: 100%;
  border-radius: 5px;
  transition: width 0.5s ease;
}

.mastery-fill-lg.high { background: var(--green-primary); }
.mastery-fill-lg.medium { background: #d4a800; }
.mastery-fill-lg.low { background: var(--text-muted); }

.mastery-pct {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.25rem;
}

.summary-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 600px) {
  .practice-stats { gap: 0.75rem; }
  .stat-value { font-size: 0.938rem; }
  .summary-stats { grid-template-columns: repeat(2, 1fr); }
  .question-card { padding: 1.5rem; }
  .question-text { font-size: 1.125rem; }
}
</style>
