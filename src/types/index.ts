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
