import type { QuestionTemplate, GeneratedQuestion, VariableSpec } from '../types'
import { evaluateExpression, simplifyFraction, round } from './math'

let questionCounter = 0

// Generate a random value from a VariableSpec
function generateVariable(spec: VariableSpec): number | string {
  if (spec.type === 'pool' && spec.pool && spec.pool.length > 0) {
    return spec.pool[Math.floor(Math.random() * spec.pool.length)]!
  }

  if (spec.type === 'range') {
    const min = spec.min ?? 0
    const max = spec.max ?? 10
    const step = spec.step ?? 1

    if (step < 1) {
      // Decimal range
      const steps = Math.floor((max - min) / step)
      const randomStep = Math.floor(Math.random() * (steps + 1))
      return round(min + randomStep * step, 2)
    }

    const range = Math.floor((max - min) / step) + 1
    return min + Math.floor(Math.random() * range) * step
  }

  return 0
}

// Check if a set of variables satisfies all constraints
function checkConstraints(vars: Record<string, number | string>, constraints?: string[]): boolean {
  if (!constraints || constraints.length === 0) return true

  for (const constraint of constraints) {
    try {
      let expr = constraint
      const sortedKeys = Object.keys(vars).sort((a, b) => b.length - a.length)
      for (const key of sortedKeys) {
        const val = vars[key]
        if (typeof val === 'number') {
          expr = expr.replace(new RegExp(`\\b${key}\\b`, 'g'), `(${val})`)
        }
      }
      const fn = new Function(`"use strict"; return (${expr});`)
      if (!fn()) return false
    } catch {
      return false
    }
  }
  return true
}

// Generate concrete variables from a template, respecting constraints
function generateVariables(template: QuestionTemplate, maxAttempts = 50): Record<string, number | string> | null {
  // Collect all constraints from all variables
  const allConstraints: string[] = []
  for (const spec of Object.values(template.variables)) {
    if (spec.constraints) {
      allConstraints.push(...spec.constraints)
    }
  }

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const vars: Record<string, number | string> = {}
    for (const [name, spec] of Object.entries(template.variables)) {
      vars[name] = generateVariable(spec)
    }

    if (checkConstraints(vars, allConstraints)) {
      return vars
    }
  }

  return null
}

// Fill template string with variable values
function fillTemplate(template: string, vars: Record<string, number | string>): string {
  let result = template
  for (const [key, value] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), String(value))
  }
  return result
}

// Generate distractor choices for multiple choice
function generateDistractors(
  correctAnswer: number | string,
  template: QuestionTemplate,
  vars: Record<string, number | string>,
): (string | number)[] {
  const distractors = new Set<string>()
  distractors.add(String(correctAnswer))

  const strategy = template.distractorStrategy

  if (strategy?.type === 'offset' && typeof correctAnswer === 'number') {
    for (const offset of strategy.offsets) {
      distractors.add(String(correctAnswer + offset))
      distractors.add(String(correctAnswer - offset))
    }
  }

  if (strategy?.type === 'common_mistakes') {
    for (const expr of strategy.expressions) {
      try {
        const val = evaluateExpression(expr, vars)
        if (String(val) !== String(correctAnswer)) {
          distractors.add(String(val))
        }
      } catch { /* skip */ }
    }
  }

  if (strategy?.type === 'pool' && strategy.values.length > 0) {
    const pool = strategy.values.filter((v) => String(v) !== String(correctAnswer))
    for (const val of pool) {
      distractors.add(String(val))
    }
  }

  // If we still need more distractors, generate nearby values
  if (typeof correctAnswer === 'number') {
    let offset = 1
    while (distractors.size < 4) {
      const d1: number = correctAnswer + offset
      const d2: number = correctAnswer - offset
      if (d1 !== correctAnswer) distractors.add(String(d1))
      if (d2 !== correctAnswer && d2 >= 0) distractors.add(String(d2))
      offset++
      if (offset > 20) break
    }
  }

  // For fraction answers, generate nearby fraction distractors
  if (typeof correctAnswer === 'string' && correctAnswer.includes('/')) {
    const [num, den] = correctAnswer.split('/').map(Number)
    if (num !== undefined && den !== undefined && !isNaN(num) && !isNaN(den)) {
      // Common wrong answers: unsimplified, off-by-one
      distractors.add(simplifyFraction(num + 1, den))
      distractors.add(simplifyFraction(num - 1, den))
      distractors.add(simplifyFraction(num, den + 1))
      // Add the unsimplified version as a distractor if different
      const doubled = `${num * 2}/${den * 2}`
      if (doubled !== correctAnswer) distractors.add(doubled)
    }
  }

  // For ratio answers
  if (typeof correctAnswer === 'string' && correctAnswer.includes(':')) {
    const [a, b] = correctAnswer.split(':').map(Number)
    if (a !== undefined && b !== undefined && !isNaN(a) && !isNaN(b)) {
      distractors.add(`${a + 1}:${b}`)
      distractors.add(`${a}:${b + 1}`)
      distractors.add(`${b}:${a}`) // swapped
    }
  }

  // Convert to array and shuffle, keeping exactly 4 choices
  const choices = Array.from(distractors).slice(0, 4)

  // If we don't have 4, pad with random nearby values
  while (choices.length < 4) {
    const rand = Math.floor(Math.random() * 20) + 1
    const filler = String(typeof correctAnswer === 'number' ? correctAnswer + rand : rand)
    if (!choices.includes(filler)) choices.push(filler)
  }

  // Shuffle
  for (let i = choices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[choices[i], choices[j]] = [choices[j]!, choices[i]!]
  }

  return choices
}

