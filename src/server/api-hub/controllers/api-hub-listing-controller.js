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

    // Load entities via cache
    const state = await request.server.methods.getPlatformState(
      request.s3Client
    )

    // Only show APIs that are flagged as belonging to this hub
    const apis = Object.values(state)
      .filter((d) => d[hub] === true)
      .map((api) => addApiLinks(hub, api))

    const environment = config.get('cdpEnvironment')

    const hubName = _.capitalize(hub)
    return h.view('api-hub/views/api-hub', {
      pageTitle: `CDP ${hubName} API Developer Hub`,
      heading: `CDP ${hubName} API Developer Hub`,
      caption: environment,
      apis,
      hub
    })
  }
}
