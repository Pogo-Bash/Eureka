import type {
  QuestionTemplate,
  QuestionAttempt,
  TemplateWeight,
  TopicMastery,
  GeneratedQuestion,
} from '../types'
import { generateQuestion } from './generator'

const DECAY_FACTOR = 0.85 // How much old data fades vs new
const SPEED_BONUS_THRESHOLD = 0.7 // If answered in < 70% of expected time
const SPEED_PENALTY_THRESHOLD = 2.0 // If answered in > 200% of expected time
const DIFFICULTY_STEP = 0.05 // How much difficulty changes per adjustment
const MAX_DIFFICULTY_MOD = 0.3
const MIN_DIFFICULTY_MOD = -0.3
const STREAK_BONUS = 3 // After N correct in a row, bump difficulty
const STRUGGLE_THRESHOLD = 3 // After N wrong in a row, ease off

// Expected time per difficulty level (ms)
function expectedTime(difficulty: number): number {
  // Easy: ~8s, Medium: ~15s, Hard: ~25s
  return 8000 + difficulty * 17000
}

// Initialize weights for a template
export function initWeight(templateId: string, topicId: string): TemplateWeight {
  return {
    templateId,
    topicId,
    accuracy: 0.5, // Start neutral
    avgTimeMs: 10000,
    attempts: 0,
    difficultyMod: 0,
    confidence: 0,
  }
}

// Update weights after an attempt
export function updateWeight(
  weight: TemplateWeight,
  attempt: QuestionAttempt,
): TemplateWeight {
  const newAttempts = weight.attempts + 1
  const correctVal = attempt.correct ? 1 : 0

  // Exponential moving average for accuracy
  const newAccuracy =
    weight.attempts === 0
      ? correctVal
      : DECAY_FACTOR * weight.accuracy + (1 - DECAY_FACTOR) * correctVal

  // Exponential moving average for time
  const newAvgTime =
    weight.attempts === 0
      ? attempt.timeMs
      : DECAY_FACTOR * weight.avgTimeMs + (1 - DECAY_FACTOR) * attempt.timeMs

  // Confidence grows with attempts (0 to 1, asymptotic)
  const newConfidence = 1 - Math.exp(-newAttempts / 5)

  // Adjust difficulty based on performance
  let newDifficultyMod = weight.difficultyMod
  const expected = expectedTime(attempt.difficulty)
  const timeRatio = attempt.timeMs / expected

  if (attempt.correct) {
    // Got it right
    if (timeRatio < SPEED_BONUS_THRESHOLD) {
      // Fast AND correct → increase difficulty more
      newDifficultyMod += DIFFICULTY_STEP * 1.5
    } else {
      // Correct at normal speed → slight increase
      newDifficultyMod += DIFFICULTY_STEP * 0.5
    }
  } else {
    // Got it wrong
    if (timeRatio > SPEED_PENALTY_THRESHOLD) {
      // Slow AND wrong → decrease difficulty more
      newDifficultyMod -= DIFFICULTY_STEP * 1.5
    } else {
      // Wrong at normal speed → slight decrease
      newDifficultyMod -= DIFFICULTY_STEP * 0.5
    }
  }

  // Clamp difficulty modifier
  newDifficultyMod = Math.max(MIN_DIFFICULTY_MOD, Math.min(MAX_DIFFICULTY_MOD, newDifficultyMod))

  return {
    ...weight,
    accuracy: newAccuracy,
    avgTimeMs: newAvgTime,
    attempts: newAttempts,
    difficultyMod: newDifficultyMod,
    confidence: newConfidence,
  }
}

// Calculate topic mastery from weights
export function calculateMastery(
  weights: Map<string, TemplateWeight>,
  attempts: QuestionAttempt[],
): TopicMastery | null {
  if (attempts.length === 0) return null

  const topicAttempts = attempts
  const correct = topicAttempts.filter((a) => a.correct).length
  const totalTime = topicAttempts.reduce((sum, a) => sum + a.timeMs, 0)

  // Mastery is weighted average of accuracy across templates, weighted by confidence
  let weightedAccuracy = 0
  let totalConfidence = 0

  for (const w of weights.values()) {
    if (w.attempts > 0) {
      weightedAccuracy += w.accuracy * w.confidence
      totalConfidence += w.confidence
    }
  }

  const mastery = totalConfidence > 0 ? weightedAccuracy / totalConfidence : correct / topicAttempts.length

  // Calculate streak
  let streak = 0
  for (let i = topicAttempts.length - 1; i >= 0; i--) {
    if (topicAttempts[i]!.correct) streak++
    else break
  }

  return {
    topicId: topicAttempts[0]!.topicId,
    courseId: topicAttempts[0]!.courseId,
    mastery: Math.max(0, Math.min(1, mastery)),
    questionsAttempted: topicAttempts.length,
    questionsCorrect: correct,
    avgTimeMs: totalTime / topicAttempts.length,
    lastPracticed: Date.now(),
    streak,
  }
}

