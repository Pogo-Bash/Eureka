export interface StudentProfile {
  uid: string
  firstName: string
  lastName: string
  username: string | null
  email: string | null
  internalEmail: string
  age: number
  grade: number
  parentEmail: string | null
  parentConfirmed: boolean
  emailVerified: boolean
  requiresParentApproval: boolean
  createdAt: Date
}

export type Grade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export type SignupMethod = 'email' | 'username'

export interface RegistrationForm {
  firstName: string
  lastName: string
  signupMethod: SignupMethod
  email: string
  username: string
  password: string
  confirmPassword: string
  age: string
  grade: string
  parentEmail: string
}

export interface LoginForm {
  identifier: string
  password: string
}

// === Course & Adaptive System Types ===

export type Subject = 'math' | 'english' | 'science'

export interface Course {
  id: string
  subject: Subject
  grade: number
  name: string
  icon: string
  color: string
  topics: Topic[]
}

export interface Topic {
  id: string
  name: string
  description: string
  icon: string
  questionTemplates: QuestionTemplate[]
}

// A template is a parameterized "equation" that generates concrete questions
export interface QuestionTemplate {
  id: string
  type: 'multiple_choice' | 'numeric' | 'text'
  // Template string with variables like {{a}}, {{b}}
  questionTemplate: string
  // Ranges or pools for each variable
  variables: Record<string, VariableSpec>
  // Expression or function to compute the answer from variables
  answerExpression: string
  // For multiple choice: how to generate distractors
  distractorStrategy?: DistractorStrategy
  // Difficulty weight (0-1, higher = harder)
  baseDifficulty: number
  // Tags for categorization
  tags: string[]
  // Visual type for interactive rendering
  visual?: QuestionVisual
}

export type QuestionVisual =
  | { type: 'number_line'; min: number; max: number; step: number }
  | { type: 'fraction_bar'; denominator: string }
  | { type: 'area_grid'; widthVar: string; heightVar: string; unit?: string }
  | { type: 'shape'; shape: 'triangle' | 'rectangle' | 'parallelogram' | 'trapezoid' | 'rectangular_prism' | 'cube'; labels: Record<string, string> }
  | { type: 'coordinate_plane'; points?: { x: string; y: string; label?: string }[] }
  | { type: 'bar_model'; parts: { label: string; value: string }[] }
  | { type: 'place_value'; numberVar: string }
  | { type: 'expression_tree'; expression: string }

export interface VariableSpec {
  type: 'range' | 'pool'
  min?: number
  max?: number
  step?: number
  pool?: (string | number)[]
  // Constraints: e.g. "a !== b", "a + b < 20"
  constraints?: string[]
}

export type DistractorStrategy =
  | { type: 'offset'; offsets: number[] }        // answer ± offsets
  | { type: 'common_mistakes'; expressions: string[] } // e.g. "a + b" instead of "a * b"
  | { type: 'pool'; values: (string | number)[] }

// A concrete generated question
export interface GeneratedQuestion {
  id: string
  templateId: string
  topicId: string
  courseId: string
  questionText: string
  answerType: 'multiple_choice' | 'numeric' | 'text'
  correctAnswer: string | number
  choices?: (string | number)[]
  difficulty: number
  variables: Record<string, number | string>
  visual?: QuestionVisual
}

// Tracking student performance per question
export interface QuestionAttempt {
  questionId: string
  templateId: string
  topicId: string
  courseId: string
  correct: boolean
  timeMs: number
  difficulty: number
  timestamp: number
}

// Adaptive weights per template
export interface TemplateWeight {
  templateId: string
  topicId: string
  // Running average correctness (0-1)
  accuracy: number
  // Average response time in ms
  avgTimeMs: number
  // Number of attempts
  attempts: number
  // Current adaptive difficulty modifier (-0.3 to +0.3)
  difficultyMod: number
  // Confidence score (higher = more data, more stable)
  confidence: number
}

// Per-topic mastery
export interface TopicMastery {
  topicId: string
  courseId: string
  mastery: number  // 0-1
  questionsAttempted: number
  questionsCorrect: number
  avgTimeMs: number
  lastPracticed: number
  streak: number
}
