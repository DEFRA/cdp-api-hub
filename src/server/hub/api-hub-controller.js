import Joi from 'joi'
import { hubSchema } from './schema.js'

export const hubListingsController = {
  options: {
    validate: {
      params: Joi.object({
        hub: hubSchema
      })
    }
  },
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

    return h.view('hub/views/hub', {
      pageTitle: `CDP ${hub} API Developer Hub`,
      heading: `CDP ${hub} API Developer Hub`,
      apis,
      hub
    })
  }
}
