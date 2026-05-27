import { addSeconds } from 'date-fns'

/**
 * @typedef {object} UserSession
 * @property {string} id
 * @property {string} email
 * @property {string} displayName
 * @property {string} loginHint
 * @property {boolean} isAuthenticated
 * @property {string} refreshToken
 * @property {string} refreshToken
 * @property {number} expiresIn
 * @property {string} expiresAt
 */

/**
 * @typedef {Object} AuthenticationResponse
 * @property {string} accessToken
 * @property {string} refreshToken
 * @property {number} expiresIn
 * @property {object} claims
 */

/**
 * Refresh user session
 * @param {import("@hapi/hapi").Request} request
 * @param {AuthenticationResponse} authenticationResponse
 * @param {string} sessionId
 * @returns {Promise<void | UserSession>}
 */
export async function saveUserSession(
  request,
  sessionId,
  { accessToken, refreshToken, expiresIn, claims }
) {
  const expiresInSeconds = expiresIn
  const expiresInMilliSeconds = expiresInSeconds * 1000
  const expiresAt = addSeconds(new Date(), expiresInSeconds).toISOString()

  const session = {
    id: claims.oid,
    displayName: claims.name,
    email: claims.email ?? claims.preferred_username,
    loginHint: claims.login_hint,
    isAuthenticated: true,
    accessToken,
    refreshToken,
    expiresIn: expiresInMilliSeconds,
    expiresAt
  }

  await request.server.sessionCache.set(sessionId, session)
  return session
}
