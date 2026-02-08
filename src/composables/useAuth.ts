import { ref, computed } from 'vue'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import { doc, setDoc, getDoc, query, collection, where, getDocs } from 'firebase/firestore'
import { auth, db } from '../firebase'
import type { RegistrationForm, StudentProfile } from '../types'

const currentUser = ref<User | null>(null)
const userProfile = ref<StudentProfile | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onAuthStateChanged(auth, async (user) => {
  currentUser.value = user
  if (user) {
    const docRef = doc(db, 'students', user.uid)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      userProfile.value = docSnap.data() as StudentProfile
    }
  } else {
    userProfile.value = null
  }
  loading.value = false
})

function generateInternalEmail(username: string): string {
  const sanitized = username.toLowerCase().replace(/[^a-z0-9]/g, '')
  const random = Math.random().toString(36).substring(2, 8)
  return `${sanitized}-${random}@eureka-internal.app`
}

async function resolveLoginEmail(identifier: string): Promise<string> {
  // If it looks like an email, use it directly
  if (identifier.includes('@')) {
    return identifier
  }

  // Otherwise treat as username — look up the internal email
  const q = query(collection(db, 'students'), where('username', '==', identifier.toLowerCase()))
  const snap = await getDocs(q)

  if (snap.empty) {
    throw new Error('auth/user-not-found')
  }

  const profile = snap.docs[0]!.data() as StudentProfile
  return profile.internalEmail
}

async function checkUsernameAvailable(username: string): Promise<boolean> {
  const q = query(collection(db, 'students'), where('username', '==', username.toLowerCase()))
  const snap = await getDocs(q)
  return snap.empty
}

export function useAuth() {
  const isAuthenticated = computed(() => !!currentUser.value)
  const isEmailVerified = computed(() => currentUser.value?.emailVerified ?? false)

  async function register(form: RegistrationForm) {
    error.value = null
    try {
      const age = parseInt(form.age)
      const isMinor = age < 13
      const usesUsername = form.signupMethod === 'username'

      // Determine the email for Firebase Auth
      let authEmail: string
      if (usesUsername) {
        authEmail = generateInternalEmail(form.username)
      } else {
        authEmail = form.email
      }

      // Check username availability if using username
      if (usesUsername) {
        const available = await checkUsernameAvailable(form.username)
        if (!available) {
          error.value = 'That username is already taken. Try another one.'
          return { success: false }
        }
      }

      const { user } = await createUserWithEmailAndPassword(auth, authEmail, form.password)

      // Only send verification email if they used a real email
      if (!usesUsername) {
        await sendEmailVerification(user)
      }

      const profile: StudentProfile = {
        uid: user.uid,
        firstName: form.firstName,
        lastName: form.lastName,
        username: usesUsername ? form.username.toLowerCase() : null,
        email: usesUsername ? null : form.email,
        internalEmail: authEmail,
        age,
        grade: parseInt(form.grade),
        parentEmail: isMinor ? form.parentEmail : null,
        parentConfirmed: !isMinor,
        emailVerified: usesUsername,
        requiresParentApproval: isMinor,
        createdAt: new Date(),
      }

      await setDoc(doc(db, 'students', user.uid), profile)
      userProfile.value = profile

      return { success: true, usesUsername, isMinor }
    } catch (e: any) {
      error.value = friendlyError(e.code || e.message)
      return { success: false }
    }
  }

  async function login(identifier: string, password: string) {
    error.value = null
    try {
      const email = await resolveLoginEmail(identifier)
      await signInWithEmailAndPassword(auth, email, password)
      return { success: true }
    } catch (e: any) {
      error.value = friendlyError(e.code || e.message)
      return { success: false }
    }
  }

  async function logout() {
    await signOut(auth)
    currentUser.value = null
    userProfile.value = null
  }

  async function resendVerification() {
    if (currentUser.value && !currentUser.value.emailVerified) {
      await sendEmailVerification(currentUser.value)
    }
  }

  return {
    currentUser,
    userProfile,
    loading,
    error,
    isAuthenticated,
    isEmailVerified,
    register,
    login,
    logout,
    resendVerification,
    checkUsernameAvailable,
  }
}

function friendlyError(code: string): string {
  const errors: Record<string, string> = {
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-not-found': 'No account found. Check your email or username.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
    'auth/invalid-credential': 'Invalid email/username or password. Please try again.',
  }
  return errors[code] || 'Something went wrong. Please try again.'
}
