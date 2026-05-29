import Joi from 'joi'
import _ from 'lodash'

import { statusCodes } from '../../common/constants/status-codes.js'
import { config } from '../../../config/config.js'
import { hubSchema } from '../helpers/schemas.js'
import { addApiLinks } from '../helpers/add-api-links.js'

export const hubServiceController = {
  options: {
    validate: {
      params: Joi.object({
        hub: hubSchema,
        service: Joi.string().required()
      })
    }
  },
  async handler(request, h) {
    const { hub, service } = request.params

    const state = await request.server.methods.getPlatformState(
      request.s3Client
    )

    const apiDocs = state[service]

    if (!apiDocs || apiDocs[hub] !== true) {
      return h
        .response({
          message: 'Not found'
        })
        .code(statusCodes.notFound)
    }

    const api = addApiLinks(hub, apiDocs)
    const hubName = _.capitalize(hub)

    return h.view('api-hub/views/api-service', {
      pageTitle: `${api.id}`,
      heading: `${api.id}`,
      caption: config.get('cdpEnvironment'),
      api,
      breadcrumbs: [
        {
          text: `CDP ${hubName} API Developer Hub`,
          href: `/hub/${encodeURIComponent(hub)}`
        },
        {
          text: `${api.id} API`
        }
      ]
    })
  }
}
