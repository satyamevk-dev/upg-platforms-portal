import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/lib/password-policy";

export type PasswordStrengthLevel =
  | "empty"
  | "invalid"
  | "weak"
  | "fair"
  | "good"
  | "strong";

export type PasswordStrength = {
  level: PasswordStrengthLevel;
  /** 0–100 for the bar width */
  percent: number;
  /** Empty when `level` is `empty` */
  label: string;
};

function countCharacterClasses(password: string): number {
  let n = 0;
  if (/[a-z]/.test(password)) n += 1;
  if (/[A-Z]/.test(password)) n += 1;
  if (/[0-9]/.test(password)) n += 1;
  if (/[^A-Za-z0-9\s]/.test(password)) n += 1;
  return n;
}

/**
 * Heuristic strength for UI only (not enforced by the API).
 * Favors length and character-class variety (lower, upper, digit, symbol).
 */
export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { level: "empty", percent: 0, label: "" };
  }

  if (password.length > PASSWORD_MAX_LENGTH) {
    return { level: "invalid", percent: 28, label: "Too long" };
  }

  if (password.length < PASSWORD_MIN_LENGTH || /^\s+$/.test(password)) {
    return { level: "invalid", percent: 28, label: "Too short" };
  }

  const classes = countCharacterClasses(password);
  const len = password.length;

  if (classes <= 1) {
    return { level: "weak", percent: 38, label: "Weak" };
  }
  if (classes === 2) {
    return { level: "fair", percent: 58, label: "Fair" };
  }
  if (classes === 3) {
    const pct = len >= PASSWORD_MAX_LENGTH ? 82 : 72;
    return { level: "good", percent: pct, label: "Good" };
  }

  if (len >= PASSWORD_MAX_LENGTH) {
    return { level: "strong", percent: 100, label: "Strong" };
  }
  return { level: "good", percent: 88, label: "Good" };
}
