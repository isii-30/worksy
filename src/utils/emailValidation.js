const COMMON_EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com',
  'live.com', 'aol.com', 'protonmail.com', 'zoho.com', 'gmx.com',
];

function levenshtein(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

export function getEmailFormatError(value) {
  const trimmed = value.trim();
  if (!trimmed) return 'Email address is required.';
  const shapeValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed);
  return shapeValid ? '' : 'Enter a valid email address.';
}

// Heuristic only — flags likely typos of well-known providers (gma.com ->
// gmail.com). Cannot confirm an address is real or deliverable; that needs
// a backend verification step (e.g. a confirmation email).
export function getEmailDomainSuggestion(value) {
  const trimmed = value.trim();
  const atIndex = trimmed.lastIndexOf('@');
  if (atIndex === -1) return null;

  const local = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex + 1).toLowerCase();
  if (!domain || COMMON_EMAIL_DOMAINS.includes(domain)) return null;

  let closest = null;
  let closestDistance = Infinity;
  for (const known of COMMON_EMAIL_DOMAINS) {
    const distance = levenshtein(domain, known);
    if (distance < closestDistance) {
      closestDistance = distance;
      closest = known;
    }
  }

  if (closest && closestDistance > 0 && closestDistance <= 2) {
    return `${local}@${closest}`;
  }
  return null;
}