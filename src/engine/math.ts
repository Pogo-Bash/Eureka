// Greatest common divisor
export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a))
  b = Math.abs(Math.round(b))
  while (b) {
    ;[a, b] = [b, a % b]
  }
  return a
}

// Simplify a fraction, returns "n/d" or "n" if whole
export function simplifyFraction(num: number, den: number): string {
  if (den === 0) return 'undefined'
  const sign = (num < 0) !== (den < 0) ? -1 : 1
  num = Math.abs(Math.round(num))
  den = Math.abs(Math.round(den))
  const g = gcd(num, den)
  num = (sign * num) / g
  den = den / g
  if (den === 1) return `${num}`
  return `${num}/${den}`
}

// Format as fraction without simplifying
export function formatFraction(num: number, den: number): string {
  return `${num}/${den}`
}

// Compare two fractions, returns the larger as "a/b"
export function compareFractions(a: number, b: number, c: number, d: number): string {
  const left = a / b
  const right = c / d
  if (left > right) return `${a}/${b}`
  if (right > left) return `${c}/${d}`
  return 'equal'
}

// Simplify a ratio
export function simplifyRatio(a: number, b: number): string {
  const g = gcd(Math.abs(a), Math.abs(b))
  return `${a / g}:${b / g}`
}

// Convert percent to simplified fraction
export function percentToFraction(p: number): string {
  return simplifyFraction(p, 100)
}

// Round to n decimal places
export function round(value: number, places: number): number {
  const factor = Math.pow(10, places)
  return Math.round(value * factor) / factor
}

// Evaluate a math expression with variables
export function evaluateExpression(expr: string, vars: Record<string, number | string>): number | string {
  // Handle our custom functions first
  if (expr.startsWith('simplifyFraction(')) {
    const inner = expr.slice(17, -1)
    const parts = splitArgs(inner)
    const num = evalSimple(parts[0]!, vars)
    const den = evalSimple(parts[1]!, vars)
    return simplifyFraction(num, den)
  }

  if (expr.startsWith('formatFraction(')) {
    const inner = expr.slice(15, -1)
    const parts = splitArgs(inner)
    const num = evalSimple(parts[0]!, vars)
    const den = evalSimple(parts[1]!, vars)
    return formatFraction(num, den)
  }

  if (expr.startsWith('compareFractions(')) {
    const inner = expr.slice(17, -1)
    const parts = splitArgs(inner)
    return compareFractions(
      evalSimple(parts[0]!, vars),
      evalSimple(parts[1]!, vars),
      evalSimple(parts[2]!, vars),
      evalSimple(parts[3]!, vars),
    )
  }

  if (expr.startsWith('simplifyRatio(')) {
    const inner = expr.slice(14, -1)
    const parts = splitArgs(inner)
    return simplifyRatio(evalSimple(parts[0]!, vars), evalSimple(parts[1]!, vars))
  }

  if (expr.startsWith('percentToFraction(')) {
    const inner = expr.slice(18, -1)
    return percentToFraction(evalSimple(inner, vars))
  }

  if (expr.startsWith('round(')) {
    const inner = expr.slice(6, -1)
    const parts = splitArgs(inner)
    return round(evalSimple(parts[0]!, vars), evalSimple(parts[1]!, vars))
  }

  if (expr.startsWith('Math.max(')) {
    const inner = expr.slice(9, -1)
    const parts = splitArgs(inner)
    return Math.max(...parts.map(p => evalSimple(p, vars)))
  }

  if (expr.startsWith('Math.min(')) {
    const inner = expr.slice(9, -1)
    const parts = splitArgs(inner)
    return Math.min(...parts.map(p => evalSimple(p, vars)))
  }

  if (expr.startsWith('Math.abs(')) {
    const inner = expr.slice(9, -1)
    return Math.abs(evalSimple(inner, vars))
  }

  if (expr.startsWith('Math.round(')) {
    const inner = expr.slice(11, -1)
    return Math.round(evalSimple(inner, vars))
  }

  if (expr.startsWith('Math.floor(')) {
    const inner = expr.slice(11, -1)
    return Math.floor(evalSimple(inner, vars))
  }

  if (expr.startsWith('gcd(')) {
    const inner = expr.slice(4, -1)
    const parts = splitArgs(inner)
    return gcd(evalSimple(parts[0]!, vars), evalSimple(parts[1]!, vars))
  }

  // Handle ternary: condition ? a : b
  if (expr.includes('?') && expr.includes(':')) {
    const qIdx = expr.indexOf('?')
    const cIdx = expr.lastIndexOf(':')
    const condition = expr.slice(0, qIdx).trim()
    const trueExpr = expr.slice(qIdx + 1, cIdx).trim()
    const falseExpr = expr.slice(cIdx + 1).trim()
    // Evaluate condition
    const condResult = evalCondition(condition, vars)
    return condResult
      ? evaluateExpression(trueExpr, vars)
      : evaluateExpression(falseExpr, vars)
  }

  // Simple arithmetic expression
  return evalSimple(expr, vars)
}

