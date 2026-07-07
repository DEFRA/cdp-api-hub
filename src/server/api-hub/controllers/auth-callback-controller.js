import { randomUUID } from 'node:crypto'

import Boom from '@hapi/boom'
import escape from 'lodash/escape.js'
import { saveUserSession } from '../../common/helpers/save-user-session.js'
import { sessionNames } from '../helpers/constants.js'

export const authCallbackController = {
  handler: async (request, h) => {
    const credentials = await request.callback(h)

    if (!credentials) {
      throw Boom.unauthorized()
    }

    const { sessionCookie, yar, logger } = request

    const sessionId = randomUUID()

    logger.info(`Creating user session ${sessionId}`)
    const session = await saveUserSession(request, sessionId, credentials)

    sessionCookie.set({ sessionId })
    logger.info(
      `User logged in sessionId: ${sessionId} userId: ${session.id} displayName: ${session.displayName}`
    )

    const redirect = yar.flash(sessionNames.referrer)?.at(0) ?? '/'
    logger.info(`Login complete, redirecting user to ${redirect}`)
    // todo do we need this or can we just redirect with a takeover?
    return h
      .response(
        `<html><head><meta http-equiv="refresh" content="0;URL='${escape(redirect)}'"></head><body></body></html>`
      )
      .takeover()
  }
}
