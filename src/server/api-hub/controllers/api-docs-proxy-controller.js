import { hubSchema } from '../helpers/schemas.js'
import { statusCodes } from '../../common/constants/status-codes.js'

import Undici from 'undici'
import Joi from 'joi'

export const apiDocsProxyController = {
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
          message: 'Service not found'
        })
        .code(statusCodes.notFound)
    }

    // Check api can be viewed from this hub and is an OpenAPI document
    if (apiDocs.docType !== 'openapi' || apiDocs[hub] !== true) {
      return h
        .response({
          message: 'Not found'
        })
        .code(statusCodes.notFound)
    }

    request.logger.info(`getting docs from ${apiDocs.documentUrl}`)

    const { statusCode, headers, body } = await Undici.request(
      apiDocs.documentUrl
    )
    // TODO: cache this?
    return h.response(body).code(statusCode).type(headers['content-type'])
  }
}