// Split comma-separated args respecting parentheses
function splitArgs(str: string): string[] {
  const args: string[] = []
  let depth = 0
  let current = ''
  for (const ch of str) {
    if (ch === '(') depth++
    if (ch === ')') depth--
    if (ch === ',' && depth === 0) {
      args.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  args.push(current.trim())
  return args
}

// Evaluate a condition string like 'sup === "²"'
function evalCondition(condition: string, vars: Record<string, number | string>): boolean {
  let resolved = condition.trim()
  const sortedKeys = Object.keys(vars).sort((a, b) => b.length - a.length)
  for (const key of sortedKeys) {
    const val = vars[key]
    if (typeof val === 'string') {
      resolved = resolved.replace(new RegExp(`\\b${key}\\b`, 'g'), `"${val}"`)
    } else if (typeof val === 'number') {
      resolved = resolved.replace(new RegExp(`\\b${key}\\b`, 'g'), `(${val})`)
    }
  }
  try {
    const fn = new Function(`"use strict"; return (${resolved});`)
    return !!fn()
  } catch {
    return false
  }
}

// Evaluate simple arithmetic: supports +, -, *, /, (), variables
function evalSimple(expr: string, vars: Record<string, number | string>): number {
  // Replace variable names with values
  let resolved = expr.trim()
  // Sort by length descending so longer var names get replaced first
  const sortedKeys = Object.keys(vars).sort((a, b) => b.length - a.length)
  for (const key of sortedKeys) {
    const val = vars[key]
    if (typeof val === 'number') {
      // Wrap negative numbers in parens
      const replacement = val < 0 ? `(${val})` : `${val}`
      resolved = resolved.replace(new RegExp(`\\b${key}\\b`, 'g'), replacement)
    }
  }

  // Safe eval using Function (only math operations, no globals)
  try {
    const fn = new Function(`"use strict"; return (${resolved});`)
    const result = fn()
    if (typeof result === 'number' && !isNaN(result)) {
      return result
    }
    return 0
  } catch {
    return 0
  }
}

// Check if an answer matches (handles fractions, decimals, ratios)
export function checkAnswer(userAnswer: string, correctAnswer: string | number): boolean {
  const ua = String(userAnswer).trim().toLowerCase()
  const ca = String(correctAnswer).trim().toLowerCase()

  // Exact match
  if (ua === ca) return true

  // Numeric comparison (handles "3.0" == "3", etc.)
  const uaNum = parseFloat(ua)
  const caNum = parseFloat(ca)
  if (!isNaN(uaNum) && !isNaN(caNum) && Math.abs(uaNum - caNum) < 0.001) return true

  // Fraction comparison: "2/4" should match "1/2"
  if (ua.includes('/') && ca.includes('/')) {
    const [uNum, uDen] = ua.split('/').map(Number)
    const [cNum, cDen] = ca.split('/').map(Number)
    if (uDen && cDen && !isNaN(uNum!) && !isNaN(cNum!)) {
      if (Math.abs(uNum! / uDen - cNum! / cDen) < 0.001) return true
    }
  }

  // Fraction vs decimal
  if (ua.includes('/') && !isNaN(caNum)) {
    const [n, d] = ua.split('/').map(Number)
    if (d && !isNaN(n!) && Math.abs(n! / d - caNum) < 0.001) return true
  }
  if (ca.includes('/') && !isNaN(uaNum)) {
    const [n, d] = ca.split('/').map(Number)
    if (d && !isNaN(n!) && Math.abs(n! / d - uaNum) < 0.001) return true
  }

  // Ratio comparison: "2:3" == "2:3"
  if (ua.includes(':') && ca.includes(':')) {
    const [ua1, ua2] = ua.split(':').map(Number)
    const [ca1, ca2] = ca.split(':').map(Number)
    if (ua2 && ca2 && !isNaN(ua1!) && !isNaN(ca1!)) {
      if (Math.abs(ua1! / ua2 - ca1! / ca2) < 0.001) return true
    }
  }

  return false
}