// === ADAPTIVE TEMPLATE SELECTION ===

interface SelectionContext {
  weights: Map<string, TemplateWeight>
  recentAttempts: QuestionAttempt[] // Last ~10 attempts
  streak: number // Current correct streak
  wrongStreak: number // Current wrong streak
}

// Score each template for selection priority
function scoreTemplate(
  template: QuestionTemplate,
  weight: TemplateWeight,
  ctx: SelectionContext,
): number {
  let score = 1.0

  // 1. Prioritize templates with low confidence (less practiced)
  if (weight.confidence < 0.3) {
    score += 2.0 // Strong boost for unexplored templates
  } else if (weight.confidence < 0.6) {
    score += 1.0
  }

  // 2. Prioritize templates the student struggles with (but not too much)
  if (weight.accuracy < 0.4 && weight.attempts > 2) {
    score += 1.5 // Needs more practice
  } else if (weight.accuracy < 0.6 && weight.attempts > 2) {
    score += 0.75
  }

  // 3. Avoid repeating the same template consecutively
  const lastAttempts = ctx.recentAttempts.slice(-3)
  const recentUseCount = lastAttempts.filter((a) => a.templateId === template.id).length
  score -= recentUseCount * 1.5

  // 4. Staleness bonus — if not practiced recently, boost
  const lastUsed = ctx.recentAttempts
    .filter((a) => a.templateId === template.id)
    .pop()
  if (!lastUsed) {
    score += 1.0 // Never attempted this session
  }

  // 5. Streak adjustments
  if (ctx.streak >= STREAK_BONUS) {
    // Student is on a roll — prefer harder templates
    if (template.baseDifficulty + weight.difficultyMod > 0.3) {
      score += 0.5
    }
  }

  if (ctx.wrongStreak >= STRUGGLE_THRESHOLD) {
    // Student is struggling — prefer easier templates
    if (template.baseDifficulty + weight.difficultyMod < 0.35) {
      score += 1.0
    }
    // And penalize hard ones
    if (template.baseDifficulty + weight.difficultyMod > 0.4) {
      score -= 1.0
    }
  }

  // 6. Difficulty match — prefer templates near the student's current level
  const studentLevel = getStudentLevel(ctx.weights)
  const templateDifficulty = template.baseDifficulty + weight.difficultyMod
  const diffGap = Math.abs(templateDifficulty - studentLevel)
  score -= diffGap * 0.5

  return Math.max(0.1, score) // Never zero — always a chance
}

// Estimate overall student level from weights
function getStudentLevel(weights: Map<string, TemplateWeight>): number {
  let totalDiff = 0
  let count = 0
  for (const w of weights.values()) {
    if (w.attempts > 0) {
      // Higher accuracy → student can handle higher difficulty
      totalDiff += w.accuracy * 0.6 + 0.2
      count++
    }
  }
  return count > 0 ? totalDiff / count : 0.3 // Default to easy-medium
}

// Select the next template using weighted random selection
export function selectNextTemplate(
  templates: QuestionTemplate[],
  ctx: SelectionContext,
): QuestionTemplate {
  // Score all templates
  const scored = templates.map((t) => {
    const weight = ctx.weights.get(t.id) || initWeight(t.id, '')
    return { template: t, score: scoreTemplate(t, weight, ctx) }
  })

  // Weighted random selection
  const totalScore = scored.reduce((sum, s) => sum + s.score, 0)
  let random = Math.random() * totalScore

  for (const s of scored) {
    random -= s.score
    if (random <= 0) return s.template
  }

  // Fallback
  return templates[Math.floor(Math.random() * templates.length)]!
}

// Generate an adaptively selected question
export function generateAdaptiveQuestion(
  templates: QuestionTemplate[],
  topicId: string,
  courseId: string,
  ctx: SelectionContext,
): GeneratedQuestion | null {
  const template = selectNextTemplate(templates, ctx)
  const weight = ctx.weights.get(template.id) || initWeight(template.id, topicId)

  return generateQuestion(template, topicId, courseId, weight.difficultyMod)
}
