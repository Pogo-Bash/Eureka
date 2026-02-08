# Eureka! 💡

An adaptive learning platform for elementary through high school students — personalized, accessible education for every learner.

## Overview

Eureka is a web-based adaptive learning platform designed for K-12 students. It personalizes the learning experience based on each student's age, grade level, and progress, making quality education accessible to everyone.

## Current Features

- **Student Registration** — Multi-step signup collecting name, age, grade, and parent/guardian email
- **Email Verification** — Students must verify their email before accessing the platform
- **Parent Confirmation** — A confirmation email is sent to the parent/guardian for approval
- **Login/Authentication** — Secure email & password authentication via Firebase
- **Dashboard** — Basic student profile and account status overview

## Tech Stack

- **Frontend** — Vue 3 + TypeScript + Vite
- **Authentication** — Firebase Auth
- **Database** — Cloud Firestore
- **Styling** — Custom CSS (Khan Academy-inspired design system)

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with Authentication and Firestore enabled

### Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/Pogo-Bash/Eureka.git
   cd Eureka
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment template and add your Firebase config:
   ```bash
   cp .env.example .env
   ```

4. Start the dev server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── composables/     # Vue composables (useAuth)
├── firebase/        # Firebase configuration
├── router/          # Vue Router setup with auth guards
├── types/           # TypeScript type definitions
├── views/           # Page components
│   ├── Login.vue
│   ├── Register.vue
│   ├── VerifyEmail.vue
│   └── Dashboard.vue
├── App.vue
├── main.ts
└── style.css
```

## License

MIT
