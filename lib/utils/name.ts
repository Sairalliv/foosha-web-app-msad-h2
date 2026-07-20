// Shared helper for turning a profile's full name (or, failing that, their
// login email) into something presentable in a welcome header/sidebar.
//
// Rules:
//  - Prefer the profile's full_name when set.
//  - Otherwise fall back to the email, but for @gmail.com addresses show
//    only the local part (before the "@") rather than the whole address.
//  - If neither is available, fall back to a generic greeting.
export function getDisplayName(
  fullName?: string | null,
  email?: string | null,
  fallback: string = 'there'
): string {
  if (fullName && fullName.trim()) {
    return fullName.trim()
  }

  if (email) {
    const atIndex = email.indexOf('@')
    if (atIndex > -1 && email.slice(atIndex + 1).toLowerCase() === 'gmail.com') {
      return email.slice(0, atIndex)
    }
    return email
  }

  return fallback
}