// Check if an answer is "clean" — no long decimals, no NaN, no weird values
function isCleanAnswer(answer: number | string): boolean {
  if (typeof answer === 'string') {
    // Fractions and ratios are always clean
    if (answer.includes('/') || answer.includes(':')) return true
    // Check if it parses as a clean number
    const num = parseFloat(answer)
    if (isNaN(num)) return false
    return isCleanNumber(num)
  }
  if (typeof answer === 'number') {
    if (!isFinite(answer) || isNaN(answer)) return false
    return isCleanNumber(answer)
  }
  return false
}

function isCleanNumber(n: number): boolean {
  // Must not have more than 2 decimal places
  const rounded = Math.round(n * 100) / 100
  if (Math.abs(n - rounded) > 0.0001) return false
  // Must not be unreasonably large
  if (Math.abs(n) > 10000) return false
  return true
}

// Main: generate a question from a template
export function generateQuestion(
  template: QuestionTemplate,
  topicId: string,
  courseId: string,
  difficultyMod: number = 0,
): GeneratedQuestion | null {
  // Try up to 20 times to get a clean answer
  for (let attempt = 0; attempt < 20; attempt++) {
    const vars = generateVariables(template)
    if (!vars) continue

    const correctAnswer = evaluateExpression(template.answerExpression, vars)
    if (!isCleanAnswer(correctAnswer)) continue

    const questionText = fillTemplate(template.questionTemplate, vars)
    const difficulty = Math.max(0, Math.min(1, template.baseDifficulty + difficultyMod))

    const question: GeneratedQuestion = {
      id: `q-${Date.now()}-${++questionCounter}`,
      templateId: template.id,
      topicId,
      courseId,
      questionText,
      answerType: template.type,
      correctAnswer,
      difficulty,
      variables: vars,
      visual: template.visual,
    }

    // Generate choices for multiple choice
    if (template.type === 'multiple_choice') {
      question.choices = generateDistractors(correctAnswer, template, vars)
    }

    return question
  }

  return null
}

// Generate multiple questions from a topic
export function generateQuestionSet(
  templates: QuestionTemplate[],
  topicId: string,
  courseId: string,
  count: number = 1,
  difficultyMod: number = 0,
): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = []

  for (let i = 0; i < count; i++) {
    // Pick a random template (will be replaced by adaptive selection)
    const template = templates[Math.floor(Math.random() * templates.length)]!
    const q = generateQuestion(template, topicId, courseId, difficultyMod)
    if (q) questions.push(q)
  }

  return questions
}
