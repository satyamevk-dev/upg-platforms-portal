const USER_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,}$/i;
const USER_EMAIL_MAX_LENGTH = 254;

export function isValidPortalUserEmail(value: string): boolean {
  const v = value.trim();
  if (v.length < 5 || v.length > USER_EMAIL_MAX_LENGTH) return false;
  return USER_EMAIL_REGEX.test(v);
}
