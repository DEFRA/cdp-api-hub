import { hubSchema } from '../helpers/schema.js'
import { statusCodes } from '../../common/constants/status-codes.js'
import Joi from 'joi'

export const redocViewController = {
  options: {
    validate: {
      params: Joi.object({
        hub: hubSchema,
        service: Joi.string().required()
      })
    }
  },
  async handler(request, h) {
    const hub = request.params.hub
    const service = request.params.service

    const state = await request.server.methods.getPlatformState(
      request.s3Client
    )
    const apiDocs = state[service]

    if (!apiDocs) {
      return h
        .response({
          message: 'Not found'
        })
        .code(statusCodes.notFound)
    }

    if (apiDocs.docs[hub] !== true) {
      return h
        .response({
          message: 'Not found'
        })
        .code(statusCodes.notFound)
    }

    const docUrl = `/hub/${encodeURIComponent(hub)}/${encodeURIComponent(service)}/docs`
    return h.view('api-hub/views/docs-redoc', {
      pageTitle: `${service} API Docs`,
      heading: `${service} API Docs`,
      breadcrumbs: [
        {
          text: 'API Hub',
          href: `/hub/${encodeURIComponent(hub)}`
        },
        {
          text: `${service} API Docs`
        }
      ],
      docUrl
    })
  }
}
