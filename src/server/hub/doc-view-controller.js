import { hubSchema } from './schema.js'
import { statusCodes } from '../common/constants/status-codes.js'
import Joi from 'joi'

export const scalarViewController = {
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

    const docUrl = `/hub/${encodeURIComponent(hub)}/${encodeURIComponent(service)}/docs`
    const baseUrl = apiDocs.urls?.internal

    const scalarConfig = {
      url: docUrl,
      baseServerURL: baseUrl,
      agent: {
        disabled: true
      },
      hideTestRequestButton: true,
      defaultHttpClient: {
        targetKey: 'node',
        clientKey: 'undici'
      },
      metaData: {
        title: `${service} API Docs`,
        description: `${service} API Docs`
      },
      servers: Object.entries(apiDocs.urls).map(([url, info]) => ({
        url,
        description: info.type
      }))
    }

    return h.view('hub/views/docs-scalar', {
      pageTitle: `${service} API Docs`,
      heading: `${service} API Docs`,
      scalarConfig,
      hub
    })
  }
}

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

    const docUrl = `/hub/${encodeURIComponent(hub)}/${encodeURIComponent(service)}/docs`
    return h.view('hub/views/docs-redoc', {
      docUrl
    })
  }
}
