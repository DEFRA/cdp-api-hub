import { transformEntities } from './transform-entities.js'

describe('transform-entities', () => {
  test('#transformEntities', () => {
    const input = {
      tenants: {
        'cdp-foo': {
          tenant: {
            urls: {
              'cdp-foo.internal': {
                type: 'internal'
              }
            }
          },
          metadata: {
            api_docs: {
              url: '/openapi/v1',
              doc_type: 'openapi',
              internal: true,
              external: false
            },
            teams: ['platform']
          }
        }
      }
    }

    const output = transformEntities(input)

    expect(output).toEqual({
      'cdp-foo': {
        id: 'cdp-foo',
        documentUrl: new URL('https://cdp-foo.internal/openapi/v1'),
        teams: ['platform'],
        docType: 'openapi',
        internal: true,
        external: false
      }
    })
  })
})
