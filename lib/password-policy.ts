/** Single source of truth for portal password rules (API, login, admin UI). */

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 10;

export function isPasswordPolicyCompliant(password: string): boolean {
  if (
    password.length < PASSWORD_MIN_LENGTH ||
    password.length > PASSWORD_MAX_LENGTH
  ) {
    return false;
  }
  if (/^\s+$/.test(password)) return false;
  return true;
}

export function passwordPolicyViolationMessage(): string {
  return `Password must be ${PASSWORD_MIN_LENGTH}–${PASSWORD_MAX_LENGTH} characters and cannot be only spaces.`;
}

/** Bullet lines for hint text in the UI. */
export function passwordPolicyRequirementLines(): readonly string[] {
  return [
    `${PASSWORD_MIN_LENGTH}–${PASSWORD_MAX_LENGTH} characters`,
    "Cannot be only spaces",
  ];
}
