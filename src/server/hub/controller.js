import { statusCodes } from '../common/constants/status-codes.js'
import Undici from 'undici'
import Joi from 'joi'

const hubValidation = Joi.string().valid('internal', 'public').required()

export const hubListingsController = {
  options: {
    validate: {
      params: Joi.object({
        hub: hubValidation
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

    return h.view('hub/hub', {
      pageTitle: `CDP ${hub} API Developer Hub`,
      heading: `CDP ${hub} API Developer Hub`,
      apis,
      hub
    })
  }
}

export const docsController = {
  options: {
    validate: {
      params: Joi.object({
        hub: hubValidation,
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

    const docUrl = `/hub/${encodeURIComponent(hub)}/${encodeURIComponent(service)}/api.json`
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

    return h.view('hub/docs-scalar', {
      pageTitle: `${service} API Docs`,
      heading: `${service} API Docs`,
      scalarConfig,
      hub
    })
  }
}

export const redocController = {
  options: {
    validate: {
      params: Joi.object({
        hub: hubValidation,
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

    const docUrl = `/hub/${encodeURIComponent(hub)}/${encodeURIComponent(service)}/api.json`
    return h.view('hub/docs-redoc', {
      docUrl
    })
  }
}

export const docsFetcherController = {
  options: {
    validate: {
      params: Joi.object({
        hub: hubValidation,
        service: Joi.string().required(),
        filename: Joi.string().required()
      })
    }
  },
  async handler(request, h) {
    const hub = request.params.hub
    const service = request.params.service
    const filename = request.params.filename

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
