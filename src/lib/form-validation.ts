const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(value: string): string {
  if (!value.trim()) return 'Email is required.'
  if (!EMAIL_RE.test(value.trim())) return 'Enter a valid email address.'
  return ''
}

/** Login only — does not enforce strength (existing accounts may have weak passwords). */
export function validatePassword(value: string): string {
  if (!value) return 'Password is required.'
  return ''
}

/**
 * Registration / password-change — enforces the full strength policy:
 * 8+ chars, uppercase, lowercase, number, special character.
 */
export function validateNewPassword(value: string): string {
  if (!value) return 'Password is required.'
  if (value.length < 8) return 'Password must be at least 8 characters.'
  if (!/[A-Z]/.test(value)) return 'Must include at least 1 uppercase letter (A–Z).'
  if (!/[a-z]/.test(value)) return 'Must include at least 1 lowercase letter (a–z).'
  if (!/\d/.test(value)) return 'Must include at least 1 number (0–9).'
  if (!/[^a-zA-Z\d]/.test(value)) return 'Must include at least 1 special character (!@#$%…).'
  return ''
}

export function validateName(value: string): string {
  if (!value.trim()) return 'Full name is required.'
  if (value.trim().length < 2) return 'Name must be at least 2 characters.'
  return ''
}

export function validatePhone(value: string): string {
  if (!value) return ''
  if (!/^\d{10}$/.test(value)) return 'Enter a valid 10-digit phone number.'
  return ''
}

export function validateConfirmPassword(password: string, confirm: string): string {
  if (!confirm) return 'Please confirm your password.'
  if (confirm !== password) return 'Passwords do not match.'
  return ''
}
