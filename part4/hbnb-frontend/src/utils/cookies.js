const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function encodeValue(value) {
  return encodeURIComponent(value);
}

function decodeValue(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Set a cookie value.
 * @param {string} name
 * @param {string} value
 * @param {Object} options
 * @param {number} [options.maxAge=COOKIE_MAX_AGE] Max age in seconds
 * @param {string} [options.path="/"]
 * @param {boolean} [options.secure=true]
 * @param {boolean} [options.sameSiteStrict=true]
 */
export function setCookie(
  name,
  value,
  {
    maxAge = COOKIE_MAX_AGE,
    path = "/",
    secure = true,
    sameSiteStrict = true,
  } = {},
) {
  if (typeof document === "undefined") return;

  const parts = [
    `${encodeValue(name)}=${encodeValue(value)}`,
    `Path=${path}`,
    `Max-Age=${maxAge}`,
    sameSiteStrict ? "SameSite=Strict" : "SameSite=Lax",
  ];

  if (secure && typeof window !== "undefined" && window.location.protocol === "https:") {
    parts.push("Secure");
  }

  document.cookie = parts.join("; ");
}

/**
 * Get a cookie value by name.
 * @param {string} name
 * @returns {string | null}
 */
export function getCookie(name) {
  if (typeof document === "undefined") return null;

  const target = `${encodeValue(name)}=`;
  const cookies = document.cookie ? document.cookie.split(";") : [];

  for (const cookie of cookies) {
    const trimmed = cookie.trim();
    if (trimmed.startsWith(target)) {
      return decodeValue(trimmed.slice(target.length));
    }
  }
  return null;
}

/**
 * Delete a cookie by name.
 * @param {string} name
 * @param {Object} options
 * @param {string} [options.path="/"]
 */
export function deleteCookie(name, { path = "/" } = {}) {
  setCookie(name, "", { maxAge: 0, path });
}
