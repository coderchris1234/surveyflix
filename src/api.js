/**
 * api.js — Central API utility
 *
 * All fetch calls go through here. Import the functions you need
 * in any component instead of writing fetch() directly.
 *
 * Base URL is set once here — change it if the backend moves.
 *
 * Auth: after login the user's data (including id) is stored in
 * localStorage under "sf_user". Retrieve it with getUser().
 */

const BASE = 'https://surveyinfrastructure.onrender.com'

// ── helpers ──────────────────────────────────────────────────────────────────

async function request(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  if (body) opts.body = JSON.stringify(body)

  const res = await fetch(`${BASE}${path}`, opts)
  const json = await res.json().catch(() => ({}))

  if (!res.ok) {
    // Throw the server's message if available, otherwise a generic error
    throw new Error(json.message || `Request failed (${res.status})`)
  }
  return json // { message, data }
}

// ── Auth ─────────────────────────────────────────────────────────────────────

/**
 * signup — creates a new user account
 * @param {{ fullName, email, phoneNumber, password }} body
 */
export async function signup(body) {
  return request('POST', '/Duser', body)
}

/**
 * login — authenticates a user
 * @param {{ email, password }} body
 * Returns the full response; caller should save response.data to localStorage
 */
export async function login(body) {
  return request('POST', '/DLuser', body)
}

// ── Users ─────────────────────────────────────────────────────────────────────

export async function getAllUsers() {
  return request('GET', '/Duser')
}

export async function getUserById(id) {
  return request('GET', `/Duser/${id}`)
}

// ── Surveys ───────────────────────────────────────────────────────────────────

/**
 * getSurveys — fetches all available surveys from the backend
 */
export async function getSurveys() {
  return request('GET', '/Dsurvey')
}

/**
 * completeSurvey — marks a survey as completed for a user
 * @param {string} userId  — the logged-in user's ID
 * @param {string} surveyId — the survey's ID
 */
export async function completeSurvey(userId, surveyId) {
  return request('POST', `/Dsurvey/${userId}/${surveyId}`)
}

// ── Local session helpers ─────────────────────────────────────────────────────

/** Save only the user ID to localStorage after login */
export function saveUser(userData) {
  // Store the full user object returned by login — used directly in the dashboard
  localStorage.setItem('sf_user', JSON.stringify(userData))
}

/** Get the cached user object from login response */
export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('sf_user'))
  } catch {
    return null
  }
}

/** Get just the stored user ID */
export function getUserId() {
  const user = getUser()
  return user?.id || user?._id || null
}

/** Clear session (logout) */
export function clearUser() {
  localStorage.removeItem('sf_user')
}

// ── Per-user progress persistence ─────────────────────────────────────────────
// Points and completed survey IDs are stored per user ID so they survive
// sign out / sign in. Key format: sf_progress_{userId}

function progressKey(userId) {
  return `sf_progress_${userId}`
}

/** Load saved points and completedIds for a user */
export function loadProgress(userId) {
  try {
    const saved = JSON.parse(localStorage.getItem(progressKey(userId)))
    return saved || { points: 0, completedIds: [] }
  } catch {
    return { points: 0, completedIds: [] }
  }
}

/** Save updated points and completedIds for a user */
export function saveProgress(userId, points, completedIds) {
  localStorage.setItem(progressKey(userId), JSON.stringify({ points, completedIds }))
}
