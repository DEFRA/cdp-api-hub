import { statusCodes } from '../common/constants/status-codes.js'

// This is for debugging/forcing reloads etc
export const reloadDocsController = {
  async handler(request, h) {
    try {
      const result = await request.server.methods.getPlatformState(
        request.s3Client
      )
      console.log(result)
      return h.response().code(statusCodes.ok)
    } catch (error) {
      console.log(error)
      return h
        .response({
          message: error.message
        })
        .code(statusCodes.internalServerError)
    }
  }
}

export const getHubListingsController = {
  async handler(request, h) {
    const hub = request.params.hub

    // Load entities via cache
    const state = await request.server.methods.getPlatformState(
      request.s3Client
    )

    // Filter by hub type
    // TODO: we need to decide on what this data looks like/what combos we support

    // Build a list of names + other details
    const apis = Object.values(state).map((s) => s.id)

    return h.response('TODO').type('text/html').code(statusCodes.ok)
  }
}

export const getDocController = {
  async handler(request, h) {
    // Reload cache if needed (server methods?)

    // Find the entity & json url
    // See if we have it cached on disk
    // Otherwise pull it, cache it
    // And stream it back
    const document = {}

    if (!document) {
      return h
        .response({
          message: 'Not found'
        })
        .code(statusCodes.notFound)
    }

    return h.response(document).type('application/json').code(statusCodes.ok)
  }
}
