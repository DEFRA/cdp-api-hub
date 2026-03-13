import { hubSchema } from './schema.js'
import { statusCodes } from '../common/constants/status-codes.js'

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
    const service = request.params.service

    const state = await request.server.methods.getPlatformState(
      request.s3Client
    )
    const apiDocs = state[service]
    console.log(state)
    if (!apiDocs) {
      console.log(state)
      return h
        .response({
          message: 'Service not found'
        })
        .code(statusCodes.notFound)
    }

    // try and fetch the API spec
    const docsUrl = apiDocs.documentUrl

    request.logger.info(`getting docs from ${apiDocs.documentUrl}`)

    const { statusCode, headers, body } = await Undici.request(docsUrl)
    // TODO: cache this?
    return h.response(body).code(statusCode).type(headers['content-type'])
  }
}
