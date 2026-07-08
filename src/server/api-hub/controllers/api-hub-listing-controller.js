import Joi from 'joi'
import { hubSchema } from '../helpers/schemas.js'
import { config } from '../../../config/config.js'
import _ from 'lodash'
import { addApiLinks } from '../helpers/add-api-links.js'

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
    const environment = config.get('cdpEnvironment')

    // Load entities via cache
    let apis = []
    const errors = []

    try {
      const state = await request.server.methods.getPlatformState(
        request.s3Client
      )

      // Only show APIs that are flagged as belonging to this hub
      apis = Object.values(state)
        .filter((d) => d[hub] === true)
        .map((api) => addApiLinks(hub, api))
    } catch (error) {
      request.logger.error(error)
      errors.push('API listings are unavailable.')
    }

    console.log(apis)
    const hubName = _.capitalize(hub)
    return h.view('api-hub/views/api-hub', {
      pageTitle: `CDP ${hubName} API Developer Hub`,
      heading: `CDP ${hubName} API Developer Hub`,
      caption: environment,
      apis,
      hub,
      errors
    })
  }
}
