import { addApiLinks } from './add-api-links.js'

describe('#addApiLinks', () => {
  test('Should add service and Redoc links for OpenAPI docs', () => {
    const api = {
      id: 'service-api',
      docType: 'openapi',
      documentUrl: 'https://example.com/openapi.json'
    }

    expect(addApiLinks('internal', api)).toEqual({
      ...api,
      link: '/hub/internal/service-api/view/redoc',
      serviceLink: '/hub/internal/service-api'
    })
  })

  test('Should add service and hosted documentation links for hosted docs', () => {
    const api = {
      id: 'hosted-api',
      docType: 'hosted',
      documentUrl: 'https://example.com/docs'
    }

    expect(addApiLinks('external', api)).toEqual({
      ...api,
      link: 'https://example.com/docs',
      serviceLink: '/hub/external/hosted-api'
    })
  })

  test('Should encode service links', () => {
    const api = {
      id: 'service api',
      docType: 'openapi',
      documentUrl: 'https://example.com/openapi.json'
    }

    expect(addApiLinks('internal', api)).toEqual({
      ...api,
      link: '/hub/internal/service%20api/view/redoc',
      serviceLink: '/hub/internal/service%20api'
    })
  })
})
